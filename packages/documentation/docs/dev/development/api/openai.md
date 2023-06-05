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

To work with Create completion, we use our own service `getCompletion`.
It is designed to receive 1 non-stream completion.

```ts title="Internal Type"
const getCompletion: (
  prompt: string,
  config?: Partial<CompletionConfig>,
  isCompleteSentence?: boolean,
) => Promise<string>
```

- `prompt`: The prompt to generate completions for encoded as a string.
- `config`: All other options for Create completion except `n` and `stream`.

  ```json title="Default config"
  {
    "model": "text-davinci-003",
    "temperature": 0,
    "max_tokens": 256,
    "top_p": 1,
    "frequency_penalty": 0,
    "presence_penalty": 0
  }
  ```

- `isCompleteSentence`: Ends a "..." sentence if it was not completed due to `max_tokens`.

```ts title="Usage example"
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { getCompletion } from '@/services/openai'

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
      const text = await getCompletion(
        prompt,
        {
          temperature: 0.5,
          max_tokens: 512,
        }
      )

      return {
        text,
      }
    },
  )
}

export default completion
```

:::tip
If you need more options for setting up Create completion, you can use the [OpenAI Library](https://www.npmjs.com/package/openai).

**API reference**: [Create completion](https://platform.openai.com/docs/api-reference/completions/create?lang=node.js)
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

To work with Create completion, we use our own service `getChatCompletion`.
It is designed to receive 1 non-stream completion.

```ts title="Internal Type"
const getChatCompletion: (
  messages: ChatCompletionRequestMessage[],
  config?: Partial<ChatCompletionConfig>,
  isCompleteSentence?: boolean,
) => Promise<string>
```

- `messages`: A list of messages describing the conversation so far.
- `config`: All other options for Create completion except `n` and `stream`.

  ```json title="Default config"
  {
    "model": "gpt-3.5-turbo"
  }
  ```

- `isCompleteSentence`: Ends a "..." sentence if it was not completed due to `max_tokens`.

```ts title="Usage example"
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { getChatCompletion } from '@/services/openai'

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
      const text = await getChatCompletion(
        [
          {
              role: 'system',
              content: 'You are a helpful assistant.',
            },
            {
              role: 'user',
              content: prompt,
            },
        ],
        {
          temperature: 0.5,
        }
      )

      return {
        text,
      }
    },
  )
}

export default chatCompletion
```

:::tip
If you need more options for setting up Create chat completion, you can use the [OpenAI Library](https://www.npmjs.com/package/openai).

**API reference**: [Create chat completion](https://platform.openai.com/docs/api-reference/chat/create?lang=node.js)
:::

## Audio

Learn how to turn audio into text.

**Available models**: `whisper-1`

**Related guide**: [Speech to text](https://platform.openai.com/docs/guides/speech-to-text)

### Create transcription

Transcribes audio into the input language.

To work with Create transcription, we use our own service `getTranscription`.
It is designed to get the transcription with time for an audio file.

```ts title="Internal Type"
const getTranscription: (
  fileName: string,
  audioFile: Buffer,
) => Promise<
  {
    start: string
    end: string
    text: string
  }[]
>
```

- `fileName`: Audio filename.
- `audioFile`: File Buffer.

```ts title="Usage example"
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { MultipartFile } from '@/models'
import { getTranscription } from '@/services/openai'

export const transcriptionSchema = {
  tags: ['OpenAI Example'],
  summary: 'OpenAI transcription example',
  consumes: ['multipart/form-data'],
  body: Type.Object({
    file: MultipartFile,
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
      const { file } = request.body
      const transcription = await getTranscription(request.body.file.filename, file.buffer)

      return {
        transcription,
      }
    },
  )
}

export default transcription
```

:::tip
If you need more options for setting up Create transcription, you can use the [OpenAI Library](https://www.npmjs.com/package/openai).

**API reference**: [Create transcription](https://platform.openai.com/docs/api-reference/audio/create?lang=node.js)
:::

:::caution
[OpenAI Library](https://www.npmjs.com/package/openai) can only accept files in `ReadStream`.

Therefore, if you need to send a file received via fastify (files in `Buffer`) to OpenAI, use the **OpenAI API** to send it.
:::

```ts title="Example of using OpenAI API"
import { Configuration, OpenAIApi } from 'openai'
import { BASE_PATH } from 'openai/dist/base'
import fetch from 'node-fetch'
import FormData from 'form-data'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

export const getTranscriptionText = async (
  fileName: string,
  audioFile: Buffer,
) => {
  const { Authorization }: Record<string, string> =
    configuration.baseOptions.headers

  const form = new FormData()

  form.append('file', audioFile, fileName)
  form.append('model', 'whisper-1')

  const res = await fetch(`${BASE_PATH}/audio/transcriptions`, {
    method: 'POST',
    headers: { Authorization },
    body: form,
  }).then((res) => res.json())

  return res.text
}
```

### Create translation

Transcribes audio into the input language.

:::tip
We are not currently using Create translation, but you can use the [OpenAI Library](https://www.npmjs.com/package/openai) to implement this.

**API reference**: [Create translation](https://platform.openai.com/docs/api-reference/audio/create?lang=node.js)
:::

:::caution
[OpenAI Library](https://www.npmjs.com/package/openai) can only accept files in `ReadStream`.

Therefore, if you need to send a file received via fastify (files in `Buffer`) to OpenAI, use the **OpenAI API** to send it.
:::

```ts title="Example of using OpenAI API"
import { Configuration, OpenAIApi } from 'openai'
import { BASE_PATH } from 'openai/dist/base'
import fetch from 'node-fetch'
import FormData from 'form-data'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

export const getTranslationText = async (
  fileName: string,
  audioFile: Buffer,
) => {
  const { Authorization }: Record<string, string> =
    configuration.baseOptions.headers

  const form = new FormData()

  form.append('file', audioFile, fileName)
  form.append('model', 'whisper-1')

  const res = await fetch(`${BASE_PATH}/audio/translations`, {
    method: 'POST',
    headers: { Authorization },
    body: form,
  }).then((res) => res.json())

  return res.text
}
```

## Edit

Given a prompt and an instruction, the model will return an edited version of the prompt.

**Available models**:

- `text-davinci-edit-001`
- `code-davinci-edit-001`

### Create edit

Creates a new edit for the provided input, instruction, and parameters.

:::tip
We are not currently using Create edit, but you can use the [OpenAI Library](https://www.npmjs.com/package/openai) to implement this.

**API reference**: [Create edit](https://platform.openai.com/docs/api-reference/edits/create?lang=node.js)
:::

## Images

Given a prompt and/or an input image, the model will generate a new image.

:::tip
We are not currently using Generate images, but you can use the [OpenAI Library](https://www.npmjs.com/package/openai) to implement this.

**Related guide**: [Image generation](https://platform.openai.com/docs/guides/images?lang=node.js)

**API reference**: [Images](https://platform.openai.com/docs/api-reference/images?lang=node.js)
:::

## Embeddings

Get a vector representation of a given input that can be easily consumed by machine learning models and algorithms.

**Available models**:

- `text-embedding-ada-002`
- `text-search-ada-doc-001`

:::tip
We are not currently using Embeddings, but you can use the [OpenAI Library](https://www.npmjs.com/package/openai) to implement this.

**Related guide**: [Embeddings](https://platform.openai.com/docs/guides/embeddings)

**API reference**: [Create embeddings](https://platform.openai.com/docs/api-reference/embeddings/create?lang=node.js)
:::

## Files

Files are used to upload documents that can be used with features like [Fine-tuning](#fine-tunes).

:::tip
We are not currently using Files, but you can use the [OpenAI Library](https://www.npmjs.com/package/openai) to implement this.

**API reference**: [Files](https://platform.openai.com/docs/api-reference/files)
:::

## Fine-tunes

Manage fine-tuning jobs to tailor a model to your specific training data.

**Available models**:

- `davinci`
- `curie`
- `babbage`
- `ada`

:::tip
We are not currently using Fine-tunes, but you can use the [OpenAI Library](https://www.npmjs.com/package/openai) to implement this.

**Related guide**: [Fine-tune models](https://platform.openai.com/docs/guides/fine-tuning)

**API reference**: [Fine-tunes](https://platform.openai.com/docs/api-reference/fine-tunes/create?lang=node.js)
:::

## Moderations

Given a input text, outputs if the model classifies it as violating OpenAI's content policy.

**Available models**:

- `text-moderation-stable`
- `text-moderation-latest`

:::tip
We are not currently using Moderations, but you can use the [OpenAI Library](https://www.npmjs.com/package/openai) to implement this.

**Related guide**: [Moderations](https://platform.openai.com/docs/guides/moderation)

**API reference**: [Create moderation](https://platform.openai.com/docs/api-reference/moderations/create?lang=node.js)
:::
