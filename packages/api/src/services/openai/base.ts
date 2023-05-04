import {
  Configuration,
  OpenAIApi,
  CreateCompletionRequest,
  CreateChatCompletionRequest,
  ChatCompletionRequestMessage,
} from 'openai'
import { BASE_PATH } from 'openai/dist/base'
import fetch from 'node-fetch'
import FormData from 'form-data'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

type CompletionConfig = Omit<CreateCompletionRequest, 'prompt'>
type ChatCompletionConfig = Omit<CreateChatCompletionRequest, 'messages'>

const baseCompletionConfig: CompletionConfig = {
  model: 'text-davinci-003',
  temperature: 0,
  max_tokens: 256,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
}

const baseChatCompletionConfig: ChatCompletionConfig = {
  model: 'gpt-3.5-turbo',
}

export const createChatMessage = (
  role: ChatCompletionRequestMessage['role'],
  content: ChatCompletionRequestMessage['content'],
): ChatCompletionRequestMessage => ({ role, content })

export const getTranscription = async (fileName: string, audioFile: Buffer) => {
  const { Authorization }: Record<string, string> =
    configuration.baseOptions.headers

  const form = new FormData()

  form.append('file', audioFile, fileName)
  form.append('model', 'whisper-1')
  form.append('response_format', 'srt')

  const srtText = await fetch(`${BASE_PATH}/audio/transcriptions`, {
    method: 'POST',
    headers: { Authorization },
    body: form,
  }).then((res) => res.text())

  const data = Array.from(
    srtText.matchAll(/^([\d:]+),\d+ --> ([\d:]+),\d+\s+(.*)$/gm),
  ).reduce<Array<{ start: string; end: string; text: string }>>((res, item) => {
    const [, start, end, text] = item

    return [...res, { start, end, text }]
  }, [])

  return data
}

const completeSentence = (text?: string) =>
  text?.replace(/([^.!?;]+)[^.!?;]*$/, ' ...') || ''

export const getCompletion = async (
  prompt: string,
  config: Partial<CompletionConfig> = {},
  isCompleteSentence = false,
) => {
  const res = await openai.createCompletion({
    ...baseCompletionConfig,
    ...config,
    prompt,
  })

  return isCompleteSentence
    ? completeSentence(res.data.choices[0].text)
    : res.data.choices[0].text?.trim() || ''
}

export const getChatCompletion = async (
  messages: ChatCompletionRequestMessage[],
  config: Partial<ChatCompletionConfig> = {},
  isCompleteSentence = false,
) => {
  const res = await openai.createChatCompletion({
    ...baseChatCompletionConfig,
    ...config,
    messages,
  })

  return isCompleteSentence
    ? completeSentence(res.data.choices[0].message?.content)
    : res.data.choices[0].message?.content.trim() || ''
}
