import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'

import { QBCustomObjectId, QCAppointment } from '@/models'
import { QBUserApi, qbUpdateCustomObject } from '@/services/quickblox'
import { QBAppointment } from '@/types/quickblox'

const getAppointmentSchema = {
  tags: ['Appointments'],
  summary: 'Get appointment by id',
  params: Type.Object({
    id: QBCustomObjectId,
  }),
  response: {
    200: Type.Ref(QCAppointment),
  },
  security: [
    { apiKey: [] },
    { providerSession: [] },
    { clientSession: [] },
  ] as Security,
}

const getAppointmentById: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    '',
    {
      schema: getAppointmentSchema,
      onRequest: fastify.verify(fastify.BearerToken, fastify.SessionToken),
    },
    async (request) => {
      const { id } = request.params

      // TODO: Workaround. Replace with getting a custom object by id
      const appointment = await qbUpdateCustomObject<QBAppointment>(
        QBUserApi,
        id,
        'Appointment',
        {},
      )

      return appointment
    },
  )
}

export default getAppointmentById
