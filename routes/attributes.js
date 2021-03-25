const db = require("../models/index");

module.exports = function (fastify, opts, done) {
  fastify.get(
    "/getByCategoryId",
    {
      schema: {
        querystring: {
          required: ["idCategory"],
          properties: { idCategory: { type: "integer" } },
        },
      },
    },
    async (req, reply) => {
      console.log("définitions pingées");
      const attributesForcategory = await db.Attribute.findAll({
        where: { categoryId: req.query.idCategory },
      });

      reply.send(attributesForcategory);
    }
  );
  done();
};
