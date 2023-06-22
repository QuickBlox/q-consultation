import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { MultipartFile } from '@/models'
import { createAudioDialogAnalytics } from '@/services/openai'

export const audioInfoSchema = {
  tags: ['AI'],
  summary: 'Get audio info',
  description: 'Get transcription, summary and actions for the audio',
  consumes: ['multipart/form-data'],
  body: Type.Object({
    voice: MultipartFile,
  }),
  response: {
    200: Type.Partial(
      Type.Object({
        transcription: Type.Array(
          Type.Object({
            start: Type.String(),
            end: Type.String(),
            text: Type.String(),
          }),
        ),
        summary: Type.String(),
        actions: Type.String(),
      }),
    ),
  },
  security: [{ apiKey: [] }, { providerSession: [] }] as Security,
}

const audioInfo: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post(
    '/audio-info',
    {
      schema: audioInfoSchema,
      onRequest: fastify.verify(
        fastify.BearerToken,
        fastify.ProviderSessionToken,
      ),
    },
    async (request) => {
      const { voice } = request.body
      const data = await createAudioDialogAnalytics(voice)

      return data
    },
  )
}

export const autoload = JSON.parse<boolean>(process.env.AI_RECORD_ANALYTICS!)

export default audioInfo
