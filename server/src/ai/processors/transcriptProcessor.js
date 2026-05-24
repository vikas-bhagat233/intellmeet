import { transcribeAudio } from '../providers/whisperProvider.js'

export const processTranscript = async (audioBuffer) => {
  if (!audioBuffer) throw new Error('Audio data is required for transcription')
  const text = await transcribeAudio(audioBuffer)
  return text
}
