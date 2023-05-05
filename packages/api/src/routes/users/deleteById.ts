import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'

import { qbDeleteUser } from '@/services/users'

export const deleteSchema = {
  tags: ['users'],
  params: Type.Object({
    id: Type.String({ pattern: '^[0-9]+$' }),
  }),
  security: [
    {
      apiKey: [],
    },
  ],
}

const deleteById: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.delete(
    '/:id',
    {
      schema: deleteSchema,
      onRequest: fastify.verify(fastify.BearerToken),
    },
    async (request, reply) => {
      const { id } = request.params

      await qbDeleteUser(parseInt(id, 10))

      return reply.code(204)
    },
  )
}

export default deleteById
