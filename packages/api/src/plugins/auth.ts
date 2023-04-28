import { FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

export default fp(
  async (fastify) => {
    fastify.decorateRequest('token', {
      getter(this: FastifyRequest) {
        const bearerType = 'Bearer';
        const { authorization } = this.headers;
        const key = authorization?.substring(bearerType.length).trim();

        return key || null;
      },
    });
  },
  { name: 'auth' },
);

declare module 'fastify' {
  interface FastifyRequest {
    token: string | null;
  }
}
