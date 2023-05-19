import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox'

import { findUserById } from '@/services/users'
import { QBUser } from '@/models'

export const deleteSchema = {
  tags: ['users'],
  description: '[SessionToken]',
  params: Type.Object({
    id: Type.String({ pattern: '^[0-9]+$' }),
  }),
  response: {
    200: Type.Ref(QBUser),
  },
  security: [
    {
      apiKey: [],
    },
  ],
}

const deleteById: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    '',
    {
      schema: deleteSchema,
      onRequest: fastify.verify(fastify.SessionToken),
    },
    async (request, reply) => {
      const user = await findUserById(parseInt(request.params.id, 10))

      if (!user) {
        return reply.notFound()
      }

      return user
    },
  )
}

export default deleteById
