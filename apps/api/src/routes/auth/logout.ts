import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { QBSession } from 'quickblox'

import {
  QBUserApi,
  qbChatConnect,
  qbChatSendSystemMessage,
  qbLogout,
} from '@/services/quickblox'
import { CLOSE_SESSION_NOTIFICATION } from '@/constants/notificationTypes'

export const logoutSchema = {
  tags: ['Auth'],
  summary: 'User logout',
  response: {
    204: Type.Null({ description: 'No content' }),
  },
  security: [{ providerSession: [] }, { clientSession: [] }] as Security,
}

const logout: FastifyPluginAsyncTypebox = async (fastify) => {
  const handleResponse = async (session: QBSession) => {
    await qbChatConnect(QBUserApi, session.user_id, session.token)
    const dialogId = QBUserApi.chat.helpers.getUserJid(session.user_id)

    await qbChatSendSystemMessage(QBUserApi, dialogId, {
      extension: {
        notification_type: CLOSE_SESSION_NOTIFICATION,
      },
    })

    return undefined
  }

  fastify.delete(
    '/logout',
    {
      schema: logoutSchema,
      preHandler: (request, reply, done) => {
        handleResponse(request.session!).then(done).catch(done)
      },
      onRequest: fastify.verify(fastify.SessionToken),
    },
    async (request, reply) => {
      await qbLogout(QBUserApi)
      reply.code(204)

      return null
    },
  )
}

export default logout
