import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import { ChatCompletionResponseMessageRoleEnum } from 'openai';
import { getChatCompletion } from '@/services/openai';

export const clarifyingQuestionsSchema = {
  tags: ['ai', 'providers'],
  body: Type.Object({
    topic: Type.String(),
    messages: Type.Array(
      Type.Object({
        role: Type.Enum(ChatCompletionResponseMessageRoleEnum),
        content: Type.String(),
      }),
    ),
  }),
  response: {
    200: Type.Object({
      message: Type.String(),
    }),
  },
  security: [
    {
      apiKey: [],
    },
  ],
};

const clarifyingQuestions: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post(
    '/clarifying-questions',
    {
      schema: clarifyingQuestionsSchema,
      onRequest: fastify.verify(
        fastify.BearerToken,
        fastify.ProviderSessionToken,
      ),
    },
    async (request) => {
      const { topic, messages } = request.body;

      const message = await getChatCompletion([
        {
          role: 'system',
          content: `Communicate in your partner's language. Ask the user for clarifying questions about their problem. Ask 1 question. At the end of the questions, send only this message: "Thanks for the information. Please wait for a response from the doctor." and nothing more.`,
        },
        { role: 'user', content: topic },
        ...messages,
      ]);

      return { message };
    },
  );
};

export default clarifyingQuestions;
