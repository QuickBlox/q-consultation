import { getCompletion, getTranscription } from './base'

export const getAudioInfo = async (fileName: string, audioFile: Buffer) => {
  const transcription = await getTranscription(fileName, audioFile)

  const summary =
    transcription &&
    (await getCompletion(
      `Convert this shorthand into a first-hand account of the meeting:\n\n${transcription}\n`,
    ))

  const notes =
    summary && (await getCompletion(`Convert meeting notes:\n\n${summary}\n`))

  const actions =
    notes &&
    (await getCompletion(`Create actions after the meeting:\n\n${notes}\n`))

  return {
    transcription,
    summary,
    notes,
    actions,
  }
}
