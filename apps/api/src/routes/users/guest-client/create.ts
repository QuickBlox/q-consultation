import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { randomBytes } from 'crypto'
import QB, { promisifyCall, QBSession } from '@qc/quickblox'

import { QBSession as QBSessionModel, QBUser, QCClient } from '@/models'

export const createGuestClientSchema = {
  tags: ['Users'],
  summary: 'Create Guest client',
  description: 'Creates a new guest client',
  body: Type.Pick(QCClient, ['full_name']),
  response: {
    200: Type.Object({
      session: Type.Ref(QBSessionModel),
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
    const session = await promisifyCall<QBSession>(QB.createSession)

    await promisifyCall(QB.users.create, {
      login,
      password,
      full_name,
      tag_list: 'guest',
    })
    const user = await promisifyCall(QB.login, { login, password })

    return { session, user }
  })
}

export const autoload = JSON.parse<boolean>(process.env.ENABLE_GUEST_CLIENT!)

export default createGuestClient
