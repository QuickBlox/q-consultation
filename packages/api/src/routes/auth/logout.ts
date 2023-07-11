import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import QB, { QBSession } from 'quickblox'

import { qbLogout } from '@/services/auth'
import { qbChatConnect, qbChatSendSystemMessage } from '@/services/chat'
import { isQBError } from '@/utils/parse'
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
    try {
      await qbChatConnect(session.user_id, session.token)
      const dialogId = QB.chat.helpers.getUserJid(session.user_id)
      await qbChatSendSystemMessage(dialogId, {
        extension: {
          notification_type: CLOSE_SESSION_NOTIFICATION,
        },
      })
    } catch (e) {
      if (isQBError(e)) {
        return new Error(e.message.toString())
      }
    }
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
      await qbLogout()
      reply.code(204)

      return null
    },
  )
}

export default logout
