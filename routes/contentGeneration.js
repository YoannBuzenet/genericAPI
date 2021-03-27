const { generateContent } = require("../controllers/contentGeneration");
const { langReverted } = require("../services/langs");
const db = require("../models/index");

module.exports = function (fastify, opts, done) {
  fastify.post(
    "/",
    {
      schema: {
        body: {
          type: "object",
          required: [
            "category",
            "lang",
            "userInput",
            "passphrase",
            "idUser",
            "provider",
          ],
          properties: {
            category: { type: "integer" },
            lang: { type: "string", minLength: 2 },
            userInput: { type: "string", minLength: 5 },
            passphrase: { type: "string", minLength: 5 },
            idUser: { type: "string" },
            provider: { type: "string" },
          },
        },
      },
    },
    async (req, reply) => {
      if (req.body.passphrase !== process.env.FRONT_APP_PASSPHRASE) {
        reply.code(406).send("Passphrase doesn't match.");
        return;
      }

      // Verify that user is logged
      // yo

      // Check if category exists
      const categoryIdChecked = await db.Category.findOne({
        where: { id: req.body.category },
      });

      if (categoryIdChecked === null) {
        reply.code(406).send("Category doesn't exist.");
        return;
      }

      if (!Object.keys(langReverted).includes(req.body.lang)) {
        // Check if lang is currently treated by our code
        reply.code(406).send("This lang is not treated currently.");
        return;
      }

      const aiResponse = await generateContent(
        req.body.category,
        req.body.lang,
        req.body.userInput
      );
      return { response: aiResponse };
    }
  );

  done();
};
