import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { QBAppointment } from 'quickblox'

import { QCAppointment } from '@/models'
import { qbGetCustomObject } from '@/services/customObject'

const getAppointmentListSchema = {
  tags: ['appointments'],
  description: 'Get a list of appointments',
  querystring: Type.Partial(
    Type.Object({
      limit: Type.Integer({ default: 100 }),
      skip: Type.Integer({ default: 0 }),
      sort_desc: Type.KeyOf(QCAppointment, {
        description: `Available values: ${Type.KeyOf(QCAppointment)
          .anyOf.map(({ const: field }) => field)
          .join(', ')}`,
      }),
      sort_asc: Type.KeyOf(QCAppointment, {
        description: `Available values: ${Type.KeyOf(QCAppointment)
          .anyOf.map(({ const: field }) => field)
          .join(', ')}`,
      }),
    }),
  ),
  response: {
    200: Type.Array(Type.Ref(QCAppointment)),
  },
  security: [
    { apiKey: [] },
    { providerSession: [] },
    { clientSession: [] },
  ] as Array<{
    [securityLabel: string]: string[]
  }>,
}

const getAppointmentList: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    '',
    {
      schema: getAppointmentListSchema,
      onRequest: fastify.verify(fastify.BearerToken, fastify.SessionToken),
    },
    async (request) => {
      const { items: appointments } = await qbGetCustomObject<QBAppointment>(
        'Appointment',
        request.query,
      )

      return appointments
    },
  )
}

export default getAppointmentList
