module.exports = function (fastify, opts, done) {
  fastify.post(
    "/",
    {
      schema: {
        body: {
          type: "object",
          required: ["name"],
          properties: { name: { type: "string" } },
        },
      },
    },
    () => {
      return { hello: "content" };
    }
  );

  done();
};
