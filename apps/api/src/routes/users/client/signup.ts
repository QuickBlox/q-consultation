import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { pick } from 'lodash'

import { QBSession as QBSessionModel, QBUser, QCClient } from '@/models'
import QB, {
  promisifyCall,
  QBSession,
  stringifyUserCustomData,
} from '@qc/quickblox'

export const signUpSchema = {
  tags: ['Users'],
  summary: 'Create client',
  body: Type.Intersect([
    Type.Omit(QCClient, ['id', 'created_at', 'updated_at', 'last_request_at']),
    Type.Object({
      password: Type.String({
        description: "User's password",
      }),
    }),
  ]),
  response: {
    200: Type.Object({
      session: Type.Ref(QBSessionModel),
      user: Type.Ref(QBUser),
    }),
  },
}

const signup: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post('', { schema: signUpSchema }, async (request) => {
    const { email, password } = request.body

    const userData = pick(request.body, 'full_name', 'email', 'password')
    const customData = pick(
      request.body,
      'address',
      'birthdate',
      'gender',
      'language',
    )

    const session = await promisifyCall<QBSession>(QB.createSession)

    await promisifyCall(QB.users.create, {
      ...userData,
      custom_data: stringifyUserCustomData(customData),
    })
    const user = await promisifyCall(QB.login, { email, password })

    return { session, user }
  })
}

export default signup
