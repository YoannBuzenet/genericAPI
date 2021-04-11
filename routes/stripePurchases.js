const db = require("../models/index");

module.exports = function (fastify, opts, done) {
  fastify.post(
    "/createStripePurchase",
    {
      schema: {
        required: ["passphrase", "stripePurchaseObject"],
        properties: {
          passphrase: { type: "string" },
          stripePurchaseObject: { type: "string" },
        },
      },
    },
    async (req, reply) => {
      if (req.body.passphrase !== process.env.FRONT_APP_PASSPHRASE) {
        reply.code(406).send("Passphrase doesn't match.");
        return;
      }

      try {
        const newStripePurchase = await db.StripePurchase.create({
          session_id: stripePurchaseObject.session_id,
          customer_email: stripePurchaseObject.customer_email,
          customerStripeId: stripePurchaseObject.customerStripeId,
          mode: stripePurchaseObject.mode,
          paymentStatus: stripePurchaseObject.paymentStatus,
          subscription: stripePurchaseObject.subscription,
          date: new Date().toUTCString(stripePurchaseObject.date * 1000),
          amount: stripePurchaseObject.amount,
        });
        reply.code(200).send();
      } catch (e) {
        console.error("error while registering stripe purchase", e);
        reply.code(500).send();
      }
    }
  );
  fastify.post(
    "/sessionLink",
    {
      schema: {
        required: ["passphrase", "session", "userID"],
        properties: {
          passphrase: { type: "string" },
          session: { type: "string" },
          userID: { type: "string" },
        },
      },
    },
    async (req, reply) => {
      if (req.body.passphrase !== process.env.FRONT_APP_PASSPHRASE) {
        reply.code(406).send("Passphrase doesn't match.");
        return;
      }

      try {
        console.log(
          "get the right session, update it, empty session id, then get the right user, update it"
        );
        console.log("req.body.session", req.body.session);
        console.log("req.body.userID", req.body.userID);
        // to do
        // get the right session, update userID, erase field session id
        const session = await db.StripePurchase.findOne({
          where: {
            session_id: req.body.session,
          },
        });

        if (session === null) {
          reply.code(406).send("No corresponding session");
        }

        session.user_id = req.body.userID;
        session.save();

        const userToUpdate = await db.StripePurchase.findOne({
          where: {
            id: req.body.userID,
          },
        });

        if (userToUpdate === null) {
          reply
            .code(406)
            .send("User coulnt be found, with ID :", req.body.userID);
        }

        const pricePaid = session.dataValues.amount;
        // pricepaid allows us to know duration to add as subscription

        // Appliquer la bonne méthode en fonction du prix payé

        reply.code(200).send();
      } catch (e) {
        console.error("error while registering stripe purchase", e);
        reply.code(500).send();
      }
    }
  );
  done();
};
