const axios = require("axios");
const db = require("../models");
const { langReverted } = require("../services/langs");
const {
  countWordsInString,
  removeUnfinishedSentenceInString,
  getTodayinDATEONLYInUTC,
} = require("../services/utils");
const { ENDPOINT_FILTER_OPEN_AI } = require("../config/settings");
var Bugsnag = require("@bugsnag/js");

const generateContent = async (
  categoryId,
  lang,
  userInput,
  numberOfOutput,
  userData
) => {
  // 0. Tracking the request to make statistics.
  // We do not await success on this call to not slow down the calling process.
  db.CallToService.create({
    user_id: userData.dataValues.id,
    isUserSubscribedForThisCall: userData.dataValues.isOnFreeAccess === 0,
    isUserOnCompanyAccessForThisCall:
      userData.dataValues.isOnCompanyAccess === 1,
    date: getTodayinDATEONLYInUTC(),
    categoryUsed: categoryId,
    locale: langReverted[lang],
  });

  // 1. Searching for the right snippet
  //TODO later, add la recherche par combinaison unique d'attribut (déjà écrite)
  const snippet = await db.Snippet.findOne({
    where: {
      categoryId,
    },
  });

  const category = await db.Category.findOne({
    where: {
      id: categoryId,
    },
  });

  const numberOfInputs = category.dataValues.numberOfUserInputs;

  const currentSnippet = snippet.dataValues[langReverted[lang]];

  // 2. Replace the variable in the snippet with the user Input
  let snippetWithUserInput = currentSnippet;
  if (numberOfInputs === 1) {
    snippetWithUserInput = snippetWithUserInput.replace(
      "{{value}}",
      userInput[0].value
    );
  } else {
    for (let i = 0; i < numberOfInputs; i++) {
      const keyToFind = `value${i + 1}`;

      const relevantValue = userInput.find((input) =>
        input.hasOwnProperty(keyToFind)
      );

      const valueToFind = `{{${keyToFind}}}`;

      snippetWithUserInput = snippetWithUserInput.replace(
        valueToFind,
        relevantValue[keyToFind]
      );
    }
  }

  // Checking the number of output is defined and not too high
  let numberOutputAI = numberOfOutput;
  if (isNaN(parseInt(numberOutputAI))) {
    numberOutputAI = 1;
  }
  if (numberOutputAI > 3) {
    numberOutputAI = 3;
  }

  const finalObject = {
    prompt: snippetWithUserInput,
    n: numberOutputAI,
    max_tokens: category.dataValues.maxLengthTokens,
    temperature: category.dataValues.temperature,
    stop: ["\n", "<|endoftext|>"],
  };

  console.log("final object:", finalObject);

  // 3. Send it to Open AI
  const openAiResponse = await axios
    .post(process.env.OPEN_AI_DAVINCI_ENGINE, finalObject, {
      headers: {
        Authorization: "Bearer " + process.env.OPEN_AI_KEY,
        "Content-Type": "application/json",
      },
    })
    .catch((error) => {
      console.log("error while contacting Open AI : ", error);
      Bugsnag.notify(new Error(err));
    });

  // 4. Get back AI output, cut it at the first \n
  let numberOfWordsUsedInResp = 0;

  const APiRespTextsExtracted = openAiResponse?.data?.choices.map(
    (oneResp) => oneResp.text
  );

  const trimedTexts = APiRespTextsExtracted.map((text) => text.trim());

  const cleanedTexts = trimedTexts.map((text) => {
    numberOfWordsUsedInResp += countWordsInString(
      removeUnfinishedSentenceInString(text)
    );
    return removeUnfinishedSentenceInString(text);
  });

  const filteredTexts = cleanedTexts.filter((text) => text.length > 10);

  //Checking each AI output with Open AI Content filter and making sure it's safe

  const aiCheckedText = filteredTexts.map((text) => {
    // open AI Validation is applied only on english texts
    if (lang === "en-US") {
      return validateAIOutput(text);
    } else {
      return true;
    }
  });

  let finalAIOutput = [];
  let numberOfWordsFiltered = 0;
  return Promise.all(aiCheckedText).then(async function (results) {
    for (let i = 0; i < results.length; i++) {
      if (results[i] === true) {
        finalAIOutput = [...finalAIOutput, filteredTexts[i]];
      } else {
        numberOfWordsFiltered = numberOfWordsFiltered + filteredTexts[i].length;
      }
    }

    //Saving filtered AI outputs for statistics purpose
    const numberOfFilteredOutputs = results.filter((result) => result === false)
      .length;

    const wasAllInputFiltered =
      numberOfFilteredOutputs === filteredTexts.length;

    if (numberOfFilteredOutputs > 0) {
      const savedFilteredOutput = await db.FilteredOpenAIInput.create({
        user_id: userData.dataValues.id,
        date: getTodayinDATEONLYInUTC(),
        wordsFiltered: numberOfWordsFiltered,
        numberOfOutputsFiltered: numberOfFilteredOutputs,
        wasFullyFiltered: wasAllInputFiltered,
      });
    }

    console.log("final AI output", finalAIOutput);

    // 5 . Return AI output
    return {
      apiResp: finalAIOutput,
      numberOfWords: numberOfWordsUsedInResp,
      wasAllInputFiltered,
    };
  });
};

// Open AI gives us a free API to flag if a content is misapropried or not. We use that filter on each output we receive.
const validateAIOutput = async (prompt) => {
  const promptForOpenAI = {
    prompt: `<|endoftext|>${prompt}\n--\nLabel:`,
    max_tokens: 1,
    temperature: 0,
    top_p: 0,
    logprobs: 10,
  };
  console.log("wtf ?");

  let response;
  //call the filter with prompt
  try {
    response = await axios.post(ENDPOINT_FILTER_OPEN_AI, promptForOpenAI, {
      headers: {
        Authorization: "Bearer " + process.env.OPEN_AI_KEY,
        "Content-Type": "application/json",
      },
    });
  } catch (e) {
    Bugsnag.notify(new Error(e));
    console.log("err when calling conten filter on open AI", e);
  }

  const TOXICITY_THRESHOLD = -0.355;
  const output_label = response?.data?.["choices"]?.[0]?.["text"];

  if (output_label === "2") {
    // If the model returns "2", return its confidence in 2 or other output-labels
    const logprobs =
      response?.data?.["choices"]?.[0]["logprobs"]?.["top_logprobs"]?.[0];

    // If the model is not sufficiently confident in "2",
    // choose the most probable of "0" or "1"
    // Guaranteed to have a confidence for 2 since this was the selected token.
    if (logprobs["2"] < TOXICITY_THRESHOLD) {
      logprob_0 = logprobs["0"];
      logprob_1 = logprobs["1"];

      if (logprob_0 && logprob_1) {
        return true;
      } else if (logprob_0) {
        return true;
      } else if (logprob_1) {
        return true;
      }
    } else {
      // Output is still classified as 2
      return false;
    }
  } else if (output_label === "1") {
    return true;
  } else if (output_label === "0") {
    return true;
  } else {
    return false;
  }
};

module.exports = { generateContent };
