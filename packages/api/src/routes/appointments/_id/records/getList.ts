import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { QBRecord } from 'quickblox'

import { QBCustomObjectId, QCRecord, QCRecordSortKeys } from '@/models'
import { qbGetCustomObject } from '@/services/customObject'

const getRecordListSchema = {
  tags: ['Appointments', 'Records'],
  summary: 'Get a list of records for the appointment',
  params: Type.Object({
    id: QBCustomObjectId,
  }),
  querystring: Type.Partial(
    Type.Object({
      limit: Type.Integer({
        default: 1000,
        minimum: 1,
        description: 'Limit search results to N records. Useful for pagination',
      }),
      skip: Type.Integer({
        default: 0,
        minimum: 0,
        description: 'Skip N records in search results. Useful for pagination.',
      }),
      sort_desc: QCRecordSortKeys,
      sort_asc: QCRecordSortKeys,
    }),
  ),
  response: {
    200: Type.Object({
      items: Type.Array(Type.Ref(QCRecord)),
      limit: Type.Integer({
        default: 1000,
        minimum: 1,
        description: 'Limit search results to N records. Useful for pagination',
      }),
      skip: Type.Integer({
        default: 0,
        minimum: 0,
        description: 'Skip N records in search results. Useful for pagination.',
      }),
    }),
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

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { class_name, ...recordsData } = await qbGetCustomObject<QBRecord>(
        'Record',
        {
          ...request.query,
          appointment_id: {
            in: [id],
          },
        },
      )

      return recordsData
    },
  )
}

export default getRecordList
