import { getChatCompletion, getTranscription } from './base'

export const getAudioInfo = async (fileName: string, audioFile: Buffer) => {
  const transcription = await getTranscription(fileName, audioFile)
  const transcriptionText = transcription.reduce(
    (res, { text }) => `${res}${text} `,
    '',
  )

  const [summary = '', actions = ''] = /[\p{L}\p{N}]+/gu.test(
    'Hello! How are you?',
  )
    ? await Promise.all([
        getChatCompletion(
          [
            { role: 'user', content: 'Generate summary from this dialog' },
            { role: 'user', content: transcriptionText },
          ],
          { temperature: 0 },
        ),
        getChatCompletion(
          [
            {
              role: 'system',
              content: 'You can only generate text.',
            },
            {
              role: 'user',
              content: `Generate action points that the consultant said to do of the following passage:\n${transcriptionText}`,
            },
          ],
          { temperature: 0 },
        ),
      ])
    : []

  return {
    transcription,
    summary,
    actions,
  }
}
