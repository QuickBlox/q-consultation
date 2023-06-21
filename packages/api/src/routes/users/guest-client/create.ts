import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { QBCreateUserWithLogin } from 'quickblox'
import { randomBytes } from 'crypto'

import { QBSession, QBUser, QCClient } from '@/models'
import { qbCreateSession, qbLogin } from '@/services/auth'
import { qbCreateUser } from '@/services/users'

export const createGuestClientSchema = {
  tags: ['Users', 'Client'],
  summary: 'Create Guest client',
  body: Type.Pick(QCClient, ['full_name']),
  response: {
    200: Type.Object({
      session: Type.Ref(QBSession),
      user: Type.Ref(QBUser),
    }),
  },
  security: [{ apiKey: [] }, { providerSession: [] }] as Security,
}

const createGuestClient: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post('', { schema: createGuestClientSchema }, async (request) => {
    const { full_name } = request.body
    const login = Date.now().toString()
    const password = randomBytes(8).toString('hex')
    const session = await qbCreateSession()

    await qbCreateUser<QBCreateUserWithLogin>({
      login,
      password,
      full_name,
      tag_list: 'guest',
    })
    const user = await qbLogin({ login, password })

    return { session, user }
  })
}

export default createGuestClient
