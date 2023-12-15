import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import QB, { promisifyCall, userHasTag, QBSession } from '@qc/quickblox'

import { QBSession as QBSessionModel, QBUser } from '@/models'

export const loginSchema = {
  tags: ['Auth'],
  summary: 'User login',
  body: Type.Object({
    role: Type.Union(
      [
        Type.Literal('client', { title: 'client' }),
        Type.Literal('provider', { title: 'provider' }),
      ],
      {
        description: "User's role as a provider or client",
      },
    ),
    email: Type.String({ format: 'email', description: "User's email" }),
    password: Type.String({ description: "User's password" }),
  }),
  response: {
    200: Type.Object({
      session: Type.Ref(QBSessionModel),
      data: Type.Ref(QBUser),
    }),
  },
}

const login: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post('/login', { schema: loginSchema }, async (request, reply) => {
    const { role, email, password } = request.body
    const session = await promisifyCall<QBSession>(QB.createSession)
    const user = await promisifyCall(QB.login, { email, password })
    const isProvider = userHasTag(user, 'provider')

    if (role === 'provider' ? isProvider : !isProvider) {
      return { session, data: user }
    }

    return reply.unauthorized('Unauthorized')
  })
}

export default login
