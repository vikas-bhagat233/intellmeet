import { generateText } from '../providers/huggingfaceProvider.js'
import { decisionPrompt } from '../prompts/decisionPrompt.js'

export const processDecisions = async (transcriptText) => {
  if (!transcriptText || transcriptText.trim() === '') {
    throw new Error('Transcript text is required to extract decisions')
  }
  const prompt = decisionPrompt(transcriptText)
  const responseText = await generateText(prompt, 'You are a precise meeting insights assistant. Return JSON only.')

  try {
    const jsonStart = responseText.indexOf('{')
    const jsonEnd = responseText.lastIndexOf('}') + 1
    if (jsonStart !== -1 && jsonEnd !== -1) {
      const jsonContent = responseText.substring(jsonStart, jsonEnd)
      return JSON.parse(jsonContent)
    }
    return JSON.parse(responseText)
  } catch (error) {
    console.error('⚠️ Failed to parse decisions JSON, returning fallback:', error.message)
    return {
      decisions: ["Review meeting minutes"],
      keywords: ["meeting", "minutes"],
      sentiment: "Neutral"
    }
  }
}
