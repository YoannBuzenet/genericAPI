const axios = require("axios");
const db = require("../models");
const { langReverted } = require("../services/langs");

// TO DO
// /!\ the cutting method should be linked to the category
// /!\ the max length of token should be linked to the category
// /!\ Toujours mettre une maj au premier charac de l'user input et passer le reste en lowercase
// /!\ Toujours remove first space de la rep AI

const generateContent = async (
  categoryId,
  lang,
  userInput,
  maxLength = 160
) => {
  // 1. Searching for the right snippet
  const snippet = await db.Snippet.findOne({
    where: {
      categoryId,
    },
  });

  const currentSnippet = snippet.dataValues[langReverted[lang]];

  // 2. Replace the variable in the snippet with the user Input
  const snippetWithUserInput = currentSnippet.replace("{{name}}", userInput);

  const finalObject = {
    prompt: snippetWithUserInput,
    max_tokens: maxLength,
    temperature: 0.5,
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
