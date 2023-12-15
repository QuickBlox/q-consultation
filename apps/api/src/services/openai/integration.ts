import { toFile } from 'openai/uploads'
import { ChatCompletionMessageParam } from 'openai/resources/chat'
import { QBAIRephrase, Tone } from 'qb-ai-rephrase'
import { QBAITranslate } from 'qb-ai-translate'

import openAIApi from './api'
import { completeSentence } from './utils'

export const createTranscriptionWithTime = async (audio: MultipartFile) => {
  const file = await toFile(audio.buffer, audio.filename, {
    type: audio.mimetype,
  })
  const transcription = await openAIApi.audio.transcriptions.create({
    file,
    model: 'whisper-1',
    response_format: 'srt',
  })
  const transcriptionText = transcription as unknown as string
  const srtRegex = /^([\d:]+),\d+ --> ([\d:]+),\d+\s+(.*)$/gm

  return Array.from(transcriptionText.matchAll(srtRegex)).reduce<
    Array<{ start: string; end: string; text: string }>
  >((res, item) => {
    const [, start, end, text] = item

    return [...res, { start, end, text }]
  }, [])
}

export const createAudioDialogAnalytics = async (audio: MultipartFile) => {
  const transcription = await createTranscriptionWithTime(audio)
  const transcriptionText = transcription.map(({ text }) => text).join(' ')
  const chatComplationConfig = {
    model: 'gpt-3.5-turbo',
    temperature: 0,
  }
  const messagesForSummary: ChatCompletionMessageParam[] = [
    {
      role: 'user',
      content: 'Generate summary in English from this dialog',
    },
    { role: 'user', content: transcriptionText },
  ]
  const messagesForActions: ChatCompletionMessageParam[] = [
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
        openAIApi.chat.completions.create({
          messages: messagesForSummary,
          ...chatComplationConfig,
        }),
        openAIApi.chat.completions.create({
          messages: messagesForActions,
          ...chatComplationConfig,
        }),
      ])
    : []
  const summary =
    summaryRes?.choices?.[0].message?.content ||
    'There is no sufficient information to generate a summary'
  const actions =
    actionsRes?.choices?.[0].message?.content ||
    'There is no sufficient information to generate an action points'

  return {
    transcription,
    summary,
    actions,
  }
}

export const createQuickAnswerForDialog = async (
  profession: string,
  dialogDescription: string,
  dialogMessages: ChatCompletionMessageParam[],
) => {
  const messages: ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: `You are a specialist ${profession}. You are consulting the client. You were approached with an issue: "${dialogDescription}".`,
    },
    ...dialogMessages,
  ]
  const { choices } = await openAIApi.chat.completions.create({
    messages,
    model: 'gpt-3.5-turbo',
    temperature: 0.5,
  })

  return completeSentence(choices[0]?.message?.content)
}

export const createProviderKeywords = async (
  profession: string,
  description: string,
) => {
  const parsedDescription = description.replaceAll('\n', ' ')
  const prompt =
    `You are a specialist ${profession} with a description: "${parsedDescription}"\n` +
    'Generate keywords in English by description that will allow customers to search for specialists in the description of the issue, separated by commas.\n\n'
  // TODO: Replace with openAIApi.chat.completions.create
  const { choices } = await openAIApi.completions.create({
    prompt,
    model: 'text-davinci-003',
    temperature: 0,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  })

  return choices[0]?.text?.trim() || ''
}

export const findProviderIdsByKeywords = async (
  usersKeywords: string,
  topic: string,
) => {
  const messages: ChatCompletionMessageParam[] = [
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
  const { choices } = await openAIApi.chat.completions.create({
    messages,
    model: 'gpt-3.5-turbo',
    temperature: 0,
    top_p: 1,
  })

  const providerIds: string[] | null | undefined =
    choices?.[0]?.message?.content?.match(/\d+/g)

  return providerIds
}

export const createRephraseForDialog = async (
  text: string,
  tone: Tone,
  dialogMessages: Array<{ role: 'me' | 'other'; content: string }>,
) => {
  const settings = QBAIRephrase.createDefaultAIRephraseSettings()

  settings.apiKey = openAIApi.apiKey
  settings.tone = tone

  const rephrasedText = await QBAIRephrase.rephrase(
    text,
    dialogMessages,
    settings,
  )

  return rephrasedText
}

export const createTranslate = async (
  text: string,
  dialogMessages: Array<{ role: 'user' | 'assistant'; content: string }>,
  language: string,
) => {
  const settings = QBAITranslate.createDefaultAITranslateSettings()

  settings.apiKey = openAIApi.apiKey
  settings.language = language || 'English'

  const translatedText = await QBAITranslate.translate(
    text,
    dialogMessages,
    settings,
  )

  return translatedText
}
