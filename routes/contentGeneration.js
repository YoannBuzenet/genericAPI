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
          required: ["category", "lang", "userInput"],
          properties: {
            categoryId: { type: "integer" },
            lang: { type: "string" },
            userInput: { type: "string" },
          },
        },
      },
    },
    async (req, reply) => {
      // To check : should we escape user Input ? As it's sent directly to an API, XSS seems impossible there ?
      // if needed : npm install validator

      // Check if category exists
      const categoryIdChecked = await db.Category.findOne({
        where: { id: req.body.categoryId },
      });
      if (categoryIdChecked === null) {
        reply.code(406).send("Category doesn't exist.");
        return;
      }

      if (!req.body.lang in Object.keys(langReverted)) {
        // Check if lang is currently treated by our code
        reply.code(406).send("Lang is not treated currently.");
        return;
      }

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
