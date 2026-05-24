import { generateText } from '../providers/huggingfaceProvider.js'
import { actionItemPrompt } from '../prompts/actionItemPrompt.js'

export const processActionItems = async (transcriptText) => {
  if (!transcriptText || transcriptText.trim() === '') {
    throw new Error('Transcript text is required to extract action items')
  }
  const prompt = actionItemPrompt(transcriptText)
  const responseText = await generateText(prompt, 'You are a precise task extraction assistant. Return JSON only.')
  
  try {
    // Try to parse the JSON array
    const jsonStart = responseText.indexOf('[')
    const jsonEnd = responseText.lastIndexOf(']') + 1
    if (jsonStart !== -1 && jsonEnd !== -1) {
      const jsonContent = responseText.substring(jsonStart, jsonEnd)
      return JSON.parse(jsonContent)
    }
    return JSON.parse(responseText)
  } catch (error) {
    console.error('⚠️ Failed to parse action items JSON, returning fallback:', error.message)
    return [
      {
        task: "Extract tasks from transcript",
        assignedTo: "Team",
        deadline: null
      }
    ]
  }
}
