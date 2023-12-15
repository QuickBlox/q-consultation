import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import QB, { promisifyCall, QBSession } from '@qc/quickblox'

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
    await promisifyCall(QB.chat.connect, {
      userId: session.user_id,
      password: session.token,
    })
    const dialogId = QB.chat.helpers.getUserJid(session.user_id)

    QB.chat.sendSystemMessage(dialogId, {
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
      await promisifyCall(QB.logout)
      reply.code(204)

      return null
    },
  )
}

export default logout
