function middlewarePassPhraseCheck(fastify) {
  fastify.addHook("preValidation", async (request, reply) => {
    console.log("hook has been called");
    console.log("request", request);

    if (request?.body?.passphrase !== process.env.FRONT_APP_PASSPHRASE) {
      reply.code(406).send("Passphrase doesn't match.");
      return;
    }
  });
}

module.exports = { middlewarePassPhraseCheck };
