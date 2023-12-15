import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Static, Type } from '@sinclair/typebox'
import { ChatCompletionMessageParam } from 'openai/resources/chat'
import QB, {
  QBAppointment,
  promisifyCall,
  QBSession,
  parseUserCustomData,
  isQBError,
} from '@qc/quickblox'

import { QBDialogId, QBMessageId } from '@/models'
import { createQuickAnswerForDialog } from '@/services/openai'
import { loopToLimitTokens } from '@/services/openai/utils'

export const quickAnswerSchema = {
  tags: ['AI', 'Chat'],
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

      await promisifyCall(QB.chat.connect, { userId: user_id, password: token })
      await promisifyCall(QB.chat.muc.join, dialogId)

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
          promisifyCall(QB.chat.message.list, {
            chat_dialog_id: dialogId,
            _id: clientMessageId,
          }),
          promisifyCall(QB.data.list<QBAppointment>, 'Appointment', {
            dialog_id: dialogId,
            limit: 1,
          }),
          promisifyCall(QB.users.getById, user_id),
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

      const { items } = await promisifyCall(QB.chat.message.list, {
        chat_dialog_id: dialogId,
        sort_desc: 'date_sent',
        date_sent: {
          lte: currentMessage.date_sent,
        },
      })

      const messages = loopToLimitTokens(
        MAX_TOKENS,
        items,
        ({ message }) => message || '',
      ).reverse()
      const chatCompletionMessages: ChatCompletionMessageParam[] = messages.map(
        ({ message, sender_id }) => ({
          role: sender_id === client_id ? 'user' : 'assistant',
          content: message!,
        }),
      )

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
