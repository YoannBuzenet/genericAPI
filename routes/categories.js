const db = require("../models/index");
var Bugsnag = require("@bugsnag/js");
const { middlewarePassPhraseCheck } = require("../middlewares/checkPassphrase");

module.exports = function (fastify, opts, done) {
  middlewarePassPhraseCheck(fastify);

  // Get all categories
  fastify.get(
    "/",
    {
      schema: {
        querystring: {
          active: { type: "boolean" },
        },
      },
    },
    async (req, reply) => {
      console.log("req.query.active", req.query.active);
      console.log("typeof req.query.active", typeof req.query.active);

      let filterObject = {};
      if (req.query.active && req.query.active === true) {
        filterObject = {
          where: {
            isActive: 1,
          },
        };
      }

      const result = await db.Category.findAll(filterObject);

      reply.code(200).send(result);
      return;
    }
  );

  // Get one category
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
      const result = await db.Category.findOne({
        where: {
          id: req.query.id,
        },
      });

      reply.code(200).send(result);
      return;
    }
  );

  // Edit one category
  fastify.put(
    "/:id",
    {
      schema: {
        params: {
          type: "object",
          id: "integer",
        },
        body: {
          type: "object",
          required: [
            "userMaxInputLength",
            "maxLengthTokens",
            "numberOfAIOutput",
            "parentCategoryName",
            "shouldRemoveUnfinishedSentenceInResults",
            "isActive",
            "temperature",
            "numberOfUserInputs",
          ],
          properties: {
            userMaxInputLength: { type: "integer" },
            maxLengthTokens: { type: "integer" },
            numberOfAIOutput: { type: "integer" },
            parentCategoryName: { type: "string" },
            shouldRemoveUnfinishedSentenceInResults: { type: "integer" },
            isActive: { type: "integer" },
            temperature: { type: "integer" },
            numberOfUserInputs: { type: "integer" },
          },
        },
      },
    },
    async (req, reply) => {
      const category = await db.Category.findOne({
        where: {
          id: req.query.id,
        },
      });

      try {
        // change object, save it
        category.userMaxInputLength = req.body.userMaxInputLength;
        category.maxLengthTokens = req.body.maxLengthTokens;
        category.numberOfAIOutput = req.body.numberOfAIOutput;
        category.parentCategoryName = req.body.parentCategoryName;
        category.shouldRemoveUnfinishedSentenceInResults =
          req.body.shouldRemoveUnfinishedSentenceInResults;
        category.isActive = req.body.isActive;
        category.temperature = req.body.temperature;
        category.numberOfUserInputs = req.body.numberOfUserInputs;

        const savedCategory = await category.save();

        reply.code(200).send(savedCategory);
        return;
      } catch (e) {
        console.log("error when editing a category", e);
        Bugsnag.notify(new Error(e));
        reply.code(500).send("Error when editing a category");
      }
    }
  );

  // Create one category
  fastify.post(
    "/",
    {
      schema: {
        body: {
          type: "object",
          required: [
            "userMaxInputLength",
            "maxLengthTokens",
            "numberOfAIOutput",
            "parentCategoryName",
            "shouldRemoveUnfinishedSentenceInResults",
            "isActive",
            "temperature",
            "numberOfUserInputs",
          ],
          properties: {
            userMaxInputLength: { type: "integer" },
            maxLengthTokens: { type: "integer" },
            numberOfAIOutput: { type: "integer" },
            parentCategoryName: { type: "string" },
            shouldRemoveUnfinishedSentenceInResults: { type: "integer" },
            isActive: { type: "integer" },
            temperature: { type: "integer" },
            numberOfUserInputs: { type: "integer" },
          },
        },
      },
    },
    async (req, reply) => {
      const neWcategory = {
        userMaxInputLength: req.body.userMaxInputLength,
        maxLengthTokens: req.body.maxLengthTokens,
        numberOfAIOutput: req.body.numberOfAIOutput,
        parentCategoryName: req.body.parentCategoryName,
        shouldRemoveUnfinishedSentenceInResults:
          req.body.shouldRemoveUnfinishedSentenceInResults,
        isActive: req.body.isActive,
        temperature: req.body.temperature,
        numberOfUserInputs: req.body.numberOfUserInputs,
      };

      try {
        const savedCategory = await db.Category.create(neWcategory);

        reply.code(200).send(savedCategory);
        return;
      } catch (e) {
        console.log("error when creating a category", e);
        Bugsnag.notify(new Error(e));
        reply.code(500).send("Error when creating a category");
      }
    }
  );
  done();
};
