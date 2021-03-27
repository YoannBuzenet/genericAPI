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

  done();
};
