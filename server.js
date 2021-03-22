const path = require("path");
const result = require("dotenv").config({
  path: path.resolve(process.cwd(), "./.env.local"),
});
if (result.error) {
  throw result.error;
}

// Require the framework and instantiate it
const fastify = require("fastify")({ logger: true });

// Declare a route
fastify.get("/api", async (request, reply) => {
  return { hello: "world" };
});

fastify.register(require("./routes/users"), { prefix: "/api/users" });
fastify.register(require("./routes/contentGeneration"), {
  prefix: "/api/service",
});

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3001);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
