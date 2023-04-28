import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import pick from 'lodash/pick';

import { QCClient } from '@/models';
import { parseClient, stringifyUserCustomData } from '@/utils/user';
import { qbUpdateUser } from '@/services/users';

export const updateSchema = {
  tags: ['users', 'clients'],
  params: Type.Object({
    id: Type.String({ pattern: '^[0-9]+$' }),
  }),
  body: Type.Partial(
    Type.Omit(QCClient, ['id', 'created_at', 'updated_at', 'last_request_at']),
  ),
  response: {
    200: Type.Ref(QCClient),
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
      const customData = pick(
        request.body,
        'full_name',
        'address',
        'birthdate',
        'gender',
        'language',
      );

      const updatedUser = await qbUpdateUser(parseInt(request.params.id, 10), {
        custom_data: stringifyUserCustomData(customData),
      });

      return parseClient(updatedUser)!;
    },
  );
};

export default updateById;
