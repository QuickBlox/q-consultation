import { ChatCompletionRequestMessage } from 'openai'

import openAIApi from './api'
import { completeSentence } from './utils'

export const createTranscriptionWithTime = async (audio: File) => {
  const resp = await openAIApi.createTranscription(
    audio,
    'whisper-1',
    '',
    'srt',
  )
  const transcriptionText = resp.data as unknown as string
  const srtRegex = /^([\d:]+),\d+ --> ([\d:]+),\d+\s+(.*)$/gm

  return Array.from(transcriptionText.matchAll(srtRegex)).reduce<
    Array<{ start: string; end: string; text: string }>
  >((res, item) => {
    const [, start, end, text] = item

    return [...res, { start, end, text }]
  }, [])
}

export const createAudioDialogAnalytics = async (audio: File) => {
  const transcription = await createTranscriptionWithTime(audio)
  const transcriptionText = transcription.map(({ text }) => text).join(' ')
  const chatComplationConfig = {
    model: 'gpt-3.5-turbo',
    temperature: 0,
  }
  const messagesForSummary: ChatCompletionRequestMessage[] = [
    {
      role: 'user',
      content: 'Generate summary in English from this dialog',
    },
    { role: 'user', content: transcriptionText },
  ]
  const messagesForActions: ChatCompletionRequestMessage[] = [
    {
      role: 'system',
      content:
        'If you don\'t have enough information to make an action points, display the message "There is no sufficient information to generate an action points"',
    },
    {
      role: 'user',
      content: `Generate action points in English that the consultant said to do from my dialog. Display only list without title.`,
    },
    { role: 'user', content: `My dialog:\n${transcriptionText}` },
  ]
  const textRegex = /[\p{L}\p{N}]+/gu

  const [summaryRes, actionsRes] = textRegex.test(transcriptionText)
    ? await Promise.all([
        openAIApi.createChatCompletion({
          messages: messagesForSummary,
          ...chatComplationConfig,
        }),
        openAIApi.createChatCompletion({
          messages: messagesForActions,
          ...chatComplationConfig,
        }),
      ])
    : []
  const summary =
    summaryRes?.data?.choices?.[0].message?.content ||
    'There is no sufficient information to generate a summary'
  const actions =
    actionsRes?.data?.choices?.[0].message?.content ||
    'There is no sufficient information to generate an action points'

  return {
    transcription,
    summary,
    actions,
  }
}

export const createQuickAnswerForText = async (text: string) => {
  const messages: ChatCompletionRequestMessage[] = [
    { role: 'system', content: 'You are consulting the user.' },
    { role: 'user', content: text },
  ]
  const { data } = await openAIApi.createChatCompletion({
    messages,
    model: 'gpt-3.5-turbo',
    max_tokens: 512,
    temperature: 0.5,
  })

  return completeSentence(data.choices[0]?.message?.content)
}

export const createQuickAnswerForDialog = async (
  dialogDescription: string,
  dialogMessages: ChatCompletionRequestMessage[],
) => {
  const messages: ChatCompletionRequestMessage[] = [
    {
      role: 'system',
      content: `You are consulting the user. You were approached with an issue: "${dialogDescription}".`,
    },
    ...dialogMessages,
  ]
  const { data } = await openAIApi.createChatCompletion({
    messages,
    model: 'gpt-3.5-turbo',
    temperature: 0.5,
  })

  return completeSentence(data.choices[0]?.message?.content)
}

export const createProviderKeywords = async (description: string) => {
  const prompt = `Write in English keywords describing a specialist for this description separated by commas:\n${description.replaceAll(
    '\n',
    ' ',
  )}\n\n`
  const { data } = await openAIApi.createCompletion({
    prompt,
    model: 'text-davinci-003',
    temperature: 0,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  })

  return data.choices[0]?.text?.trim() || ''
}

export const findProviderIdsByKeywords = async (
  usersKeywords: string,
  topic: string,
) => {
  const messages: ChatCompletionRequestMessage[] = [
    {
      role: 'system',
      content:
        'You are a receptionist. You have a list of consultants in the format: "id: keywords"\n' +
        `${usersKeywords}\n` +
        'Keywords describe the consultant. User input issue. Select consultants for the user. If there are no suitable consultants, do not display all.',
    },
    { role: 'user', content: topic },
    {
      role: 'user',
      content:
        'Display only list of the id of suitable consultants without explanation of reasons.',
    },
  ]
  const { data } = await openAIApi.createChatCompletion({
    messages,
    model: 'gpt-3.5-turbo',
    temperature: 0,
    top_p: 1,
  })

  const providerIds: string[] | null | undefined =
    data?.choices?.[0]?.message?.content?.match(/\d+/g)

  return providerIds
}
