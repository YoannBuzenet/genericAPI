const axios = require("axios");
const db = require("../models");
const { langReverted } = require("../services/langs");

// TO DO
// /!\ the cutting method should be linked to the category
// /!\ Toujours mettre une maj au premier charac de l'user input et passer le reste en lowercase
// /!\ Toujours remove first space de la rep AI

const generateContent = async (categoryId, lang, userInput) => {
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

  console.log("category :", category);

  const currentSnippet = snippet.dataValues[langReverted[lang]];

  // 2. Replace the variable in the snippet with the user Input
  let snippetWithUserInput;
  if (numberOfInputs === 1) {
    snippetWithUserInput = currentSnippet.replace("{{value}}", userInput);
  } else {
    for (let i = 0; i < numberOfInputs; i++) {
      snippetWithUserInput = currentSnippet.replace(
        `{{value${i + 1}}}`,
        userInput[i]
      );
    }
  }

  const finalObject = {
    prompt: snippetWithUserInput,
    max_tokens: category.dataValues.maxLengthTokens,
    temperature: 0.7,
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
  const apiResp = openAiResponse?.data?.choices;
  const apiFirstChoice = apiResp[0].text;
  const apiRespCut = apiFirstChoice.split("\n")[0];

  // 5 . Return AI output
  return apiRespCut;
};

module.exports = { generateContent };
