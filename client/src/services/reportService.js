import axios from 'axios'

export const reportService = {
  downloadPdfReport: async (meetingId, token) => {
    const response = await axios.get(`/api/report/pdf/${meetingId}`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob'
    })
    const blob = new Blob([response.data], { type: 'text/plain' })
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = `Meeting_Report_${meetingId}.txt`
    link.click()
  },

  downloadExcelReport: async (meetingId, token) => {
    const response = await axios.get(`/api/report/excel/${meetingId}`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob'
    })
    const blob = new Blob([response.data], { type: 'text/csv' })
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = `Meeting_Spreadsheet_${meetingId}.csv`
    link.click()
  }
}
