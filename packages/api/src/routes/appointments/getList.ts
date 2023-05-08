import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { QBAppointment } from 'quickblox'

import { QCAppointment } from '@/models'
import { qbGetCustomObject } from '@/services/customObject'

const getAppointmentListSchema = {
  tags: ['appointments'],
  params: Type.Partial(
    Type.Object({
      limit: Type.Integer(),
      skip: Type.Integer(),
      sort_desc: Type.KeyOf(QCAppointment),
      sort_asc: Type.KeyOf(QCAppointment),
    }),
  ),
  response: {
    200: Type.Array(Type.Ref(QCAppointment)),
  },
  security: [
    {
      apiKey: [],
    },
  ],
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
        request.params,
      )

      return appointments
    },
  )
}

export default getAppointmentList
