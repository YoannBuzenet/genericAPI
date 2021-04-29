const db = require("../models/index");
var Bugsnag = require("@bugsnag/js");

module.exports = function (fastify, opts, done) {
  fastify.post(
    "/get_stripe_user_id",
    {
      schema: {
        required: ["idUser"],
        properties: {
          idUser: { type: "string" },
        },
      },
    },
    async (req, reply) => {
      if (req.body.passphrase !== process.env.FRONT_APP_PASSPHRASE) {
        reply.code(406).send("Passphrase doesn't match.");
        return;
      }

      try {
        //get user stripe id in StripePurchase table and send it back
        const result = await db.StripePurchase.findOne({
          where: { user_id: req.body.idUser },
        });

        const stripeUserId = result.dataValues.customerStripeId;

        reply.code(200).send(stripeUserId);
      } catch (e) {
        console.log("error when getting stripe user id", e);
        Bugsnag.notify(new Error(e));
        reply.code(500).send("Couldn't find stripe user id");
      }
    }
  );
  done();
};
