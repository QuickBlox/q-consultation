import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  onRequestHookHandler,
} from 'fastify'
import { QBSession } from 'quickblox'

import { qbCreateSession, qbSessionWithToken } from '@/services/auth'
import { findUserById } from '@/services/users'

export type TokenHandler = (token?: string | null) => Promise<QBSession | null>

export const getSessionByUserToken = async (token?: string) => {
  try {
    if (!token) return null

    const session = await qbSessionWithToken(token)

    if (session.user_id) return session

    return null
  } catch (error) {
    return null
  }
}

export const getUserAndSessionByUserToken = async (token?: string) => {
  try {
    const session = await getSessionByUserToken(token)

    if (session) {
      const user = await findUserById(session.user_id)

      return { user, session }
    }

    return null
  } catch (error) {
    return null
  }
}

export const getSessionByBearerToken = (
  token: string | undefined,
  config: FastifyInstance['config'],
) => {
  if (token === config.BEARER_TOKEN) {
    return qbCreateSession(config.QB_ADMIN_EMAIL, config.QB_ADMIN_PASSWORD)
  }

  return Promise.resolve(null)
}

export const createVerify =
  (
    authHandler: (
      request: FastifyRequest,
      reply: FastifyReply,
      getSession: () => Promise<QBSession | null>,
    ) => Promise<void>,
  ) =>
  (...tokenHandlers: TokenHandler[]): onRequestHookHandler =>
  (request, reply, done) => {
    // chain of responsibility
    async function getValidSession(
      fn: TokenHandler[],
    ): Promise<QBSession | null> {
      const [current, ...next] = fn

      if (!current) return null

      const session = await current(request.token)

      if (session) return session

      const nextValue = await getValidSession(next)

      return nextValue
    }

    /* eslint-disable promise/no-callback-in-promise */
    authHandler(request, reply, () => getValidSession(tokenHandlers))
      .then(() => done())
      .catch((error) => done(error))
    /* eslint-enable */
  }
