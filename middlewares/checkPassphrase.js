function middlewarePassPhraseCheck(fastify) {
  fastify.addHook("preValidation", async (request, reply) => {
    if (
      request?.headers?.authorization !==
      `Bearer ${process.env.FRONT_APP_PASSPHRASE}`
    ) {
      reply.code(406).send("Auth doesn't match.");
      return;
    }
  });
}

module.exports = { middlewarePassPhraseCheck };
