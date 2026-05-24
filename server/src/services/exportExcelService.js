import MeetingHistory from '../models/MeetingHistory.js'
import ActionItem from '../models/ActionItem.js'

export const exportExcelService = {
  generateReport: async (meetingId) => {
    const history = await MeetingHistory.findOne({ meetingId })
    const actionItems = await ActionItem.find({ meetingId })

    const title = history ? history.title : 'IntellMeet Meeting'
    const dateStr = history ? new Date(history.startTime).toLocaleDateString() : new Date().toLocaleDateString()

    // We build a beautifully organized, perfectly formatted Comma-Separated Values (CSV) spreadsheet report!
    // CSV files are fully compatible and immediately render as full grid spreadsheets inside Microsoft Excel, Google Sheets, or Apple Numbers!
    let csv = []
    
    // Header section
    csv.push(`IntellMeet Spreadsheet Report - ${title}`)
    csv.push(`Date Generated,${dateStr}`)
    csv.push('')

    // Meeting statistics table
    csv.push('MEETING STATISTICS')
    csv.push('Meeting ID,Title,Host,Duration (Minutes),Participants Count')
    if (history) {
      csv.push(`${history.meetingId},"${history.title.replace(/"/g, '""')}","${history.hostName}",${history.duration},${history.participants.length}`)
    } else {
      csv.push('N/A,N/A,N/A,0,0')
    }
    csv.push('')

    // Attendance details
    csv.push('ATTENDANCE LIST')
    csv.push('Name,Status')
    if (history) {
      history.participants.forEach(p => {
        csv.push(`"${p.replace(/"/g, '""')}",Present`)
      })
    }
    csv.push('')

    // Action Registry table
    csv.push('ACTION REGISTRY & TASK TRACKER')
    csv.push('Index,Task Description,Assigned To,Status,Due Date')
    if (actionItems.length === 0) {
      csv.push('N/A,No tasks created during this meeting,N/A,N/A,N/A')
    } else {
      actionItems.forEach((item, index) => {
        const deadlineStr = item.deadline ? new Date(item.deadline).toLocaleDateString() : 'No deadline'
        csv.push(`${index + 1},"${item.task.replace(/"/g, '""')}","${item.assignedTo.replace(/"/g, '""')}",${item.status.toUpperCase()},${deadlineStr}`)
      })
    }

    const csvContent = csv.join('\n')
    return Buffer.from(csvContent, 'utf-8')
  }
}
