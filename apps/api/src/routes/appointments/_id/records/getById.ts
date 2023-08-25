import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { QBRecord } from 'quickblox'

import { QBCustomObjectId, QCRecord } from '@/models'
import { QBUserApi, qbUpdateCustomObject } from '@/services/quickblox'

const getRecordSchema = {
  tags: ['Appointments'],
  summary: 'Get a record for the appointment',
  params: Type.Object({
    id: QBCustomObjectId,
    recordId: QBCustomObjectId,
  }),
  response: {
    200: Type.Ref(QCRecord),
  },
  security: [{ apiKey: [] }, { providerSession: [] }] as Security,
}

const getRecordById: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    '/:recordId',
    {
      schema: getRecordSchema,
      onRequest: fastify.verify(
        fastify.BearerToken,
        fastify.ProviderSessionToken,
      ),
    },
    async (request, reply) => {
      const { id, recordId } = request.params

      // TODO: Workaround. Replace with getting a custom object by id
      const record = await qbUpdateCustomObject<QBRecord>(
        QBUserApi,
        recordId,
        'Appointment',
        {},
      )

      if (record.appointment_id !== id) {
        return reply.notFound()
      }

      return record
    },
  )
}

export default getRecordById
