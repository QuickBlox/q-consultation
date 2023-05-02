import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { MultipartFile } from '@/models'
import { getAudioInfo } from '@/services/openai'

export const audioInfoSchema = {
  tags: ['ai', 'providers'],
  consumes: ['multipart/form-data'],
  body: Type.Object({
    voice: MultipartFile,
  }),
  response: {
    200: Type.Partial(
      Type.Object({
        transcription: Type.String(),
        summary: Type.String(),
        notes: Type.String(),
        actions: Type.String(),
      }),
    ),
  },
  security: [
    {
      apiKey: [],
    },
  ],
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
      const data = await getAudioInfo(request.body.voice.filename, voice.buffer)

      return data
    },
  )
}

export default audioInfo
