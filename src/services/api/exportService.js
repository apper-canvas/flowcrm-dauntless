import * as XLSX from 'xlsx'
import { format } from 'date-fns'

class ExportService {
  async exportContactsCSV(contacts) {
    await this.delay()
    
    const csvData = contacts.map(contact => ({
      'ID': contact.Id,
      'Name': contact.name,
      'Email': contact.email,
      'Phone': contact.phone || '',
      'Company': contact.company || '',
      'Status': contact.status,
      'Created Date': format(new Date(contact.createdAt), 'yyyy-MM-dd'),
      'Notes': contact.notes || ''
    }))

    const csv = this.convertToCSV(csvData)
    this.downloadFile(csv, `contacts-export-${format(new Date(), 'yyyy-MM-dd')}.csv`, 'text/csv')
  }

  async exportContactsExcel(contacts) {
    await this.delay()
    
    const excelData = contacts.map(contact => ({
      'ID': contact.Id,
      'Name': contact.name,
      'Email': contact.email,
      'Phone': contact.phone || '',
      'Company': contact.company || '',
      'Status': contact.status,
      'Created Date': new Date(contact.createdAt),
      'Notes': contact.notes || ''
    }))

    const worksheet = XLSX.utils.json_to_sheet(excelData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Contacts')
    
    // Auto-size columns
    const range = XLSX.utils.decode_range(worksheet['!ref'])
    const colWidths = []
    for (let C = range.s.c; C <= range.e.c; ++C) {
      let maxWidth = 10
      for (let R = range.s.r; R <= range.e.r; ++R) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C })
        const cell = worksheet[cellAddress]
        if (cell && cell.v) {
          maxWidth = Math.max(maxWidth, String(cell.v).length)
        }
      }
      colWidths.push({ width: Math.min(maxWidth + 2, 50) })
    }
    worksheet['!cols'] = colWidths

    XLSX.writeFile(workbook, `contacts-export-${format(new Date(), 'yyyy-MM-dd')}.xlsx`)
  }

  async exportDealsCSV(deals, contacts = []) {
    await this.delay()
    
    const csvData = deals.map(deal => ({
      'ID': deal.Id,
      'Title': deal.title,
      'Value': deal.value || 0,
      'Stage': deal.stage,
      'Probability': `${deal.probability || 0}%`,
      'Contact': this.getContactName(deal.contactId, contacts),
      'Expected Close': deal.expectedClose ? format(new Date(deal.expectedClose), 'yyyy-MM-dd') : '',
      'Created Date': format(new Date(deal.createdAt), 'yyyy-MM-dd'),
      'Description': deal.description || ''
    }))

    const csv = this.convertToCSV(csvData)
    this.downloadFile(csv, `deals-export-${format(new Date(), 'yyyy-MM-dd')}.csv`, 'text/csv')
  }

  async exportDealsExcel(deals, contacts = []) {
    await this.delay()
    
    const excelData = deals.map(deal => ({
      'ID': deal.Id,
      'Title': deal.title,
      'Value': deal.value || 0,
      'Stage': deal.stage,
      'Probability': (deal.probability || 0) / 100,
      'Contact': this.getContactName(deal.contactId, contacts),
      'Expected Close': deal.expectedClose ? new Date(deal.expectedClose) : '',
      'Created Date': new Date(deal.createdAt),
      'Description': deal.description || ''
    }))

    const worksheet = XLSX.utils.json_to_sheet(excelData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Deals')
    
    // Format currency and percentage columns
    const range = XLSX.utils.decode_range(worksheet['!ref'])
    for (let R = 1; R <= range.e.r; ++R) { // Skip header row
      // Format Value column as currency
      const valueCell = worksheet[XLSX.utils.encode_cell({ r: R, c: 2 })]
      if (valueCell) {
        valueCell.z = '$#,##0'
      }
      
      // Format Probability column as percentage
      const probCell = worksheet[XLSX.utils.encode_cell({ r: R, c: 4 })]
      if (probCell) {
        probCell.z = '0%'
      }
    }
    
    // Auto-size columns
    const colWidths = []
    for (let C = range.s.c; C <= range.e.c; ++C) {
      let maxWidth = 10
      for (let R = range.s.r; R <= range.e.r; ++R) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C })
        const cell = worksheet[cellAddress]
        if (cell && cell.v) {
          maxWidth = Math.max(maxWidth, String(cell.v).length)
        }
      }
      colWidths.push({ width: Math.min(maxWidth + 2, 50) })
    }
    worksheet['!cols'] = colWidths

    XLSX.writeFile(workbook, `deals-export-${format(new Date(), 'yyyy-MM-dd')}.xlsx`)
  }

  convertToCSV(data) {
    if (!data.length) return ''
    
    const headers = Object.keys(data[0])
    const csv = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header]
          // Escape commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value
        }).join(',')
      )
    ].join('\n')
    
    return csv
  }

  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  getContactName(contactId, contacts) {
    const contact = contacts.find(c => c.Id === contactId)
    return contact ? contact.name : 'Unknown Contact'
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }
}

export const exportService = new ExportService()