const path = require("path");
const result = require("dotenv").config({
  path: path.resolve(process.cwd(), "./.env.local"),
});
if (result.error) {
  throw result.error;
}

var Bugsnag = require("@bugsnag/js");
Bugsnag.start({ apiKey: "8f4afb4e24eb693a3fb86f0f3914d599" });

// Require the framework and instantiate it
const fastify = require("fastify")({ logger: true });

// Declare a route
fastify.get("/api", async (request, reply) => {
  return { hello: "world" };
});

fastify.register(require("./routes/users"), { prefix: "/api/users" });
fastify.register(require("./routes/NumberOfWords"), {
  prefix: "/api/numberOfWords",
});
fastify.register(require("./routes/attributes"), { prefix: "/api/attributes" });
fastify.register(require("./routes/contentGeneration"), {
  prefix: "/api/service",
});
fastify.register(require("./routes/stripePurchases"), {
  prefix: "/api/stripePurchases",
});
if (process.env.NODE_ENV !== "production") {
  fastify.register(require("./routes/testRoutes"), {
    prefix: "/api/test",
  });
}

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3001);
  } catch (err) {
    Bugsnag.notify(new Error(err));
    fastify.log.error("Server Error", err);
    process.exit(1);
  }
};

start();
