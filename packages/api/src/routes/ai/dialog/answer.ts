import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { ChatCompletionRequestMessage } from 'openai'
import { QBAppointment } from 'quickblox'
import { QBDialogId, QBMessageId } from '@/models'
import {
  qbChatConnect,
  qbChatGetMessages,
  qbChatJoin,
  qbGetCustomObject,
} from '@/services/quickblox'
import { createQuickAnswerForDialog } from '@/services/openai'
import { loopToLimitTokens } from '@/services/openai/utils'

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
  fastify.get(
    '/:dialogId/messages/:clientMessageId/answer',
    {
      schema: quickAnswerSchema,
      onRequest: fastify.verify(fastify.ProviderSessionToken),
    },
    async (request, reply) => {
      const { dialogId, clientMessageId } = request.params
      const { token, user_id } = request.session!

      await qbChatConnect(user_id, token)
      await qbChatJoin(dialogId)

      const [currentMessageData, currentAppointmentData] = await Promise.all([
        qbChatGetMessages(dialogId, {
          _id: clientMessageId,
        }),
        qbGetCustomObject<QBAppointment>('Appointment', {
          dialog_id: dialogId,
          limit: 1,
        }),
      ])

      const { items: [currentMessage] = [] } = currentMessageData || {}
      const { items: [currentAppointment] = [] } = currentAppointmentData || {}

      if (!currentMessage || !currentAppointment) {
        return reply.notFound()
      }

      const { client_id, provider_id, description } = currentAppointment

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
        description,
        chatCompletionMessages,
      )

      return { answer }
    },
  )
}

export const autoload = JSON.parse<boolean>(process.env.AI_QUICK_ANSWER!)

export default quickAnswer
