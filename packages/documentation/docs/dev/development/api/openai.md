---
sidebar_label: 'OpenAI'
sidebar_position: 1
---

# OpenAI

The [OpenAI](https://openai.com/) can be applied to virtually any task
that involves understanding or generating natural language, code, or images.
We use the capabilities of OpenAI for semantic search for providers,
creating transcription for videos, generating text at prompt.

The [prompt](https://platform.openai.com/docs/guides/completion/prompt-design) is essentially how you “program” the model,
usually by providing some instructions or a few examples.
The completions and chat completions can be used for virtually any task including content or code generation,
summarization, expansion, conversation, creative writing, style transfer, and more.

The OpenAI is powered by a set of models with different capabilities and price points.
GPT-4 is latest and most powerful model.
GPT-3.5-Turbo is the model that powers ChatGPT and is optimized for conversational formats.
To learn more about models and what else we offer, visit [models documentation](https://platform.openai.com/docs/models).

With OpenAI integrated into Q-Consultation Lite,
developers now have access to a wide range of advanced AI features and capabilities.
Let's dive into how to use this integration.

To work with the OpenAI API, we use the [OpenAI Node.js Library](https://www.npmjs.com/package/openai).
In the application, we have implemented our own service that uses this library and has the same API.
This server is already configured for use with [Fastify](https://www.fastify.io), so we advise you to use it.
We also implement all cases for working with OpenAI in this service in the file
[`packages/api/src/services/openai/integration.ts`](https://github.com/QuickBlox/q-consultation/blob/master/packages/api/src/services/openai/integration.ts).

## Completion

Given a prompt, the model will return one or more predicted completions,
and can also return the probabilities of alternative tokens at each position.

**Available models**:

- `text-davinci-003`
- `text-davinci-002`
- `text-curie-001`
- `text-babbage-001`
- `text-ada-001`

### Create completion

Creates a completion for the provided prompt and parameters.

To work with Create completion, we use our own OpenAI service with the method `openAIApi.createChatCompletion`.

```ts title="Usage example"
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { openAIApi } from '@/services/openai'

export const completionSchema = {
  tags: ['OpenAI Example'],
  summary: 'OpenAI completion example',
  body: Type.Object({
    prompt: Type.String(),
  }),
  response: {
    200: Type.Object({
      text: Type.String(),
    ),
  },
  security: [{ apiKey: [] }] as Security,
}

const completion: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post(
    '/completion',
    {
      schema: completionSchema,
      onRequest: fastify.verify(
        fastify.BearerToken,
      ),
    },
    async (request) => {
      const { prompt } = request.body
      const { data } = await openAIApi.createCompletion({
        model: 'text-davinci-003',
        prompt,
      })
      const text = data.choices[0]?.text

      return {
        text,
      }
    },
  )
}

export default completion
```

:::tip
Read the [OpenAI API reference on Create completion](https://platform.openai.com/docs/api-reference/completions/create?lang=node.js) to learn more.
:::

## Chat

Given a list of messages describing a conversation, the model will return a response.

**Available models**:

- `gpt-4`
- `gpt-4-0314`
- `gpt-4-32k`
- `gpt-4-32k-0314`
- `gpt-3.5-turbo`
- `gpt-3.5-turbo-0301`

### Create chat completion

Creates a model response for the given chat conversation.

To work with Create chat completion, we use our own OpenAI service with the method `openAIApi.createChatCompletion`.

```ts title="Usage example"
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { openAIApi } from '@/services/openai'

export const chatCompletionSchema = {
  tags: ['OpenAI Example'],
  summary: 'OpenAI chat completion example',
  body: Type.Object({
    prompt: Type.String(),
  }),
  response: {
    200: Type.Object({
      text: Type.String(),
    ),
  },
  security: [{ apiKey: [] }] as Security,
}

const chatCompletion: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post(
    '/chat-completion',
    {
      schema: chatCompletionSchema,
      onRequest: fastify.verify(
        fastify.BearerToken,
      ),
    },
    async (request) => {
      const { prompt } = request.body
      const { data } = await openAIApi.createChatCompletion({
        model: 'gpt-3.5-turbo',
        temperature: 0.5,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      })
      const text = data?.choices?.[0].message?.content

      return {
        text,
      }
    },
  )
}

export default chatCompletion
```

:::tip
Read the [OpenAI API reference on Create chat completion](https://platform.openai.com/docs/api-reference/chat/create?lang=node.js) to learn more.
:::

## Audio

Learn how to turn audio into text.

**Available models**: `whisper-1`

**Related guide**: [Speech to text](https://platform.openai.com/docs/guides/speech-to-text)

### Create transcription

Transcribes audio into the input language.

To work with Create transcription, we use our own OpenAI service with methods `createTranscriptionWithTime` or `openAIApi.createTranscription`.

- `createTranscriptionWithTime` is designed to get the transcription with time for an audio file.

  ```ts title="Internal Type"
  const createTranscriptionWithTime: (audio: File) => Promise<
    {
      start: string
      end: string
      text: string
    }[]
  >
  ```

  ```ts title="Usage example"
  import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
  import { Type } from '@sinclair/typebox'
  import { MultipartFile } from '@/models'
  import { createTranscriptionWithTime } from '@/services/openai'

  export const transcriptionSchema = {
    tags: ['OpenAI Example'],
    summary: 'OpenAI transcription example',
    consumes: ['multipart/form-data'],
    body: Type.Object({
      audio: MultipartFile,
    }),
    response: {
      200: Type.Object({
        transcription: Type.Array(
          Type.Object({
            start: Type.String(),
            end: Type.String(),
            text: Type.String(),
          }),
        ),
      ),
    },
    security: [{ apiKey: [] }] as Security,
  }

  const transcription: FastifyPluginAsyncTypebox = async (fastify) => {
    fastify.post(
      '/transcription',
      {
        schema: transcriptionSchema,
        onRequest: fastify.verify(
          fastify.BearerToken,
        ),
      },
      async (request) => {
        const { audio } = request.body
        const data = await createTranscriptionWithTime(audio)

        return {
          transcription: data,
        }
      },
    )
  }

  export default transcription
  ```

- `openAIApi.createTranscription` is designed to get the transcription in different formats (default json) for an audio file.

  ```ts title="Usage example"
  import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
  import { Type } from '@sinclair/typebox'
  import { MultipartFile } from '@/models'
  import { openAIApi } from '@/services/openai'

  export const transcriptionSchema = {
    tags: ['OpenAI Example'],
    summary: 'OpenAI transcription example',
    consumes: ['multipart/form-data'],
    body: Type.Object({
      audio: MultipartFile,
    }),
    response: {
      200: Type.Object({
        transcription: Type.String(),
      ),
    },
    security: [{ apiKey: [] }] as Security,
  }

  const transcription: FastifyPluginAsyncTypebox = async (fastify) => {
    fastify.post(
      '/transcription',
      {
        schema: transcriptionSchema,
        onRequest: fastify.verify(
          fastify.BearerToken,
        ),
      },
      async (request) => {
        const { audio } = request.body
        const { data } = await await openAIApi.createTranscription(
          audio,
          'whisper-1',
        )

        return {
          transcription: data.text
        }
      },
    )
  }

  export default transcription
  ```

  :::tip
  Read the [OpenAI API reference on Create transcription](https://platform.openai.com/docs/api-reference/audio/create?lang=node.js) to learn more.
  :::

### Create translation

Transcribes audio into the input language.

To work with Create translation, you can use our own OpenAI service with the method `openAIApi.createTranslation`.

```ts title="Usage example"
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { MultipartFile } from '@/models'
import { openAIApi } from '@/services/openai'

export const translationSchema = {
  tags: ['OpenAI Example'],
  summary: 'OpenAI translation example',
  consumes: ['multipart/form-data'],
  body: Type.Object({
    audio: MultipartFile,
  }),
  response: {
    200: Type.Object({
      text: Type.String(),
    ),
  },
  security: [{ apiKey: [] }] as Security,
}

const translation: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post(
    '/translation',
    {
      schema: translationSchema,
      onRequest: fastify.verify(
        fastify.BearerToken,
      ),
    },
    async (request) => {
      const { audio } = request.body
      const { data } = await await openAIApi.createTranslation(
        audio,
        'whisper-1',
      )

      return data
    },
  )
}

export default translation
```

:::tip
We are not currently using Create translation, but you can read the
[OpenAI API reference on Create translation](https://platform.openai.com/docs/api-reference/audio/create?lang=node.js) to learn more.
:::

## Edit

Given a prompt and an instruction, the model will return an edited version of the prompt.

**Available models**:

- `text-davinci-edit-001`
- `code-davinci-edit-001`

### Create edit

Creates a new edit for the provided input, instruction, and parameters.

:::tip
We are not currently using Create edit, but you can use our own OpenAI service to implement this.

**API reference**: [Create edit](https://platform.openai.com/docs/api-reference/edits/create?lang=node.js)
:::

## Images

Given a prompt and/or an input image, the model will generate a new image.

:::tip
We are not currently using Generate images, but you can use our own OpenAI service to implement this.

**Related guide**: [Image generation](https://platform.openai.com/docs/guides/images?lang=node.js)

**API reference**: [Images](https://platform.openai.com/docs/api-reference/images?lang=node.js)
:::

## Embeddings

Get a vector representation of a given input that can be easily consumed by machine learning models and algorithms.

**Available models**:

- `text-embedding-ada-002`
- `text-search-ada-doc-001`

:::tip
We are not currently using Embeddings, but you can use our own OpenAI service to implement this.

**Related guide**: [Embeddings](https://platform.openai.com/docs/guides/embeddings)

**API reference**: [Create embeddings](https://platform.openai.com/docs/api-reference/embeddings/create?lang=node.js)
:::

## Files

Files are used to upload documents that can be used with features like [Fine-tuning](#fine-tunes).

:::tip
We are not currently using Files, but you can use our own OpenAI service to implement this.

**API reference**: [Files](https://platform.openai.com/docs/api-reference/files?lang=node.js)
:::

## Fine-tunes

Manage fine-tuning jobs to tailor a model to your specific training data.

**Available models**:

- `davinci`
- `curie`
- `babbage`
- `ada`

:::tip
We are not currently using Fine-tunes, but you can use our own OpenAI service to implement this.

**Related guide**: [Fine-tune models](https://platform.openai.com/docs/guides/fine-tuning)

**API reference**: [Fine-tunes](https://platform.openai.com/docs/api-reference/fine-tunes/create?lang=node.js)
:::

## Moderations

Given a input text, outputs if the model classifies it as violating OpenAI's content policy.

**Available models**:

- `text-moderation-stable`
- `text-moderation-latest`

:::tip
We are not currently using Moderations, but you can use our own OpenAI service to implement this.

**Related guide**: [Moderations](https://platform.openai.com/docs/guides/moderation)

**API reference**: [Create moderation](https://platform.openai.com/docs/api-reference/moderations/create?lang=node.js)
:::
