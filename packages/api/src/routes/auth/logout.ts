import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'

import { QBLogout } from '@/services/auth'

export const logoutSchema = {
  tags: ['Auth'],
  summary: 'User logout',
  response: {
    204: Type.Null({ description: 'No content' }),
  },
  security: [{ providerSession: [] }, { clientSession: [] }] as Security,
}

const logout: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.delete(
    '/logout',
    {
      schema: logoutSchema,
      onRequest: fastify.verify(fastify.SessionToken),
    },
    async (request, reply) => {
      await QBLogout()
      reply.code(204)

      return null
    },
  )
}

export default logout
