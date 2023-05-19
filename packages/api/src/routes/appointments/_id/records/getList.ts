import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { QBRecord } from 'quickblox'

import { QCRecord } from '@/models'
import { qbGetCustomObject } from '@/services/customObject'

const getRecordListSchema = {
  tags: ['appointments'],
  description: '[BearerToken][ProviderSessionToken]',
  params: Type.Partial(
    Type.Object({
      limit: Type.Integer(),
      skip: Type.Integer(),
      sort_desc: Type.KeyOf(QCRecord),
      sort_asc: Type.KeyOf(QCRecord),
    }),
  ),
  response: {
    200: Type.Array(Type.Ref(QCRecord)),
  },
  security: [
    {
      apiKey: [],
    },
  ],
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
      const { items: records } = await qbGetCustomObject<QBRecord>(
        'Record',
        request.params,
      )

      return records
    },
  )
}

export default getRecordList
