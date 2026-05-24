import { aiManager } from '../ai/aiManager.js'
import { transcriptService } from '../services/transcriptService.js'
import { summaryService } from '../services/summaryService.js'
import { actionItemService } from '../services/actionItemService.js'
import { meetingInsightService } from '../services/meetingInsightService.js'
import { successResponse, errorResponse } from '../utils/response.js'

export const transcribeAudioController = async (req, res, next) => {
  try {
    const { meetingId, speaker, audioBase64, timestamp } = req.body
    
    if (!meetingId) {
      return errorResponse(res, 'meetingId is required', 400)
    }

    let audioBuffer
    if (audioBase64) {
      audioBuffer = Buffer.from(audioBase64, 'base64')
    } else if (req.file) {
      audioBuffer = req.file.buffer
    } else {
      // If no audio is uploaded, we'll fall back to simulating audio input
      audioBuffer = Buffer.from('mock-audio-data')
    }

    const transcribedText = await aiManager.transcribe(audioBuffer)
    
    // Save to database
    const segment = await transcriptService.saveTranscriptSegment(
      meetingId,
      speaker || req.user?.name || 'Speaker',
      transcribedText,
      timestamp || new Date().toISOString()
    )

    return successResponse(res, { segment }, 'Audio transcribed and saved successfully', 201)
  } catch (error) {
    next(error)
  }
}

export const generateSummaryController = async (req, res, next) => {
  try {
    const { meetingId } = req.body

    if (!meetingId) {
      return errorResponse(res, 'meetingId is required', 400)
    }

    // Retrieve all transcripts for this meeting
    const transcripts = await transcriptService.getTranscriptByMeetingId(meetingId)
    if (!transcripts || transcripts.length === 0) {
      return errorResponse(res, 'No transcripts found for this meeting to summarize. Please transcribe some speech first.', 404)
    }

    // Combine transcripts into a single text block
    const fullText = transcripts.map(t => `${t.speaker}: ${t.text}`).join('\n')

    // Generate summary
    const summaryText = await aiManager.generateSummary(fullText)
    const summary = await summaryService.saveSummary(meetingId, summaryText)

    return successResponse(res, { summary }, 'Summary generated successfully', 200)
  } catch (error) {
    next(error)
  }
}

export const extractActionItemsController = async (req, res, next) => {
  try {
    const { meetingId } = req.body

    if (!meetingId) {
      return errorResponse(res, 'meetingId is required', 400)
    }

    const transcripts = await transcriptService.getTranscriptByMeetingId(meetingId)
    if (!transcripts || transcripts.length === 0) {
      return errorResponse(res, 'No transcripts found for this meeting to extract action items.', 404)
    }

    const fullText = transcripts.map(t => `${t.speaker}: ${t.text}`).join('\n')

    const actionItemsList = await aiManager.extractActionItems(fullText)
    const actionItems = await actionItemService.saveActionItems(meetingId, actionItemsList)

    return successResponse(res, { actionItems }, 'Action items extracted successfully', 200)
  } catch (error) {
    next(error)
  }
}

export const getMeetingInsightsController = async (req, res, next) => {
  try {
    const { meetingId } = req.params

    if (!meetingId) {
      return errorResponse(res, 'meetingId is required', 400)
    }

    // Get transcripts
    const transcripts = await transcriptService.getTranscriptByMeetingId(meetingId)

    // Fetch existing records from database
    let summary = await summaryService.getSummaryByMeetingId(meetingId)
    let actionItems = await actionItemService.getActionItemsByMeetingId(meetingId)
    let insights = await meetingInsightService.getInsightsByMeetingId(meetingId)

    // If transcripts exist but summaries or insights don't, we can auto-generate them for the user!
    if (transcripts && transcripts.length > 0) {
      const fullText = transcripts.map(t => `${t.speaker}: ${t.text}`).join('\n')

      if (!summary) {
        const summaryText = await aiManager.generateSummary(fullText)
        summary = await summaryService.saveSummary(meetingId, summaryText)
      }

      if (!actionItems || actionItems.length === 0) {
        const actionItemsList = await aiManager.extractActionItems(fullText)
        actionItems = await actionItemService.saveActionItems(meetingId, actionItemsList)
      }

      if (!insights) {
        const parsedInsights = await aiManager.extractDecisions(fullText)
        insights = await meetingInsightService.saveInsights(meetingId, parsedInsights)
      }
    }

    return successResponse(
      res,
      {
        summary: summary || null,
        actionItems: actionItems || [],
        decisions: insights?.decisions || [],
        keywords: insights?.keywords || [],
        sentiment: insights?.sentiment || 'Neutral',
        transcripts: transcripts || []
      },
      'Meeting insights retrieved successfully',
      200
    )
  } catch (error) {
    next(error)
  }
}
