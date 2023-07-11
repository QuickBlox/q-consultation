import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import QB, { QBSession } from 'quickblox'

import { qbDeleteUser } from '@/services/users'
import { QBUserId } from '@/models'
import { qbChatConnect, qbChatSendSystemMessage } from '@/services/chat'
import { CLOSE_SESSION_NOTIFICATION } from '@/constants/notificationTypes'
import { isQBError } from '@/utils/parse'

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
  const handleResponse = async (session: QBSession, id: number) => {
    try {
      await qbChatConnect(session.user_id, session.token)
      const dialogId = QB.chat.helpers.getUserJid(id)

      await qbChatSendSystemMessage(dialogId, {
        extension: {
          notification_type: CLOSE_SESSION_NOTIFICATION,
        },
      })

      return undefined
    } catch (e) {
      if (isQBError(e)) {
        return new Error(e.message.toString())
      }
    }
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

      await qbDeleteUser(id)
      reply.code(204)

      return null
    },
  )
}

export default deleteById
