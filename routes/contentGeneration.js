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
            category: { type: "integer" },
            lang: { type: "string", minLength: 2 },
            userInput: { type: "string", minLength: 5 },
          },
        },
      },
    },
    async (req, reply) => {
      // To check : should we escape user Input ? As it's sent directly to an API, XSS seems impossible there ?
      // if needed : npm install validator

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
        reply.code(406).send("Lang is not treated currently.");
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
