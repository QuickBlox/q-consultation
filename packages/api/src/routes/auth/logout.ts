import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'

import { QBLogout } from '@/services/auth'

export const logoutSchema = {
  tags: ['auth'],
  description: 'User logout',
  security: [{ providerSession: [] }, { clientSession: [] }] as Array<{
    [securityLabel: string]: string[]
  }>,
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
