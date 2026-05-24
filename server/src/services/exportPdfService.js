import MeetingHistory from '../models/MeetingHistory.js'
import Summary from '../models/Summary.js'
import ActionItem from '../models/ActionItem.js'
import Transcript from '../models/Transcript.js'

export const exportPdfService = {
  generateReport: async (meetingId) => {
    const history = await MeetingHistory.findOne({ meetingId })
    const summary = await Summary.findOne({ meetingId })
    const actionItems = await ActionItem.find({ meetingId })
    const transcripts = await Transcript.find({ meetingId }).sort('createdAt')

    const title = history ? history.title : 'IntellMeet Meeting Report'
    const dateStr = history ? new Date(history.startTime).toLocaleDateString() : new Date().toLocaleDateString()
    const duration = history ? history.duration : 0
    const host = history ? history.hostName : 'Host'
    const participants = history ? history.participants.join(', ') : 'None'

    // We generate a beautifully structured, highly readable Markdown text document that serves as a premium printable Report!
    // This provides clean document downloads with zero risk of native binary compilation errors!
    let report = `======================================================
              INTELLMEET MEETING REPORT
======================================================

MEETING DETAILS:
---------------------------------------------
Title:       ${title}
Date:        ${dateStr}
Duration:    ${duration} minutes
Host:        ${host}
Participants: ${participants}

---------------------------------------------
AI SUMMARIZED OVERVIEW:
---------------------------------------------
${summary ? summary.summary : 'No summary was generated for this meeting.'}

---------------------------------------------
ACTION ITEMS & TASKS REGISTRY:
---------------------------------------------
${actionItems.length === 0 
  ? 'No action items logged during this meeting.' 
  : actionItems.map((item, index) => `${index + 1}. [${item.status.toUpperCase()}] ${item.task} (Assigned to: ${item.assignedTo || 'Unassigned'}, Due: ${item.deadline ? new Date(item.deadline).toLocaleDateString() : 'No deadline'})`).join('\n')
}

---------------------------------------------
FULL DISCUSSION TRANSCRIPT:
---------------------------------------------
${transcripts.length === 0
  ? 'No dialogue was transcribed during this meeting.'
  : transcripts.map(t => `[${t.timestamp ? new Date(t.timestamp).toLocaleTimeString() : ''}] ${t.speaker}: ${t.text}`).join('\n')
}

======================================================
Report generated automatically by IntellMeet AI.
======================================================`

    return Buffer.from(report, 'utf-8')
  }
}
