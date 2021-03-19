module.exports = function (fastify, opts, done) {
  fastify.get("/", () => {
    return { hello: "users" };
  });

  done();
};
