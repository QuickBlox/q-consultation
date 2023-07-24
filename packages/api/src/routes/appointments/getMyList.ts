import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Static, Type } from '@sinclair/typebox'
import { QBAppointment, QBSession } from 'quickblox'
import omit from 'lodash/omit'

import {
  DateISO,
  QBUserId,
  QCAppointment,
  QCAppointmentSortKeys,
} from '@/models'
import { qbGetCustomObject, findUserById } from '@/services/quickblox'
import { userHasTag } from '@/utils/user'

const getMyAppointmentListSchema = {
  tags: ['Appointments'],
  summary: 'Get a list of my appointments',
  description: 'Retrieve all user appointments list',
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
      priority: Type.Integer({
        minimum: 0,
        maximum: 2,
        description: 'The priority of the appointment in the queue',
      }),
      provider_id: {
        ...QBUserId,
        description: 'Only for `clientSession` Authorization',
      },
      client_id: {
        ...QBUserId,
        description: 'Only for `providerSession` Authorization',
      },
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
  security: [{ providerSession: [] }, { clientSession: [] }] as Security,
}

const getMyAppointmentList: FastifyPluginAsyncTypebox = async (fastify) => {
  const handleValidate = async (
    session: QBSession,
    query: Static<typeof getMyAppointmentListSchema.querystring>,
  ) => {
    const { provider_id, client_id } = query
    const user = await findUserById(session.user_id)
    const isProvider = userHasTag(user!, 'provider')

    if (isProvider && provider_id) {
      return fastify.httpErrors.forbidden('body/provider_id Forbidden property')
    }

    if (!isProvider && client_id) {
      return fastify.httpErrors.forbidden('body/client_id Forbidden property')
    }

    return undefined
  }

  fastify.get(
    '/my',
    {
      schema: getMyAppointmentListSchema,
      preHandler: (request, reply, done) => {
        handleValidate(request.session!, request.query).then(done).catch(done)
      },
      onRequest: fastify.verify(fastify.SessionToken),
    },
    async (request) => {
      const myAccount = await findUserById(request.session!.user_id)
      const isProvider = userHasTag(myAccount!, 'provider')

      const {
        'date_end[from]': dateFrom,
        'date_end[to]': dateTo,
        ...baseFilter
      } = request.query
      const filter = {
        ...baseFilter,
        [isProvider ? 'provider_id' : 'client_id']: request.session!.user_id,
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

export default getMyAppointmentList
