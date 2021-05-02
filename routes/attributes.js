const db = require("../models/index");

module.exports = function (fastify, opts, done) {
  // Public endpoint
  fastify.get(
    "/getByCategoryId",
    {
      schema: {
        querystring: {
          required: ["categoryId"],
          properties: { categoryId: { type: "integer" } },
        },
      },
    },
    async (req, reply) => {
      console.log("définitions pingées");
      const attributesForcategory = await db.Attribute.findAll({
        where: { categoryId: req.query.categoryId },
      });

      reply.send(attributesForcategory);
    }
  );
  done();
};
