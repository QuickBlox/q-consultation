import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'

import { QBSession, QBUser } from '@/models'
import { qbCreateSession, qbLogin } from '@/services/auth'
import { userHasTag } from '@/utils/user'

export const loginSchema = {
  tags: ['auth'],
  description: 'User login',
  body: Type.Object({
    role: Type.Union([Type.Literal('client'), Type.Literal('provider')]),
    email: Type.String({ format: 'email' }),
    password: Type.String(),
  }),
  response: {
    200: Type.Object({
      session: Type.Ref(QBSession),
      data: Type.Ref(QBUser),
    }),
  },
}

const login: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post('/login', { schema: loginSchema }, async (request, reply) => {
    const { role, email, password } = request.body
    const session = await qbCreateSession()
    const user = await qbLogin(email, password)
    const isProvider = userHasTag(user, 'provider')

    if (role === 'provider' ? isProvider : !isProvider) {
      return { session, data: user }
    }

    return reply.unauthorized('Unauthorized')
  })
}

export default login
