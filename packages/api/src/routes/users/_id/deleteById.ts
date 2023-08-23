import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { QBSession } from 'quickblox'

import {
  getUserById,
  qbDeleteUser,
  qbChatConnect,
  qbChatSendSystemMessage,
  qbDeleteCustomObjectByCriteria,
  QBUserApi,
} from '@/services/quickblox'
import { QBUserId } from '@/models'
import { CLOSE_SESSION_NOTIFICATION } from '@/constants/notificationTypes'
import { userHasTag } from '@/services/quickblox/utils'

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
    const user = await getUserById(QBUserApi, userId)

    if (!user) return fastify.httpErrors.notFound('The user was not found')

    await qbChatConnect(QBUserApi, session.user_id, session.token)
    const dialogId = QBUserApi.chat.helpers.getUserJid(userId)

    await qbChatSendSystemMessage(QBUserApi, dialogId, {
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
      const user = await getUserById(QBUserApi, id)
      const userField = userHasTag(user!, 'provider')
        ? 'provider_id'
        : 'client_id'

      await Promise.all([
        qbDeleteUser(QBUserApi, id),
        qbDeleteCustomObjectByCriteria(QBUserApi, 'Appointment', {
          [userField]: id,
        }),
      ])

      reply.code(204)

      return null
    },
  )
}

export default deleteById
