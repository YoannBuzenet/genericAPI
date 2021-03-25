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

      if (isUserLogged) {
        return "User is logged";
      } else {
        return "User is not logged";
      }
    }
  );

  fastify.post("/testGetSnippets", async () => {
    const snippets = await db.Snippet.findOne({
      include: [
        {
          model: db.Attribute,
          where: {
            [Op.and]: [{ id: 2 }, { id: 1 }],
          },
        },
      ],
      where: {
        isDefault: 1,
      },
    });
    return snippets;
  });

  fastify.post("/testGetSnippetsByCategoryID", async () => {
    const snippets = await db.Snippet.getSnippetByCategoryID(1);
    return snippets;
  });

  done();
};
