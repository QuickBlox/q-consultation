import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';

import { getCompletion } from '@/services/openai';
import { qbGetUsersByTags } from '@/services/users';
import { parseProvider, parseUserCustomData } from '@/utils/user';
import { QBUser } from 'quickblox';
import { QCProvider } from '@/models';

export const searchByTopicSchema = {
  tags: ['ai', 'providers'],
  body: Type.Object({
    topic: Type.String(),
  }),
  response: {
    200: Type.Object({
      providers: Type.Array(Type.Ref(QCProvider)),
    }),
  },
  security: [
    {
      apiKey: [],
    },
  ],
};

const getAllProviders = async (page = 1): Promise<Dictionary<QBUser>> => {
  const PER_PAGE = 100;
  const { total_entries, items } = await qbGetUsersByTags('provider', {
    per_page: PER_PAGE,
    page,
  });

  const providersDictionary = items.reduce<Dictionary<QBUser>>(
    (res, { user }) => ({ ...res, [user.id]: user }),
    {},
  );

  if (total_entries > page * PER_PAGE) {
    const providersDictionaryLast = await getAllProviders(page + 1);

    return { ...providersDictionary, ...providersDictionaryLast };
  }

  return providersDictionary;
};

const getProvidersKeywords = (providrs: Dictionary<QBUser>) => {
  const providersList = Object.values(providrs);
  const keywordsList = providersList.reduce<string[]>((res, user) => {
    const { keywords } = parseUserCustomData(user.custom_data);

    return keywords ? [...res, `${user.id}: ${keywords}`] : res;
  }, []);

  return keywordsList;
};

const searchByTopic: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post(
    '/suggestions',
    {
      schema: searchByTopicSchema,
      onRequest: fastify.verify(fastify.BearerToken, fastify.SessionToken),
    },
    async (request) => {
      const { topic } = request.body;

      const users = await getAllProviders();
      const usersKeywords = getProvidersKeywords(users);

      const res = await getCompletion(
        `There is a list of specialists in the format: "id: keywords""\n${usersKeywords.join(
          '\n',
        )}\n\n` +
          `User wrote:\n${topic.replaceAll('\n', ' ')}\n\n` +
          'Select specialists for the user by keywords. Print their id separated by commas.\n\n',
      );
      const providerIds = res === 'No specialists found.' ? [] : res.split(',');

      const providers = providerIds.map(
        (id) => parseProvider(users[id.trim()])!,
      );

      return {
        providers,
      };
    },
  );
};

export const autoload = JSON.parse<boolean>(process.env.AI_SUGGEST_PROVIDER!);

export default searchByTopic;
