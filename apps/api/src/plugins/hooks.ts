import fp from 'fastify-plugin'

class State {
  private data: Dictionary<any> = {}

  set<T>(name: string, value: T) {
    this.data[name] = value
  }

  get<T = any>(name: string): T | null {
    return this.data[name] || null
  }
}

export default fp(
  async (fastify) => {
    fastify.decorateReply('payload', null)
    fastify.decorateRequest('state', new State())

    fastify.addHook('onRequest', async (request) => {
      request.state = new State()
    })

    fastify.addHook('preSerialization', async (request, reply, payload) => {
      // eslint-disable-next-line no-param-reassign
      reply.payload = payload
    })
  },
  { name: 'hooks' },
)

declare module 'fastify' {
  interface FastifyRequest {
    state: State
  }
  interface FastifyReply {
    payload: any
  }
}
