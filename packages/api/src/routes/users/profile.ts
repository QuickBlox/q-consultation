import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox'

import { findUserById } from '@/services/users'
import { QBUser } from '@/models'

export const profileSchema = {
  tags: ['users'],
  description: 'Get user profile',
  response: {
    200: Type.Ref(QBUser),
  },
  security: [{ providerSession: [] }, { clientSession: [] }] as Array<{
    [securityLabel: string]: string[]
  }>,
}

const getProfile: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    '/profile',
    {
      schema: profileSchema,
      onRequest: fastify.verify(fastify.SessionToken),
    },
    async (request) => {
      const user = await findUserById(request.session!.user_id)

      return user
    },
  )
}

export default getProfile
