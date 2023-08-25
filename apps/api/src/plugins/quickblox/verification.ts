import { FastifyReply, FastifyRequest, onRequestHookHandler } from 'fastify'
import { QBLoginParams, QBSession } from 'quickblox'

import {
  QBApi,
  getUserById,
  qbCreateSession,
  qbSessionWithToken,
} from '@/services/quickblox'

export type TokenHandler = (token?: string | null) => Promise<QBSession | null>

export const getSessionByUserToken = async (QB: QBApi, token?: string) => {
  try {
    if (!token) return null

    const session = await qbSessionWithToken(QB, token)

    if (session.user_id) return session

    return null
  } catch (error) {
    return null
  }
}

export const getUserAndSessionByUserToken = async (
  QB: QBApi,
  token?: string,
) => {
  try {
    const session = await getSessionByUserToken(QB, token)

    if (session) {
      const user = await getUserById(QB, session.user_id)

      return user ? { user, session } : null
    }

    return null
  } catch (error) {
    return null
  }
}

export const getSessionByBearerToken = async (
  QB: QBApi,
  bearerToken: string | undefined,
  tokenValue: string | undefined,
  credentials: QBLoginParams,
) => {
  if (bearerToken && bearerToken === tokenValue) {
    const session = await qbCreateSession(QB, credentials)

    return session
  }

  return null
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
