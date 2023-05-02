import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { pick } from 'lodash'
import { QBCreateUserWithEmail } from 'quickblox'

import { QBSession, QBUser, QCClient } from '@/models'
import { qbCreateSession } from '@/services/auth'
import { qbCreateUser } from '@/services/users'

export const signUpSchema = {
  tags: ['users', 'clients'],
  body: Type.Intersect([
    Type.Omit(QCClient, ['id', 'created_at', 'updated_at', 'last_request_at']),
    Type.Object({
      password: Type.String(),
    }),
  ]),
  response: {
    200: Type.Object({
      session: Type.Ref(QBSession),
      data: Type.Ref(QBUser),
    }),
  },
}

const signup: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post('/signup', { schema: signUpSchema }, async (request) => {
    const userData = pick(request.body, 'full_name', 'email', 'password')
    const customData = pick(
      request.body,
      'full_name',
      'address',
      'birthdate',
      'gender',
      'language',
    )
    const session = await qbCreateSession()
    const user = await qbCreateUser<QBCreateUserWithEmail>({
      ...userData,
      custom_data: JSON.stringify(customData),
    })

    return { session, data: user }
  })
}

export default signup
