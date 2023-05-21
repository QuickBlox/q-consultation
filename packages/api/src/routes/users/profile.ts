import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox'

import { findUserById } from '@/services/users'
import { QBUser } from '@/models'

export const deleteSchema = {
  tags: ['users'],
  description: 'Get user profile',
  response: {
    200: Type.Ref(QBUser),
  },
  security: [{ providerSession: [] }, { clientSession: [] }] as Array<{
    [securityLabel: string]: string[]
  }>,
}

const deleteById: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    '/profile',
    {
      schema: deleteSchema,
      onRequest: fastify.verify(fastify.SessionToken),
    },
    async (request) => {
      const user = await findUserById(request.session!.user_id)

      return user
    },
  )
}

export default deleteById
