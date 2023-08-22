import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox'

import { QBUserApi, getUserById } from '@/services/quickblox'
import { QBUser } from '@/models'

export const profileSchema = {
  tags: ['Users'],
  summary: 'Get user profile',
  response: {
    200: Type.Ref(QBUser),
  },
  security: [{ providerSession: [] }, { clientSession: [] }] as Security,
}

const getProfile: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    '/profile',
    {
      schema: profileSchema,
      onRequest: fastify.verify(fastify.SessionToken),
    },
    async (request, reply) => {
      const user = await getUserById(QBUserApi, request.session!.user_id)

      if (!user) {
        return reply.notFound()
      }

      return user
    },
  )
}

export default getProfile
