import fp from 'fastify-plugin'

export default fp(
  async (fastify) => {
    fastify.decorateReply('payload', null)

    fastify.addHook('preSerialization', async (request, reply, payload) => {
      // eslint-disable-next-line no-param-reassign
      reply.payload = payload
    })
  },
  { name: 'hooks' },
)

declare module 'fastify' {
  interface FastifyReply {
    payload: any
  }
}
