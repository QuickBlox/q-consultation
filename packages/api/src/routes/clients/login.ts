import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';

import { QBSession, QBUser } from '@/models';
import { qbCreateSession, qbLogin } from '@/services/auth';
import { userHasTag } from '@/utils/user';
// import { parseClient } from '@/utils/user';

export const loginSchema = {
  tags: ['users', 'clients'],
  body: Type.Object({
    email: Type.String({ format: 'email' }),
    password: Type.String(),
  }),
  response: {
    200: Type.Object({
      session: Type.Ref(QBSession),
      data: Type.Ref(QBUser),
    }),
  },
};

const login: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post('/login', { schema: loginSchema }, async (request, reply) => {
    const session = await qbCreateSession();
    const user = await qbLogin(request.body.email, request.body.password);
    // const client = parseClient(user);

    if (!userHasTag(user, 'provider')) {
      return { session, data: user };
    }

    return reply.unauthorized('Unauthorized');
  });
};

export default login;
