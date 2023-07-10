import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'

import { qbLogout } from '@/services/auth'
import { qbChatConnect, qbChatSendSystemMessage } from '@/services/chat'
import { QBSession } from 'quickblox'
import { LOGOUT_NOTIFICATION } from '@/constants/notificationTypes'
import QB from 'quickblox'

export const logoutSchema = {
  tags: ['Auth'],
  summary: 'User logout',
  response: {
    204: Type.Null({ description: 'No content' }),
  },
  security: [{ providerSession: [] }, { clientSession: [] }] as Security,
}

const logout: FastifyPluginAsyncTypebox = async (fastify) => {
  const handleValidate = async (session: QBSession) => {
    await qbChatConnect(session.user_id, session.token)
    const dialogId = QB.chat.helpers.getUserJid(session.user_id)
    await qbChatSendSystemMessage(dialogId, {
      extension: {
        notification_type: LOGOUT_NOTIFICATION,
        session_finished: 'true',
      },
    })
  }

  fastify.delete(
    '/logout',
    {
      schema: logoutSchema,
      preHandler: async (request, reply, done) => {
        await handleValidate(request.session!)
        done()
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
