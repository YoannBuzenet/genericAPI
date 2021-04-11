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
          session_id: req.body.stripePurchaseObject.session_id,
          customer_email: req.body.stripePurchaseObject.customer_email,
          customerStripeId: req.body.stripePurchaseObject.customerStripeId,
          mode: req.body.stripePurchaseObject.mode,
          paymentStatus: req.body.stripePurchaseObject.paymentStatus,
          subscription: req.body.stripePurchaseObject.subscription,
          date: new Date().toUTCString(
            req.body.stripePurchaseObject.date * 1000
          ),
          amount: req.body.stripePurchaseObject.amount,
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
        console.log("Passphrase doesn't match.");
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
          console.log("No corresponding session");
          reply.code(406).send("No corresponding session");
          return;
        }

        session.user_id = req.body.userID;
        session.session_id = "used";
        session.save();

        const userToUpdate = await db.User.findOne({
          where: {
            id: req.body.userID,
          },
        });

        if (userToUpdate === null) {
          console.log("User coulnt be found, with ID :", req.body.userID);
          reply
            .code(406)
            .send("User coulnt be found, with ID :", req.body.userID);
          return;
        }

        const pricePaid = parseInt(session.dataValues.amount, 10);

        // pricepaid allows us to know duration to add as subscription

        if (pricePaid === 34800) {
          const updatedYearlyUser = await db.User.subscribeOneYear(
            req.body.userID
          );
        } else if (pricePaid === 4400) {
          const updatedMonthly = await db.User.subscribeOneMonth(
            req.body.userID
          );
        } else if (pricePaid === 1900) {
          const oneMonthReload = "TODO when reloads will be implemented";
        }

        // Appliquer la bonne méthode en fonction du prix payé

        reply.code(200).send();
        return;
      } catch (e) {
        console.error("error while registering stripe purchase", e);
        reply.code(500).send(e);
        return;
      }
    }
  );

  fastify.post(
    "updateSubscription",
    {
      schema: {
        required: ["passphrase", "session", "userID"],
        properties: {
          passphrase: { type: "string" },
          customerID: { type: "string" },
          amount: { type: "string" },
          billing_reason: { type: "string" },
          date: { type: "string" },
          account_country: { type: "string" },
          status: { type: "string" },
          total: { type: "string" },
          subscription: { type: "string" },
          customer_email: { type: "string" },
        },
      },
    },
    (req, reply) => {
      if (req.body.passphrase !== process.env.FRONT_APP_PASSPHRASE) {
        reply.code(406).send("Passphrase doesn't match.");
        return;
      }

      // trouver le customerID dans les session et en déduire l'user ID
      const sessionWithCustomerId = await db.StripePurchase.findOne({
        where : {
          customerStripeId : req.body.customerID
        }
      })

      if(sessionWithCustomerId === null){
        reply
            .code(406)
            .send("No corresponding session with this customer id", req.body.customerID);
          return;
      }

      const userID = sessionWithCustomerId?.dataValues?.user_id;

      // sauvegarder avec user id

      const savedInvoice = await db.StripeInvoice.create({
        user_id : userID,
        billing_reason : req.body.billing_reason,
        customer_email : req.body.customer_email,
        customerStripeId : req.body.customerID,
        account_country : req.body.account_country,
        status : req.body.status,
        subscription : req.body.subscription,
        date : req.body.date,
        amount : req.body.total,
      })

      if(req.body.billing_reason === "subscription_create"){
        // We do not do anything special here, as user has already been registered during first paiment via his stripe checkout session.
        console.log('subscription created')
      }
      else if(req.body.billing_reason === "subscription_cycle"){
        // amount -> yearly monthly etc
        // subscribe l'user avec son ID
        //to do yoann
      }
      else {
        console.log('Billing reason not processed for now', req.body.billing_reason)
      }

      reply.status(200).send();
    }
  );
  done();
};
