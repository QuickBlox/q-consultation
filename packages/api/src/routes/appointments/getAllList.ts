import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { QBAppointment } from 'quickblox'
import omit from 'lodash/omit'
import pick from 'lodash/pick'
import keys from 'lodash/keys'

import {
  DateISO,
  QBUserId,
  QCAppointment,
  QCAppointmentSortKeys,
} from '@/models'
import { qbGetCustomObject } from '@/services/quickblox'

const getAllAppointmentListSchema = {
  tags: ['Appointments'],
  summary: 'Get a list of all appointments',
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
      sort_desc: QCAppointmentSortKeys,
      sort_asc: QCAppointmentSortKeys,
      priority: Type.Integer({ minimum: 0, maximum: 2 }),
      provider_id: QBUserId,
      client_id: QBUserId,
      'date_end[from]': DateISO,
      'date_end[to]': DateISO,
    }),
  ),
  response: {
    200: Type.Object({
      items: Type.Array(Type.Ref(QCAppointment)),
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
  security: [{ apiKey: [] }] as Security,
}

const getAllAppointmentList: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    '',
    {
      schema: getAllAppointmentListSchema,
      onRequest: fastify.verify(fastify.BearerToken),
    },
    async (request) => {
      const receivedQuery = pick(
        request.query,
        keys(getAllAppointmentListSchema.querystring.properties),
      )
      const {
        'date_end[from]': dateFrom,
        'date_end[to]': dateTo,
        ...baseFilter
      } = receivedQuery

      const filter = {
        ...baseFilter,
        date_end: {
          gte: dateFrom,
          lte: dateTo,
        },
      }

      const appointments = await qbGetCustomObject<QBAppointment>(
        'Appointment',
        filter,
      )

      return omit(appointments, 'class_name')
    },
  )
}

export default getAllAppointmentList
