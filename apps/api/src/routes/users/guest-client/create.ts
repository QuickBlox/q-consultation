import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { QBCreateUserWithLogin } from 'quickblox'
import { randomBytes } from 'crypto'

import { QBSession, QBUser, QCClient } from '@/models'
import { qbCreateSession, qbLogin } from '@/services/quickblox/auth'
import { qbCreateUser } from '@/services/quickblox/users'
import { QBUserApi } from '@/services/quickblox'

export const createGuestClientSchema = {
  tags: ['Users'],
  summary: 'Create Guest client',
  description: 'Creates a new guest client',
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
    const session = await qbCreateSession(QBUserApi)

    await qbCreateUser<QBCreateUserWithLogin>(QBUserApi, {
      login,
      password,
      full_name,
      tag_list: 'guest',
    })
    const user = await qbLogin(QBUserApi, { login, password })

    return { session, user }
  })
}

export const autoload = JSON.parse<boolean>(process.env.ENABLE_GUEST_CLIENT!)

export default createGuestClient
