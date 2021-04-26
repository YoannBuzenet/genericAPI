const userCheck = require("../services/userCheck");
const db = require("../models/index");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

module.exports = function (fastify, opts, done) {
  fastify.post(
    "/checkIfLogged",
    {
      schema: {
        body: {
          type: "object",
          required: ["userID", "provider", "accessToken"],
          properties: {
            userID: { type: "integer" },
            provider: { type: "string" },
            accessToken: { type: "string" },
          },
        },
      },
    },
    async (req, reply) => {
      // check if user is logged
      const isUserLogged = await userCheck.checkIfLogged(
        req.body.userID,
        req.body.accessToken,
        req.body.provider
      );

      //TODO Boolean

      if (isUserLogged) {
        return "User is logged";
      } else {
        return "User is not logged";
      }
    }
  );

  fastify.post("/testGetSnippets", async (req, reply) => {
    let categoryID = req.body.categoryId;
    let attributes = req.body.attributes;

    let request;
    if (Array.isArray(attributes) && attributes.length > 0) {
      let attributesObject = [];
      for (let i = 0; i < attributes.length; i++) {
        attributesObject = [...attributesObject, { id: attributes[i].id }];
      }

      request = {
        include: [
          {
            model: db.Attribute,
            where: {
              [Op.and]: attributesObject,
            },
          },
        ],
      };
    } else {
      request = {
        where: {
          categoryId: categoryID,
          isDefault: 1,
        },
      };
    }
    const snippets = await db.Snippet.findOne(request);
    reply.send(snippets);
  });

  fastify.post("/testGetSnippetsByCategoryID", async () => {
    const snippets = await db.Snippet.getSnippetByCategoryID(1);
    return snippets;
  });
  fastify.get("/getUserConsumptionForThisUserPeriod", async () => {
    const userID = 1;
    const isSubscribedUntil = "2021-04-28";

    const userConsumptionForDynamicPeriod = await db.NumberOfWords.getConsumptionforCurrentDynamicMonthlyPeriod(
      userID,
      isSubscribedUntil
    );
  });

  fastify.post("/addWordsToday", async () => {
    const numberOfWords = await db.NumberOfWords.addNumberOfWordsToday(1, 10);
    return numberOfWords;
  });
  fastify.get("/UserNumberOfWordsLast7Days", async () => {
    const numberOfWords = await db.NumberOfWords.getWordsOfLastSevenDays(1);
    return numberOfWords;
  });

  fastify.get("/UserNumberOfWordsLastMonth", async () => {
    const numberOfWords = await db.NumberOfWords.getWordsConsumptionOf30days(1);
    return numberOfWords;
  });
  fastify.get("/UserNumberOfWordsCurrentMonth", async () => {
    const numberOfWords = await db.NumberOfWords.getWordsConsumptionForCurrentMonth(
      1
    );
    return numberOfWords;
  });
  fastify.get("/getWordsConsumptionForMonth", async () => {
    const numberOfWords = await db.NumberOfWords.getWordsConsumptionForMonth(
      1,
      1
    );
    return numberOfWords;
  });
  fastify.get("/returnCompleteUserConsumption", async () => {
    const numberOfWords = await db.NumberOfWords.returnCompleteUserConsumption(
      1
    );
    return numberOfWords;
  });

  done();
};
