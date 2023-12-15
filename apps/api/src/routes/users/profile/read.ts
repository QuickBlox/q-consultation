import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox'
import QB, { promisifyCall } from '@qc/quickblox'

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
    '',
    {
      schema: profileSchema,
      onRequest: fastify.verify(fastify.SessionToken),
    },
    async (request, reply) => {
      const { user_id } = request.session!
      const user = await promisifyCall(QB.users.getById, user_id)

      if (!user) {
        return reply.notFound()
      }

      return user
    },
  )
}

export default getProfile
