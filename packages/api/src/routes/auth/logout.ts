import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'

import { QBLogout } from '@/services/auth'

export const logoutSchema = {
  tags: ['auth'],
  security: [
    {
      apiKey: [],
    },
  ],
}

const logout: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post(
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
