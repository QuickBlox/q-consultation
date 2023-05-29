import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'

import { qbDeleteUser } from '@/services/users'

export const deleteSchema = {
  tags: ['users'],
  description: 'Delete user by id',
  params: Type.Object({
    id: Type.Integer(),
  }),
  security: [{ apiKey: [] }] as Security,
}

const deleteById: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.delete(
    '',
    {
      schema: deleteSchema,
      onRequest: fastify.verify(fastify.BearerToken),
    },
    async (request, reply) => {
      const { id } = request.params

      await qbDeleteUser(id)

      return reply.code(204)
    },
  )
}

export default deleteById
