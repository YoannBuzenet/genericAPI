const db = require("../models/index");
const utils = require("../services/utils");

module.exports = function (fastify, opts, done) {
  fastify.post(
    "/userTotalConsumption",
    {
      schema: {
        body: {
          type: "object",
          required: ["passphrase", "idUser", "provider"],
          properties: {
            passphrase: { type: "string" },
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

      const totalWordsForThisUserThisMonth = await db.NumberOfWords.getWordsConsumptionOfLastMonth(
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
          required: ["passphrase", "idUser", "provider"],
          properties: {
            passphrase: { type: "string" },
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

  done();
};
