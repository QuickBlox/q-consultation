import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'

import { QBLogout } from '@/services/auth'

export const logoutSchema = {
  tags: ['users'],
  security: [
    {
      apiKey: [],
    },
  ],
}

const logout: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.delete(
    '/logout',
    {
      schema: logoutSchema,
      onRequest: fastify.verify(fastify.SessionToken),
    },
    async () => {
      await QBLogout()
    },
  )
}

export default logout
