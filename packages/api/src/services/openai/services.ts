import { getChatCompletion, getTranscription } from './base'

export const getAudioInfo = async (fileName: string, audioFile: Buffer) => {
  const transcription = await getTranscription(fileName, audioFile)
  const transcriptionText = transcription
    .reduce((res, { text }) => `${res}${text} `, '')
    .trimEnd()

  const [summary = '', actions = ''] = /[\p{L}\p{N}]+/gu.test(transcriptionText)
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
              content:
                'If you don\'t have enough information to make an action points, display the message "There is no sufficient information to generate an action points"',
            },
            {
              role: 'user',
              content: `Generate action points that the consultant said to do from my dialog. Display only list without title.`,
            },
            { role: 'user', content: `My dialog:\n${transcriptionText}` },
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
