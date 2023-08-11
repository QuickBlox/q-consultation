import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Static, Type } from '@sinclair/typebox'
import { ChatCompletionRequestMessage } from 'openai'
import { QBAppointment, QBSession } from 'quickblox'
import { QBDialogId, QBMessageId } from '@/models'
import {
  findUserById,
  qbChatConnect,
  qbChatGetMessages,
  qbChatJoin,
  qbGetCustomObject,
} from '@/services/quickblox'
import { createQuickAnswerForDialog } from '@/services/openai'
import { loopToLimitTokens } from '@/services/openai/utils'
import { parseUserCustomData } from '@/utils/user'
import { isQBError } from '@/utils/parse'

export const quickAnswerSchema = {
  tags: ['AI', 'Dialog'],
  summary: 'Get Quick answer for dialog',
  params: Type.Object({
    dialogId: QBDialogId,
    clientMessageId: QBMessageId,
  }),
  response: {
    200: Type.Object({
      answer: Type.String(),
    }),
  },
  security: [{ providerSession: [] }] as Security,
}

const MAX_TOKENS = 3584

const quickAnswer: FastifyPluginAsyncTypebox = async (fastify) => {
  const handleConnect = async (
    params: Static<typeof quickAnswerSchema.params>,
    session: QBSession,
  ) => {
    try {
      const { dialogId } = params
      const { token, user_id } = session

      await qbChatConnect(user_id, token)
      await qbChatJoin(dialogId)

      return undefined
    } catch (error) {
      if (isQBError(error)) {
        if (Array.isArray(error.message))
          return fastify.httpErrors.notFound(error.message[0])

        if (typeof error.message === 'string')
          return fastify.httpErrors.notFound(error.message)
      }

      return fastify.httpErrors.internalServerError()
    }
  }

  fastify.get(
    '/:dialogId/messages/:clientMessageId/answer',
    {
      schema: quickAnswerSchema,
      preHandler: (request, reply, done) => {
        handleConnect(request.params, request.session!).then(done).catch(done)
      },
      onRequest: fastify.verify(fastify.ProviderSessionToken),
    },
    async (request, reply) => {
      const { dialogId, clientMessageId } = request.params
      const { user_id } = request.session!

      const [currentMessageData, currentAppointmentData, myAccount] =
        await Promise.all([
          qbChatGetMessages(dialogId, {
            _id: clientMessageId,
          }),
          qbGetCustomObject<QBAppointment>('Appointment', {
            dialog_id: dialogId,
            limit: 1,
          }),
          findUserById(user_id),
        ])

      const { items: [currentMessage] = [] } = currentMessageData || {}
      const { items: [currentAppointment] = [] } = currentAppointmentData || {}
      const { profession } = parseUserCustomData(myAccount?.custom_data)

      if (!currentMessage) {
        return reply.notFound()
      }

      const { client_id, provider_id, description } = currentAppointment || {}

      if (provider_id !== user_id || currentMessage.sender_id !== client_id) {
        return reply.forbidden()
      }

      if (!currentMessage.message) {
        return reply.badRequest('Message text is missing')
      }

      const { items } = await qbChatGetMessages(dialogId, {
        date_sent: {
          lte: currentMessage.date_sent,
        },
      })

      const messages = loopToLimitTokens(
        MAX_TOKENS,
        items,
        ({ message }) => message || '',
      ).reverse()
      const chatCompletionMessages: ChatCompletionRequestMessage[] =
        messages.map(({ message, sender_id }) => ({
          role: sender_id === client_id ? 'user' : 'assistant',
          content: message!,
        }))

      const answer = await createQuickAnswerForDialog(
        profession || '',
        description,
        chatCompletionMessages,
      )

      return { answer }
    },
  )
}

export const autoload = JSON.parse<boolean>(process.env.AI_QUICK_ANSWER!)

export default quickAnswer
