import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import QB, {
  QBAppointment,
  QBSession,
  isQBError,
  promisifyCall,
} from '@qc/quickblox'
import { Static, Type } from '@sinclair/typebox'
import { QBAITranslate } from 'qb-ai-translate'

import { QBDialogId, QBMessageId } from '@/models'
import { createTranslate } from '@/services/openai'
import { loopToLimitTokens } from '@/services/openai/utils'

const availableLanguages = QBAITranslate.availableLanguages()

export const translateMessageSchema = {
  tags: ['AI', 'Chat'],
  summary: 'Translate message for user',
  params: Type.Object({
    dialogId: QBDialogId,
    messageId: QBMessageId,
  }),
  body: Type.Object({
    language: Type.Union(
      availableLanguages
        .reduce<string[]>(
          (res, { language }) =>
            res.includes(language) ? res : [...res, language],
          [],
        )
        .map((language) =>
          Type.Literal(language, {
            title: language,
          }),
        ),
      {
        example: availableLanguages[0].language,
      },
    ),
  }),
  response: {
    200: Type.Object({
      translate: Type.String(),
    }),
  },
  security: [{ providerSession: [] }, { clientSession: [] }] as Security,
}

const MAX_TOKENS = 3584

const translateMessage: FastifyPluginAsyncTypebox = async (fastify) => {
  const handleConnect = async (
    params: Static<typeof translateMessageSchema.params>,
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

  fastify.post(
    '/:dialogId/messages/:messageId/translate',
    {
      schema: translateMessageSchema,
      preHandler: (request, reply, done) => {
        handleConnect(request.params, request.session!).then(done).catch(done)
      },
      onRequest: fastify.verify(fastify.SessionToken),
    },
    async (request, reply) => {
      const { dialogId, messageId } = request.params
      const { language } = request.body
      const { user_id } = request.session!

      const [currentMessageData, currentAppointmentData] = await Promise.all([
        promisifyCall(QB.chat.message.list, {
          chat_dialog_id: dialogId,
          _id: messageId,
        }),
        promisifyCall(QB.data.list<QBAppointment>, 'Appointment', {
          dialog_id: dialogId,
          limit: 1,
        }),
      ])

      const { items: [currentAppointment] = [] } = currentAppointmentData || {}
      const { items: [currentMessage] = [] } = currentMessageData || {}

      const { client_id, provider_id } = currentAppointment || {}

      if (provider_id !== user_id && client_id !== user_id) {
        return reply.forbidden()
      }

      if (!currentMessage) {
        return reply.notFound()
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
      const chatCompletionMessages = messages.map<{
        role: 'user' | 'assistant'
        content: string
      }>(({ message, sender_id }) => ({
        role: sender_id === user_id ? 'user' : 'assistant',
        content: message!,
      }))

      const translate = await createTranslate(
        currentMessage.message,
        chatCompletionMessages,
        language,
      )

      if (translate === 'Translation failed.') {
        return reply.badRequest('Translation failed')
      }

      return { translate }
    },
  )
}

export const autoload = JSON.parse<boolean>(process.env.AI_TRANSLATE!)

export default translateMessage
