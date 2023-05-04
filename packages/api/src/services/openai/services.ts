import { getCompletion, getTranscription } from './base'

export const getAudioInfo = async (fileName: string, audioFile: Buffer) => {
  const transcription = await getTranscription(fileName, audioFile)
  const transcriptionText = transcription.reduce(
    (res, { text }) => `${res}${text} `,
    '',
  )

  const [summary, actions] = await Promise.all([
    getCompletion(`Generate summary from this dialog:\n${transcriptionText}\n`),
    getCompletion(
      `Generate action points that the consultant said to do from this dialog:\n` +
        `${transcriptionText}\n\n` +
        'Action Points:\n',
    ),
  ])

  return {
    transcription,
    summary,
    actions,
  }
}
