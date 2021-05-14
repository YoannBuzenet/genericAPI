const db = require("../models/index");
var Bugsnag = require("@bugsnag/js");
const { middlewarePassPhraseCheck } = require("../middlewares/checkPassphrase");

module.exports = function (fastify, opts, done) {
  middlewarePassPhraseCheck(fastify);

  // Get all snippets
  fastify.get(
    "/",
    {
      schema: {},
    },
    async (req, reply) => {
      const result = await db.Snippet.findAll();

      reply.code(200).send(result);
      return;
    }
  );

  // Get one snippet
  fastify.get(
    "/byId",
    {
      schema: {
        required: ["id"],
        querystring: {
          id: { type: "integer" },
        },
      },
    },
    async (req, reply) => {
      const result = await db.Snippet.findOne({
        where: {
          id: req.query.id,
        },
      });

      reply.code(200).send(result);
      return;
    }
  );

  // Edit one snippet
  fastify.put(
    "/:id",
    {
      schema: {
        params: {
          type: "object",
          id: "integer",
        },
        body: {
          required: ["fr", "en", "categoryId", "isDefault"],
          properties: {
            fr: { type: "string" },
            en: { type: "string" },
            categoryId: { type: "integer" },
            isDefault: { type: "integer" },
          },
        },
      },
    },
    async (req, reply) => {
      const snippet = await db.Category.findOne({
        where: {
          id: req.query.id,
        },
      });

      try {
        // change object, save it
        snippet.fr = req.body.fr;
        snippet.en = req.body.en;
        snippet.categoryId = req.body.categoryId;
        snippet.isDefault = req.body.isDefault;

        const savedSnippet = await snippet.save();

        reply.code(200).send(savedSnippet);
        return;
      } catch (e) {
        console.log("error when editing a snippet", e);
        Bugsnag.notify(new Error(e));
        reply.code(500).send("Error when editing a snippet");
      }
    }
  );
  done();
};
