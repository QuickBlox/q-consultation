import fp from 'fastify-plugin'
import QB, { promisifyCall, QBSession, QBUser, userHasTag } from '@qc/quickblox'

import { QBAdmin, createInitConfig } from '@/services/quickblox'
import {
  TokenHandler,
  createVerify,
  getSessionByBearerToken,
  getSessionByUserToken,
  getUserAndSessionByUserToken,
} from './verification'

export default fp(
  async (fastify) => {
    const {
      BEARER_TOKEN,
      QB_ADMIN_EMAIL,
      QB_ADMIN_PASSWORD,
      QB_SDK_CONFIG_APP_ID,
      QB_SDK_CONFIG_AUTH_KEY,
      QB_SDK_CONFIG_AUTH_SECRET,
      QB_SDK_CONFIG_ACCOUNT_KEY,
    } = fastify.config
    const qbConfig = createInitConfig(fastify.config)

    fastify.decorate('qbAdminId', null)

    fastify.addHook('onReady', async () => {
      if (QB_ADMIN_EMAIL && QB_ADMIN_PASSWORD) {
        QBAdmin.init(
          QB_SDK_CONFIG_APP_ID,
          QB_SDK_CONFIG_AUTH_KEY,
          QB_SDK_CONFIG_AUTH_SECRET,
          QB_SDK_CONFIG_ACCOUNT_KEY,
          qbConfig,
        )
        const session = await promisifyCall(QBAdmin.createSession, {
          email: QB_ADMIN_EMAIL,
          password: QB_ADMIN_PASSWORD,
        })

        // eslint-disable-next-line no-param-reassign
        fastify.qbAdminId = session.user_id
      }
    })

    fastify.addHook('onRequest', async () => {
      QB.init(
        QB_SDK_CONFIG_APP_ID,
        QB_SDK_CONFIG_AUTH_KEY,
        QB_SDK_CONFIG_AUTH_SECRET,
        QB_SDK_CONFIG_ACCOUNT_KEY,
        qbConfig,
      )
    })

    fastify.decorateRequest('session', null)

    fastify.decorate('SessionToken', (token?: string) =>
      getSessionByUserToken(token),
    )
    fastify.decorate('ClientSessionToken', async (token?: string) => {
      const data = await getUserAndSessionByUserToken(token)

      return !data || userHasTag(data.user, 'provider') ? null : data.session
    })
    fastify.decorate('ProviderSessionToken', async (token?: string) => {
      const data = await getUserAndSessionByUserToken(token)

      return data && userHasTag(data.user, 'provider') ? data.session : null
    })
    fastify.decorate('BearerToken', (token?: string) =>
      getSessionByBearerToken(BEARER_TOKEN, token, {
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
