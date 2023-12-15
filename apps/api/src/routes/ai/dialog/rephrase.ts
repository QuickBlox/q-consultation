import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Static, Type } from '@sinclair/typebox'
import QB, {
  QBAppointment,
  promisifyCall,
  QBSession,
  isQBError,
} from '@qc/quickblox'

import { QBDialogId } from '@/models'
import { createRephraseForDialog } from '@/services/openai'
import { loopToLimitTokens } from '@/services/openai/utils'

const toneDictionary = {
  'Professional Tone':
    'This would edit messages to sound more formal, using technical vocabulary, clear sentence structures, and maintaining a respectful tone. It would avoid colloquial language and ensure appropriate salutations and sign-offs',
  'Friendly Tone':
    'This would adjust messages to reflect a casual, friendly tone. It would incorporate casual language, use emoticons, exclamation points, and other informalities to make the message seem more friendly and approachable.',
  'Encouraging Tone':
    'This tone would be useful for motivation and encouragement. It would include positive words, affirmations, and express support and belief in the recipient.',
  'Empathetic Tone':
    'This tone would be utilized to display understanding and empathy. It would involve softer language, acknowledging feelings, and demonstrating compassion and support.',
  'Neutral Tone':
    'For times when you want to maintain an even, unbiased, and objective tone. It would avoid extreme language and emotive words, opting for clear, straightforward communication.',
  'Assertive Tone':
    'This tone is beneficial for making clear points, standing ground, or in negotiations. It uses direct language, is confident, and does not mince words.',
  'Instructive Tone':
    'This tone would be useful for tutorials, guides, or other teaching and training materials. It is clear, concise, and walks the reader through steps or processes in a logical manner.',
  'Persuasive Tone':
    'This tone can be used when trying to convince someone or argue a point. It uses persuasive language, powerful words, and logical reasoning.',
  'Sarcastic/Ironic Tone':
    'This tone can make the communication more humorous or show an ironic stance. It is harder to implement as it requires the AI to understand nuanced language and may not always be taken as intended by the reader.',
  'Poetic Tone':
    'This would add an artistic touch to messages, using figurative language, rhymes, and rhythm to create a more expressive text.',
}

export const rephraseSchema = {
  tags: ['AI', 'Chat'],
  summary: 'Rephrase text for dialog',
  params: Type.Object({
    dialogId: QBDialogId,
  }),
  body: Type.Object({
    text: Type.String({
      minLength: 1,
    }),
    tone: Type.Union(
      (Object.keys(toneDictionary) as Array<keyof typeof toneDictionary>).map(
        (name) =>
          Type.Literal(name, {
            title: name,
            description: toneDictionary[name],
          }),
      ),
      {
        example: 'Professional Tone',
      },
    ),
  }),
  response: {
    200: Type.Object({
      rephrasedText: Type.String(),
    }),
  },
  security: [{ providerSession: [] }, { clientSession: [] }] as Security,
}

const MAX_TOKENS = 3584

const rephrase: FastifyPluginAsyncTypebox = async (fastify) => {
  const handleConnect = async (
    params: Static<typeof rephraseSchema.params>,
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
    '/:dialogId/rephrase',
    {
      schema: rephraseSchema,
      preHandler: (request, reply, done) => {
        handleConnect(request.params, request.session!).then(done).catch(done)
      },
      onRequest: fastify.verify(fastify.SessionToken),
    },
    async (request, reply) => {
      const { dialogId } = request.params
      const { text, tone } = request.body
      const { user_id } = request.session!

      const currentAppointmentData = await promisifyCall(
        QB.data.list<QBAppointment>,
        'Appointment',
        {
          dialog_id: dialogId,
          limit: 1,
        },
      )
      const { items: [currentAppointment] = [] } = currentAppointmentData || {}

      if (!currentAppointment) {
        return reply.notFound()
      }

      const { client_id } = currentAppointment
      const isClient = client_id === user_id

      const { items } = await promisifyCall(QB.chat.message.list, {
        chat_dialog_id: dialogId,
        sort_desc: 'date_sent',
      })

      const messages = loopToLimitTokens(
        MAX_TOKENS,
        items,
        ({ message }) => message || '',
      ).reverse()
      const myMessageHistory = messages.map<{
        role: 'me' | 'other'
        content: string
      }>(({ message, sender_id }) => ({
        role: isClient && sender_id === client_id ? 'me' : 'other',
        content: message!,
      }))

      const rephrasedText = await createRephraseForDialog(
        text,
        { name: tone, description: toneDictionary[tone] },
        myMessageHistory,
      )

      return { rephrasedText }
    },
  )
}

export const autoload = JSON.parse<boolean>(process.env.AI_REPHRASE!)

export default rephrase
