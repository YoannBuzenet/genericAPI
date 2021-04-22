const path = require("path");
const result = require("dotenv").config({
  path: path.resolve(process.cwd(), "./.env.local"),
});
if (result.error) {
  throw result.error;
}

var Bugsnag = require("@bugsnag/js");
Bugsnag.start({ apiKey: process.env.BUGSNAG_KEY });

// Require the framework and instantiate it
const fastify = require("fastify")({ logger: true });

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
fastify.register(require("./routes/contact-us"), {
  prefix: "/api/mail/contact-us",
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
