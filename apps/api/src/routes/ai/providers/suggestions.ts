import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import QB, { promisifyCall, QBUser, parseUserCustomData } from '@qc/quickblox'

import { findProviderIdsByKeywords } from '@/services/openai'
import { QBUser as QBUserModel } from '@/models'

export const suggestProviderSchema = {
  tags: ['AI', 'Users'],
  summary: 'Get suggested providers by name or issue',
  body: Type.Object({
    topic: Type.String({ minLength: 1 }),
  }),
  response: {
    200: Type.Object({
      providers: Type.Array(Type.Ref(QBUserModel)),
    }),
  },
  security: [
    { apiKey: [] },
    { providerSession: [] },
    { clientSession: [] },
  ] as Security,
}

const getAllProviders = async (page = 1): Promise<Dictionary<QBUser>> => {
  const PER_PAGE = 100
  const { total_entries, items } = await promisifyCall(QB.users.get, {
    tags: 'provider',
    per_page: PER_PAGE,
    page,
  })

  const providersDictionary = items.reduce<Dictionary<QBUser>>(
    (res, { user }) => ({ ...res, [user.id]: user }),
    {},
  )

  if (total_entries > page * PER_PAGE) {
    const providersDictionaryLast = await getAllProviders(page + 1)

    return { ...providersDictionary, ...providersDictionaryLast }
  }

  return providersDictionary
}

const getProvidersKeywords = (providrs: Dictionary<QBUser>) => {
  const providersList = Object.values(providrs)
  const keywordsList = providersList.reduce((res, user) => {
    const { keywords } = parseUserCustomData(user.custom_data)

    return keywords ? `${res}\n${user.id}: ${keywords}` : res
  }, '')

  return keywordsList.trim()
}

const suggestProvider: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post(
    '/suggestions',
    {
      schema: suggestProviderSchema,
      onRequest: fastify.verify(fastify.BearerToken, fastify.SessionToken),
    },
    async (request) => {
      const { topic } = request.body

      const users = await getAllProviders()
      const usersByFullName = Object.values(users).filter(({ full_name }) =>
        full_name?.toLowerCase().includes(topic.toLowerCase()),
      )

      if (usersByFullName.length) {
        return { providers: usersByFullName }
      }

      const usersKeywords = getProvidersKeywords(users)
      const providerIds = await findProviderIdsByKeywords(usersKeywords, topic)
      const providers = providerIds?.map((id) => users[id]) || []

      return {
        providers,
      }
    },
  )
}

export const autoload = JSON.parse<boolean>(process.env.AI_SUGGEST_PROVIDER!)

export default suggestProvider
