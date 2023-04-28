import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import pick from 'lodash/pick';

import { QCProvider } from '@/models';
import { parseProvider, stringifyUserCustomData } from '@/utils/user';
import { qbUpdateUser } from '@/services/users';
import { getCompletion } from '@/services/openai';

export const updateSchema = {
  tags: ['users', 'providers'],
  params: Type.Object({
    id: Type.String({ pattern: '^[0-9]+$' }),
  }),
  body: Type.Partial(
    Type.Omit(QCProvider, [
      'id',
      'created_at',
      'updated_at',
      'last_request_at',
    ]),
  ),
  response: {
    200: Type.Ref(QCProvider),
  },
  security: [
    {
      apiKey: [],
    },
  ],
};

const updateById: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.put(
    '/:id',
    {
      schema: updateSchema,
      onRequest: fastify.verify(fastify.BearerToken),
    },
    async (request) => {
      const { description } = request.body;
      const userData = pick(request.body, 'full_name', 'email', 'password');
      const customData = pick(
        request.body,
        'full_name',
        'description',
        'language',
      );
      let keywords = '';

      if (fastify.config.AI_SUGGEST_PROVIDER && description) {
        keywords = await getCompletion(
          `Write in English keywords describing a specialist for this description separated by commas:\n${description.replaceAll(
            '\n',
            ' ',
          )}\n\n`,
        );
      }

      const updatedUser = await qbUpdateUser(parseInt(request.params.id, 10), {
        ...userData,
        custom_data: stringifyUserCustomData({ ...customData, keywords }),
      });

      return parseProvider(updatedUser)!;
    },
  );
};

export default updateById;
