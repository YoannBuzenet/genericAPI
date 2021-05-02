const db = require("../models/index");
const { checkIfLogged } = require("../services/userCheck");
const { middlewarePassPhraseCheck } = require("../middlewares/checkPassphrase");

module.exports = function (fastify, opts, done) {
  middlewarePassPhraseCheck(fastify);

  fastify.post(
    "/userTotalConsumption",
    {
      schema: {
        body: {
          type: "object",
          required: ["idUser", "provider"],
          properties: {
            idUser: { type: "string" },
            provider: { type: "string" },
          },
        },
      },
    },
    async (req, reply) => {
      // USER CHECK
      let idToCheck;
      if (req.body.provider === "google") {
        idToCheck = "googleId";
      } else if (req.body.provider === "website") {
        idToCheck = "id";
      } else {
        reply.code(406).send("Provider not registered.");
        return;
      }

      // Verify that user exists, is logged
      const userToCheck = await db.User.findOne({
        where: { [idToCheck]: req.body.idUser },
      });

      if (userToCheck === null) {
        reply.code(401).send("User doesn't exist.");
        return;
      }
      // Checking user is still logged
      if (!checkIfLogged(userToCheck.dataValues.isLoggedUntil)) {
        reply.code(401).send("User is not logged.");
        return;
      }

      const totalWordsForThisUserThisMonth = await db.NumberOfWords.getWordsConsumptionOf30days(
        userToCheck.dataValues.id
      );

      reply.send({
        userTotalConsumption:
          totalWordsForThisUserThisMonth[0].dataValues.totalAmount,
      });
    }
  );

  fastify.post(
    "/userConsumption7days",
    {
      schema: {
        body: {
          type: "object",
          required: ["idUser", "provider"],
          properties: {
            idUser: { type: "string" },
            provider: { type: "string" },
          },
        },
      },
    },
    async (req, reply) => {
      // USER CHECK
      let idToCheck;
      if (req.body.provider === "google") {
        idToCheck = "googleId";
      } else if (req.body.provider === "website") {
        idToCheck = "id";
      } else {
        reply.code(406).send("Provider not registered.");
        return;
      }

      // Verify that user exists, is logged
      const userToCheck = await db.User.findOne({
        where: { [idToCheck]: req.body.idUser },
      });

      if (userToCheck === null) {
        reply.code(401).send("User doesn't exist.");
        return;
      }
      // Checking user is still logged
      if (!checkIfLogged(userToCheck.dataValues.isLoggedUntil)) {
        reply.code(401).send("User is not logged.");
        return;
      }

      const totalWordsForThisUserThisMonth = await db.NumberOfWords.getWordsOfLastSevenDays(
        userToCheck.dataValues.id
      );

      reply.send({
        userTotalConsumption:
          totalWordsForThisUserThisMonth[0].dataValues.totalAmount,
      });
    }
  );

  fastify.post(
    "/userData7differentDays",
    {
      schema: {
        body: {
          type: "object",
          required: ["idUser", "provider"],
          properties: {
            idUser: { type: "string" },
            provider: { type: "string" },
          },
        },
      },
    },
    async (req, reply) => {
      // USER CHECK
      let idToCheck;
      if (req.body.provider === "google") {
        idToCheck = "googleId";
      } else if (req.body.provider === "website") {
        idToCheck = "id";
      } else {
        reply.code(406).send("Provider not registered.");
        return;
      }

      // Verify that user exists, is logged
      const userToCheck = await db.User.findOne({
        where: { [idToCheck]: req.body.idUser },
      });

      if (userToCheck === null) {
        reply.code(401).send("User doesn't exist.");
        return;
      }
      // Checking user is still logged
      if (!checkIfLogged(userToCheck.dataValues.isLoggedUntil)) {
        reply.code(401).send("User is not logged.");
        return;
      }

      const allData7Days = await db.NumberOfWords.getAllDataFor7lastDays(
        userToCheck.dataValues.id
      );

      allData7DaysPrepared = allData7Days.map((data) => data.dataValues);

      return {
        dataFor7days: allData7DaysPrepared,
      };
    }
  );

  fastify.post(
    "/getWordsConsumptionForCurrentMonth",
    {
      schema: {
        body: {
          type: "object",
          required: ["idUser", "provider"],
          properties: {
            idUser: { type: "string" },
            provider: { type: "string" },
          },
        },
      },
    },
    async (req, reply) => {
      // USER CHECK
      let idToCheck;
      if (req.body.provider === "google") {
        idToCheck = "googleId";
      } else if (req.body.provider === "website") {
        idToCheck = "id";
      } else {
        reply.code(406).send("Provider not registered.");
        return;
      }

      // Verify that user exists, is logged
      const userToCheck = await db.User.findOne({
        where: { [idToCheck]: req.body.idUser },
      });

      if (userToCheck === null) {
        reply.code(401).send("User doesn't exist.");
        return;
      }
      // Checking user is still logged
      if (!checkIfLogged(userToCheck.dataValues.isLoggedUntil)) {
        reply.code(401).send("User is not logged.");
        return;
      }

      const allDataCurrentMonth = await db.NumberOfWords.getWordsConsumptionForCurrentMonth(
        userToCheck.dataValues.id
      );

      allDataCurrentMonthClean = allDataCurrentMonth.map(
        (data) => data.dataValues
      );

      return {
        dataForCurrentMonth: allDataCurrentMonthClean,
      };
    }
  );

  done();
};
