import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { QBRecord } from 'quickblox'

import { QCRecord } from '@/models'
import { qbGetCustomObject } from '@/services/customObject'

const getRecordListSchema = {
  tags: ['appointments'],
  description: 'Get a list of records for the appointment',
  params: Type.Object({
    id: Type.String({ pattern: '^[a-z0-9]{24}$' }),
  }),
  querystring: Type.Partial(
    Type.Object({
      limit: Type.Integer({ default: 100 }),
      skip: Type.Integer({ default: 0 }),
      sort_desc: Type.KeyOf(QCRecord, {
        description: `Available values: ${Type.KeyOf(QCRecord)
          .anyOf.map(({ const: field }) => field)
          .join(', ')}`,
      }),
      sort_asc: Type.KeyOf(QCRecord, {
        description: `Available values: ${Type.KeyOf(QCRecord)
          .anyOf.map(({ const: field }) => field)
          .join(', ')}`,
      }),
    }),
  ),
  response: {
    200: Type.Array(Type.Ref(QCRecord)),
  },
  security: [{ apiKey: [] }, { providerSession: [] }] as Security,
}

const getRecordList: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    '',
    {
      schema: getRecordListSchema,
      onRequest: fastify.verify(
        fastify.BearerToken,
        fastify.ProviderSessionToken,
      ),
    },
    async (request) => {
      const { id } = request.params

      const { items: records } = await qbGetCustomObject<QBRecord>('Record', {
        ...request.query,
        appointment_id: {
          in: [id],
        },
      })

      return records
    },
  )
}

export default getRecordList
