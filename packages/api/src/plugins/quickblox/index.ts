import fp from 'fastify-plugin'
import { QBSession, QBUser } from 'quickblox'
import { qbCreateSession, qbInit } from '@/services/quickblox'
import { userHasTag } from '@/utils/user'
import {
  TokenHandler,
  createVerify,
  getSessionByBearerToken,
  getSessionByUserToken,
  getUserAndSessionByUserToken,
} from './verification'

export default fp(
  async (fastify) => {
    fastify.decorate('qbAdminId', null)

    fastify.addHook('onReady', async () => {
      const { QB_ADMIN_EMAIL, QB_ADMIN_PASSWORD } = fastify.config

      if (QB_ADMIN_EMAIL && QB_ADMIN_PASSWORD) {
        qbInit(fastify.config)
        const session = await qbCreateSession(QB_ADMIN_EMAIL, QB_ADMIN_PASSWORD)

        // eslint-disable-next-line no-param-reassign
        fastify.qbAdminId = session.user_id
      }
    })

    fastify.addHook('onRequest', async () => {
      qbInit(fastify.config)
    })

    fastify.decorateRequest('session', null)

    fastify.decorate('SessionToken', getSessionByUserToken)
    fastify.decorate('ClientSessionToken', async (token?: string) => {
      const data = await getUserAndSessionByUserToken(token)

      return !data || userHasTag(data.user, 'provider') ? null : data.session
    })
    fastify.decorate('ProviderSessionToken', async (token?: string) => {
      const data = await getUserAndSessionByUserToken(token)

      return data && userHasTag(data.user, 'provider') ? data.session : null
    })
    fastify.decorate('BearerToken', (token?: string) =>
      getSessionByBearerToken(token, fastify.config),
    )
    fastify.decorate(
      'verify',
      createVerify(async (request, reply, getSession) => {
        if (!request.token) {
          throw fastify.httpErrors.unauthorized('Missing authorization header')
        }

        const session = await getSession()

        if (session) {
          request.session = session
        } else {
          throw fastify.httpErrors.unauthorized()
        }
      }),
    )
  },
  { dependencies: ['env', 'auth'] },
)

declare module 'fastify' {
  interface FastifyInstance {
    qbAdminId: QBUser['id'] | null
    SessionToken: TokenHandler
    ClientSessionToken: TokenHandler
    ProviderSessionToken: TokenHandler
    BearerToken: TokenHandler
    verify: ReturnType<typeof createVerify>
  }

  interface FastifyRequest {
    session: QBSession | null
  }
}
