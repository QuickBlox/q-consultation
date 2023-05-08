import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { QBRecord } from 'quickblox'

import { QCRecord } from '@/models'
import { qbGetCustomObject } from '@/services/customObject'

const getRecordSchema = {
  tags: ['appointments'],
  params: Type.Object({
    id: Type.Integer(),
  }),
  response: {
    200: Type.Ref(QCRecord),
  },
  security: [
    {
      apiKey: [],
    },
  ],
}

const getRecordById: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    '/:id',
    {
      schema: getRecordSchema,
      onRequest: fastify.verify(
        fastify.BearerToken,
        fastify.ProviderSessionToken,
      ),
    },
    async (request, reply) => {
      const { id } = request.params

      const {
        items: [record],
      } = await qbGetCustomObject<QBRecord>('Record', {
        _id: {
          in: [id],
        },
        limit: 1,
      })

      if (!record) {
        return reply.notFound()
      }

      return record
    },
  )
}

export default getRecordById
