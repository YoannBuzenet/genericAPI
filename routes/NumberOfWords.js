const db = require("../models/index");
const { checkIfLogged } = require("../services/userCheck");
const { middlewarePassPhraseCheck } = require("../middlewares/checkPassphrase");

module.exports = function (fastify, opts, done) {
  middlewarePassPhraseCheck(fastify);

  fastify.get(
    "/:userId/total-consumption",
    {
      type: "object",
      properties: {
        userId: { type: "number" },
      },
    },
    async (req, reply) => {
      // Verify that user exists, is logged
      const userToCheck = await db.User.findOne({
        where: { id: req.params.userId },
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

  fastify.get(
    "/:userId/consumption-last-7-days",
    {
      type: "object",
      properties: {
        userId: { type: "number" },
      },
    },
    async (req, reply) => {
      // Verify that user exists, is logged
      const userToCheck = await db.User.findOne({
        where: { id: req.params.userId },
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

  fastify.get(
    "/:userId/consumption-for-dynamic-period",
    {
      type: "object",
      properties: {
        userId: { type: "number" },
      },
    },
    async (req, reply) => {
      // Verify that user exists, is logged
      const userToCheck = await db.User.findOne({
        where: { id: req.params.userId },
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

      const allDataCurrentMonth = await db.NumberOfWords.getConsumptionforCurrentDynamicMonthlyPeriod(
        userToCheck.dataValues.id,
        userToCheck.dataValues.isSubscribedUntil
      );

      return {
        dataForCurrentMonth: allDataCurrentMonth,
      };
    }
  );

  done();
};
