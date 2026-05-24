import { generateText as generateHuggingFaceText } from './huggingfaceProvider.js'

export const generateText = async (prompt, systemPrompt = '') => {
  console.log('🔄 OpenAI provider proxying request to Hugging Face as per configuration...')
  return generateHuggingFaceText(prompt, systemPrompt)
}
