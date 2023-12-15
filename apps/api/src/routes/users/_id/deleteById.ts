import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import QB, { promisifyCall, QBSession, userHasTag } from '@qc/quickblox'

import { QBUserId } from '@/models'
import { CLOSE_SESSION_NOTIFICATION } from '@/constants/notificationTypes'

export const deleteSchema = {
  tags: ['Users'],
  summary: 'Delete user by id',
  description:
    'Delete a user by ID. The user can only be deleted using the apiKey',
  params: Type.Object({
    id: QBUserId,
  }),
  response: {
    204: Type.Null({ description: 'No content' }),
  },
  security: [{ apiKey: [] }] as Security,
}

const deleteById: FastifyPluginAsyncTypebox = async (fastify) => {
  const handleResponse = async (session: QBSession, userId: number) => {
    const user = await promisifyCall(QB.users.getById, userId)

    if (!user) return fastify.httpErrors.notFound('The user was not found')

    await promisifyCall(QB.chat.connect, {
      userId: session.user_id,
      password: session.token,
    })
    const dialogId = QB.chat.helpers.getUserJid(userId)

    QB.chat.sendSystemMessage(dialogId, {
      extension: {
        notification_type: CLOSE_SESSION_NOTIFICATION,
      },
    })

    return undefined
  }

  fastify.delete(
    '',
    {
      schema: deleteSchema,
      preHandler: (request, reply, done) => {
        handleResponse(request.session!, request.params.id)
          .then(done)
          .catch(done)
      },
      onRequest: fastify.verify(fastify.BearerToken),
    },
    async (request, reply) => {
      const { id } = request.params
      const user = await promisifyCall(QB.users.getById, id)
      const userField = userHasTag(user, 'provider')
        ? 'provider_id'
        : 'client_id'

      await Promise.all([
        promisifyCall(QB.users.delete, id),
        promisifyCall(QB.data.deleteByCriteria, 'Appointment', {
          [userField]: id,
        }),
      ])

      reply.code(204)

      return null
    },
  )
}

export default deleteById
