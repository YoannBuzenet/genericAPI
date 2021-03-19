const { generateContent } = require("../controllers/contentGeneration");

module.exports = function (fastify, opts, done) {
  fastify.post(
    "/",
    {
      schema: {
        body: {
          type: "object",
          required: ["category", "lang", "userInput"],
          properties: {
            categoryId: { type: "integer" },
            lang: { type: "string" },
            userInput: { type: "string" },
          },
        },
      },
    },
    (req, res) => {
      // 1. Escape user input

      // 2. L'envoyer dans la fonction de génération de string
      const aiResponse = generateContent(
        req.body.categoryId,
        req.body.lang,
        req.body.userInput
      );
      return { response: aiResponse };
    }
  );

  done();
};
