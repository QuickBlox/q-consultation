import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { QBAppointment, QBRecord } from 'quickblox'
import omit from 'lodash/omit'

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
    async (request, reply) => {
      const { id } = request.params

      const [records, appointments] = await Promise.all([
        qbGetCustomObject<QBRecord>('Record', {
          ...request.query,
          appointment_id: id,
        }),
        qbGetCustomObject<QBAppointment>('Appointment', {
          _id: id,
        }),
      ])

      if (!appointments.items.length) {
        return reply.notFound()
      }

      return omit(records, 'class_name')
    },
  )
}

export default getRecordList
