import fp from 'fastify-plugin';
import swagger, { SwaggerOptions } from '@fastify/swagger';
import swaggerUI, { FastifySwaggerUiOptions } from '@fastify/swagger-ui';
import { Type } from '@sinclair/typebox';
import * as commonModels from '@/models/common';

const swaggerOptions: SwaggerOptions = {
  swagger: {
    info: {
      version: process.env.npm_package_version || '',
      title: process.env.npm_package_name || '',
    },
    securityDefinitions: {
      apiKey: {
        type: 'apiKey' as const,
        name: 'Authorization',
        in: 'header',
        description: 'Format: "Bearer $TOKEN"',
      },
    },
    consumes: ['application/json', 'multipart/form-data'],
    produces: ['application/json'],
    // tags: [
    //   {
    //     name: 'providers',
    //     description: 'providers',
    //   },
    // ],
    // @ts-ignore
    // definitions: models,
  },
  refResolver: {
    buildLocalReference: (json, baseUri, fragment, i) => {
      return typeof json.$id === 'string' ? json.$id : `def-${i}`;
    },
  },
  // @ts-ignore
  transform: ({ url, schema }) => {
    return {
      url,
      schema: {
        ...schema,
        response: {
          '4xx': Type.Ref(commonModels.Error, {
            description: 'Client error responses',
          }),
          '5xx': Type.Ref(commonModels.Error, {
            description: 'Server error responses',
          }),
          ...(schema?.response || {}),
        },
      },
    };
  },
};

const swaggerUIOptions: FastifySwaggerUiOptions = {
  routePrefix: '/swagger',
};

export default fp(
  async (fastify) => {
    Object.values(commonModels).forEach((schema) => {
      fastify.addSchema(schema);
    });

    await fastify.register(swagger, swaggerOptions);
    await fastify.register(swaggerUI, swaggerUIOptions);
  },
  { name: 'swagger' },
);
