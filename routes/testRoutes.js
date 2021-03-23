const userCheck = require("../services/userCheck");

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

      if (isUserLogged) {
        return "User is logged";
      } else {
        return "User is not logged";
      }
    }
  );

  done();
};
