import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'

import { qbDeleteUser } from '@/services/quickblox'
import { QBUserId } from '@/models'

export const deleteSchema = {
  tags: ['Users'],
  summary: 'Delete user by id',
  params: Type.Object({
    id: QBUserId,
  }),
  response: {
    204: Type.Null({ description: 'No content' }),
  },
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
      reply.code(204)

      return null
    },
  )
}

export default deleteById
