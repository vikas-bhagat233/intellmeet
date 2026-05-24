import { generateText } from '../providers/huggingfaceProvider.js'
import { summaryPrompt } from '../prompts/summaryPrompt.js'

export const processSummary = async (transcriptText) => {
  if (!transcriptText || transcriptText.trim() === '') {
    throw new Error('Transcript text is required to generate a summary')
  }
  const prompt = summaryPrompt(transcriptText)
  const summary = await generateText(prompt, 'You are a helpful and concise meeting summarizer.')
  return summary
}
