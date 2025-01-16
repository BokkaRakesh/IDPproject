import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';

export interface ExcelService {
  createExcelWorkbook(studyData: any): Promise<Blob>;
  createBulkExcelWorkbook(studyDataList: any[]): Promise<Blob>;
}

@Injectable({
  providedIn: 'root',
})
export class ExcelServiceImpl implements ExcelService {

  async createExcelWorkbook(studyData: any): Promise<Blob> {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Study Data');
  
    // Define headers for columns
    worksheet.getRow(1).values = ['Study Names', 'Status', 'Comments']; // Column titles
  
    // Define static headers
    const staticHeaders = [
      { header: 'Study ID', value: studyData[0].studyId },
      { header: 'Created At', value: studyData[0].createdAt?.toString() ?? 'N/A' },
      { header: 'Updated At', value: studyData[0].updatedAt?.toString() ?? 'N/A' }
    ];
  
    // Write static headers
    staticHeaders.forEach((item, index) => {
      const rowIndex = index + 2; // Start from the second row
      const row = worksheet.getRow(rowIndex);
      row.getCell(1).value = item.header; // Header in column A
      row.getCell(2).value = item.value; // Value in column B
      row.getCell(3).value = ''; // No comments for static fields
      row.commit();
    });
  
    // Write dynamic fields from the 'fields' array
    studyData[0].fields.forEach((field: any, index: number) => {
      const rowIndex = staticHeaders.length + index + 2; // Continue after static headers
      const row = worksheet.getRow(rowIndex);
  
      // Combine createdAt and createdBy with the field data
      const fieldDetails = `${field.name} (Created At: ${field.createdAt ? field.createdAt.toString() : 'N/A'}, Created By: ${field.createdBy ?? 'N/A'})`;
  
      // Write the field name with createdAt and createdBy in the first column
      row.getCell(1).value = fieldDetails; // Field details in column A
      row.getCell(2).value = field.status ?? 'N/A'; // Status in column B
      row.getCell(3).value = field.comment ?? 'N/A'; // Comments in column C
      row.commit();
    });
  
    // Adjust column widths for better readability
    worksheet.getColumn(1).width = 50; // Field name column width
    worksheet.getColumn(2).width = 30; // Status column width
    worksheet.getColumn(3).width = 50; // Comments column width
  
    // Generate the workbook buffer
    const buffer = await workbook.xlsx.writeBuffer();
  
    // Return the Blob for the generated Excel file
    return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }
  

  async createBulkExcelWorkbook(studyDataList: any[]): Promise<Blob> {
    const workbook = new Workbook();
  
    // Iterate through the study data list
    studyDataList.forEach((studyData, index) => {
      const worksheet = workbook.addWorksheet(`Study ${index + 1}`);
  
      // Define headers for columns
      worksheet.getRow(1).values = ['Study Names', 'Status', 'Comments']; // Column titles
  
      // Define static headers for each study
      const staticHeaders = [
        { header: 'Study ID', value: studyData.studyId },
        { header: 'Created At', value: studyData.createdAt?.toString() ?? 'N/A' },
        { header: 'Updated At', value: studyData.updatedAt?.toString() ?? 'N/A' }
      ];
  
      // Write static headers for each study
      staticHeaders.forEach((item, index) => {
        const rowIndex = index + 2; // Start from the second row
        const row = worksheet.getRow(rowIndex);
        row.getCell(1).value = item.header; // Header in column A
        row.getCell(2).value = item.value; // Value in column B
        row.getCell(3).value = ''; // No comments for static fields
        row.commit();
      });
  
      // Write dynamic fields from the 'fields' array
      studyData.fields.forEach((field: any, fieldIndex: number) => {
        const rowIndex = staticHeaders.length + fieldIndex + 2; // Continue after static headers
        const row = worksheet.getRow(rowIndex);
  
        // Combine createdAt and createdBy with the field data
        const fieldDetails = `${field.name} (Created At: ${field.createdAt ? field.createdAt.toString() : 'N/A'}, Created By: ${field.createdBy ?? 'N/A'})`;
  
        // Write the field name with createdAt and createdBy in the first column
        row.getCell(1).value = fieldDetails; // Field details in column A
        row.getCell(2).value = field.status ?? 'N/A'; // Status in column B
        row.getCell(3).value = field.comment ?? 'N/A'; // Comments in column C
        row.commit();
      });
  
      // Adjust column widths for better readability
      worksheet.getColumn(1).width = 50; // Field name column width
      worksheet.getColumn(2).width = 30; // Status column width
      worksheet.getColumn(3).width = 50; // Comments column width
    });
  
    // Generate the workbook buffer
    const buffer = await workbook.xlsx.writeBuffer();
  
    // Return the Blob for the generated Excel file
    return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }
  
}
