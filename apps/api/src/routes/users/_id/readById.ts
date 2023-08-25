import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox'

import { QBUserApi, getUserById } from '@/services/quickblox'
import { QBUser, QBUserId } from '@/models'

export const deleteSchema = {
  tags: ['Users'],
  summary: 'Get user by id',
  params: Type.Object({
    id: QBUserId,
  }),
  response: {
    200: Type.Ref(QBUser),
  },
  security: [
    { apiKey: [] },
    { providerSession: [] },
    { clientSession: [] },
  ] as Security,
}

const deleteById: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    '',
    {
      schema: deleteSchema,
      onRequest: fastify.verify(fastify.BearerToken, fastify.SessionToken),
    },
    async (request, reply) => {
      const user = await getUserById(QBUserApi, request.params.id)

      if (!user) {
        return reply.notFound()
      }

      return user
    },
  )
}

export default deleteById
