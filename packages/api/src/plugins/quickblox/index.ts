import fp from 'fastify-plugin'
import { QBSession, QBUser } from 'quickblox'

import { userHasTag } from '@/services/quickblox/utils'
import { QBAdminApi, QBUserApi, qbCreateSession } from '@/services/quickblox'
import {
  TokenHandler,
  createVerify,
  getSessionByBearerToken,
  getSessionByUserToken,
  getUserAndSessionByUserToken,
} from './verification'

export default fp(
  async (fastify) => {
    const { BEARER_TOKEN, QB_ADMIN_EMAIL, QB_ADMIN_PASSWORD } = fastify.config

    fastify.decorate('qbAdminId', null)

    fastify.addHook('onReady', async () => {
      if (QB_ADMIN_EMAIL && QB_ADMIN_PASSWORD) {
        QBAdminApi.init()
        const session = await qbCreateSession(QBAdminApi, {
          email: QB_ADMIN_EMAIL,
          password: QB_ADMIN_PASSWORD,
        })

        // eslint-disable-next-line no-param-reassign
        fastify.qbAdminId = session.user_id
      }
    })

    fastify.addHook('onRequest', async () => {
      QBUserApi.init()
    })

    fastify.decorateRequest('session', null)

    fastify.decorate('SessionToken', (token?: string) =>
      getSessionByUserToken(QBUserApi, token),
    )
    fastify.decorate('ClientSessionToken', async (token?: string) => {
      const data = await getUserAndSessionByUserToken(QBUserApi, token)

      return !data || userHasTag(data.user, 'provider') ? null : data.session
    })
    fastify.decorate('ProviderSessionToken', async (token?: string) => {
      const data = await getUserAndSessionByUserToken(QBUserApi, token)

      return data && userHasTag(data.user, 'provider') ? data.session : null
    })
    fastify.decorate('BearerToken', (token?: string) =>
      getSessionByBearerToken(QBUserApi, BEARER_TOKEN, token, {
        email: QB_ADMIN_EMAIL,
        password: QB_ADMIN_PASSWORD,
      }),
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
