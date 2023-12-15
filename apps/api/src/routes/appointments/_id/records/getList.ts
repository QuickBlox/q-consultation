import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import omit from 'lodash/omit'
import QB, { promisifyCall, QBAppointment, QBRecord } from '@qc/quickblox'

import { QBCustomObjectId, QCRecord, QCRecordSortKeys } from '@/models'

const getRecordListSchema = {
  tags: ['Appointments'],
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

      const [records] = await Promise.all([
        promisifyCall(QB.data.list<QBRecord>, 'Record', {
          ...request.query,
          appointment_id: id,
        }),
        // TODO: Workaround. Replace with getting a custom object by id
        promisifyCall(QB.data.update<QBAppointment>, 'Appointment', {
          _id: id,
        }),
      ])

      return omit(records, 'class_name')
    },
  )
}

export default getRecordList
