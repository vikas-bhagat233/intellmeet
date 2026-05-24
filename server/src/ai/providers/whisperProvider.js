import axios from 'axios'

export const transcribeAudio = async (audioBuffer) => {
  const token = process.env.HF_API_KEY || ''
  const model = process.env.HF_WHISPER_MODEL || 'openai/whisper-large-v3'

  if (!token) {
    console.warn('⚠️ HF_API_KEY is not defined. Falling back to simulated speech-to-text.')
    return simulateTranscription()
  }

  try {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      audioBuffer,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'audio/wav'
        }
      }
    )
    return response.data?.text || ''
  } catch (error) {
    console.error('❌ Whisper transcription API error:', error.message)
    return simulateTranscription()
  }
}

function simulateTranscription() {
  const transcripts = [
    "Hello everyone, let's start the meeting. Today we are discussing our WebRTC direct media deployment and user interface styling.",
    "Yes, I think we should adopt a serverless direct mode video room to eliminate all external dependency issues.",
    "Also, we discovered a text contrast issue in our participant card where names were white on a white background. I added color: var(--ink) to the css which completely fixed the accessibility issues.",
    "That is perfect. Let's make sure our AI features like summaries, action items, and decision logs are fully integrated by tomorrow."
  ]
  const randomIndex = Math.floor(Math.random() * transcripts.length)
  return transcripts[randomIndex]
}
