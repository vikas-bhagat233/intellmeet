import { processTranscript } from './processors/transcriptProcessor.js'
import { processSummary } from './processors/summaryProcessor.js'
import { processActionItems } from './processors/actionItemProcessor.js'
import { processDecisions } from './processors/decisionProcessor.js'

export const aiManager = {
  transcribe: async (audioBuffer) => {
    return processTranscript(audioBuffer)
  },

  generateSummary: async (transcriptText) => {
    return processSummary(transcriptText)
  },

  extractActionItems: async (transcriptText) => {
    return processActionItems(transcriptText)
  },

  extractDecisions: async (transcriptText) => {
    return processDecisions(transcriptText)
  }
}
