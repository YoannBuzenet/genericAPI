const axios = require("axios");
const db = require("../models");
const { langReverted } = require("../services/langs");
const {
  countWordsInString,
  removeUnfinishedSentenceInString,
} = require("../services/utils");
const { ENDPOINT_FILTER_OPEN_AI } = require("../config/settings");

const generateContent = async (categoryId, lang, userInput, numberOfOutput) => {
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
    .catch((error) => console.log("error while contacting Open AI : ", error));

  // 4. Get back AI output, cut it at the first \n
  console.log("digging yoooo", openAiResponse?.data?.choices);
  let numberOfWordsUsedInResp = 0;
  const apiResp = openAiResponse?.data?.choices
    .map((oneResp) => oneResp.text)
    .map((text) => text.trim())
    .map((text) => {
      numberOfWordsUsedInResp += countWordsInString(
        removeUnfinishedSentenceInString(text)
      );
      return removeUnfinishedSentenceInString(text);
    })
    .filter((text) => text.length > 10);

  console.log("resp sent back to Next :", apiResp);
  console.log("number of words used : ", numberOfWordsUsedInResp);

  // 5 . Return AI output
  return { apiResp, numberOfWords: numberOfWordsUsedInResp };
};

const validateAIOutput = async (prompt) => {
  const promptForOpenAI = `<|endoftext|>${prompt}\n--\nLabel:`;

  //call the filter with prompt
  const aiCall = await axios.post(ENDPOINT_FILTER_OPEN_AI, promptForOpenAI, {
    headers: {
      Authorization: "Bearer " + process.env.OPEN_AI_KEY,
      "Content-Type": "application/json",
    },
  });

  // parse answer, give boolean

  const TOXICITY_THRESHOLD = -0.355;

  return true;
};

module.exports = { generateContent };
