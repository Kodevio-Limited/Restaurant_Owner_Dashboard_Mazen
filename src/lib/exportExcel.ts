import * as XLSX from 'xlsx';

/**
 * Downloads a worksheet or workbook as an .xlsx file in the browser.
 */
export function downloadWorkbook(wb: XLSX.WorkBook, fileName: string) {
  const ext = fileName.endsWith('.xlsx') ? '' : '.xlsx';
  XLSX.writeFile(wb, `${fileName}${ext}`);
}

/**
 * Export generic JSON array of objects to Excel file.
 */
export function exportTableToExcel(
  data: Record<string, unknown>[],
  fileName: string,
  sheetName = 'Sheet1',
) {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  downloadWorkbook(wb, fileName);
}

