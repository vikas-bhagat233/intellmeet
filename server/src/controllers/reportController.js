import { exportPdfService } from '../services/exportPdfService.js'
import { exportExcelService } from '../services/exportExcelService.js'

export const exportPdfController = async (req, res, next) => {
  try {
    const { meetingId } = req.params
    const buffer = await exportPdfService.generateReport(meetingId)

    res.setHeader('Content-Type', 'text/plain') // Exported as standard printable text document report
    res.setHeader('Content-Disposition', `attachment; filename=Meeting_Report_${meetingId}.txt`)
    return res.send(buffer)
  } catch (error) {
    next(error)
  }
}

export const exportExcelController = async (req, res, next) => {
  try {
    const { meetingId } = req.params
    const buffer = await exportExcelService.generateReport(meetingId)

    res.setHeader('Content-Type', 'text/csv') // Exported as standard Comma Separated Values spreadsheet
    res.setHeader('Content-Disposition', `attachment; filename=Meeting_Spreadsheet_${meetingId}.csv`)
    return res.send(buffer)
  } catch (error) {
    next(error)
  }
}
