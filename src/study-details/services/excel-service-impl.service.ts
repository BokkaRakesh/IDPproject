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
    worksheet.getRow(1).values = ['Study Names', 'Status', 'Comments'];

    studyData[0].fields.forEach((field: any, index: number) => {
      const rowIndex = index + 2;
      const row = worksheet.getRow(rowIndex);
      row.getCell(1).value = field.name;
      row.getCell(2).value = field.status ?? 'N/A';
      row.getCell(3).value = field.comment ?? 'N/A';
      row.commit();
    });

    worksheet.getColumn(1).width = 50;
    worksheet.getColumn(2).width = 30;
    worksheet.getColumn(3).width = 50;

    const buffer = await workbook.xlsx.writeBuffer();
    return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }

  async createBulkExcelWorkbook(studyDataList: any[]): Promise<Blob> {
    const workbook = new Workbook();
    studyDataList.forEach((studyData, index) => {
      const worksheet = workbook.addWorksheet(`Study ${index + 1}`);
      worksheet.getRow(1).values = ['Study Names', 'Status', 'Comments'];

      studyData.fields.forEach((field: any, rowIndex: number) => {
        const row = worksheet.getRow(rowIndex + 2);
        row.getCell(1).value = field.name;
        row.getCell(2).value = field.status ?? 'N/A';
        row.getCell(3).value = field.comment ?? 'N/A';
        row.commit();
      });

      worksheet.getColumn(1).width = 50;
      worksheet.getColumn(2).width = 30;
      worksheet.getColumn(3).width = 50;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }
}
