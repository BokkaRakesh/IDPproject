import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudyService {
  private studiesSubject = new BehaviorSubject<any[]>([
    {
      studyId: 'ST123',
      fields: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      studyId: 'ST124',
      fields: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      studyId: 'ST125',
      fields: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ])
  private studyTemplate = {
    fields: [
      { name: 'Request for new data Ingestion', status: 'notStarted', comment: '' },
      { name: 'Jira creation in ICDP Dashboard', status: 'notStarted', comment: '' },
      { name: 'Apollo Meta request creation and approval', status: 'notStarted', comment: '' },
      { name: 'IDTA creation and approval', status: 'notStarted', comment: '' },
      { name: 'S3 bucket creation and testing with the vendor', status: 'notStarted', comment: '' },
      { name: 'Sample data transfer with transfer log', status: 'notStarted', comment: '' },
      { name: 'Sample data verification on S3', status: 'notStarted', comment: '' },
      { name: 'Sample data validation on Flywheel', status: 'notStarted', comment: '' },
      { name: 'Sample data ingestion confirmation to the vendor', status: 'notStarted', comment: '' },
      { name: 'Gears+Curation+Tags Verification', status: 'notStarted', comment: '' },
      { name: 'Full dataset transfer by the vendor', status: 'notStarted', comment: '' },
      { name: 'Full dataset verification on S3', status: 'notStarted', comment: '' },
      { name: 'Full dataset ingestion on Flywheel', status: 'notStarted', comment: '' },
      { name: 'Full dataset validation confirmation to the vendor', status: 'notStarted', comment: '' },
      { name: 'Onboarding documentation', status: 'notStarted', comment: '' },
      { name: 'Data Ingestion Checklist', status: 'notStarted', comment: '' },
      { name: 'Close the loop with the vendor', status: 'notStarted', comment: '' },
      { name: 'Dataset availability confirmation to the study teams', status: 'notStarted', comment: '' },
      { name: 'Data access requests by the users', status: 'notStarted', comment: '' },
      { name: 'Data access jira creation in ICDP', status: 'notStarted', comment: '' },
      { name: 'Data access completion by the data managers', status: 'notStarted', comment: '' },
    ],
  };

  private selectedStudySubject = new BehaviorSubject<any>(null);
  private studyDataSubject = new BehaviorSubject<any>(null); // Initial value is null
  studyData$ = this.studyDataSubject.asObservable(); // Expose the observable to be subscribed to
  constructor() {}

  // Get the list of studies as an observable
  getStudies(): Observable<any[]> {
    return this.studiesSubject.asObservable().pipe(delay(500)); // Simulate async behavior
  }

  // Save study data and update the studies list
  saveStudyData(studyData: any): Observable<void> {
    return new Observable<void>((observer) => {
      setTimeout(() => {
        const studies = this.studiesSubject.value;

        // Add new study data to the list with template fields if not already present
        const newStudy = {
          studyId: studyData.studyId,
          fields: this.studyTemplate.fields,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...studyData, // Merge additional studyData properties
        };

        const updatedStudies = [...studies, newStudy];
        this.studiesSubject.next(updatedStudies); // Update the BehaviorSubject
        observer.next();
        observer.complete();
      }, 500); // Simulated delay
    });
  }
  getSelectedStudy(): any {
    return this.selectedStudySubject.value; // Return the current study data
  }
  setSelectedStudy(study: any): void {
    this.selectedStudySubject.next(study); // Update the selected study
  }

  async createExcelWorkbook(studyData: any): Promise<Blob> {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Study Data');
  
    // Define headers for columns
    worksheet.getRow(1).values = ['Study Names', 'Status', 'Comments']; // Column titles
  
    // Define static headers
    const staticHeaders = [
      { header: 'Study ID', value: studyData.studyId },
      { header: 'Created At', value: studyData.createdAt?.toString() ?? 'N/A' },
      { header: 'Updated At', value: studyData.updatedAt?.toString() ?? 'N/A' }
    ];
  
    // Write static headers
    staticHeaders.forEach((item, index) => {
      const rowIndex = index + 2; // Start from the second row
      const row = worksheet.getRow(rowIndex);
      row.getCell(1).value = item.header; // Header in column A
      row.getCell(2).value = item.value; // Status in column B
      row.getCell(3).value = ''; // No comments for static fields
      row.commit();
    });
  
    // Write dynamic fields from the 'fields' array
    studyData.fields.forEach((field: any, index: number) => {
      const rowIndex = staticHeaders.length + index + 2; // Continue after static headers
      const row = worksheet.getRow(rowIndex);
      row.getCell(1).value = field.name; // Header in column A
      row.getCell(2).value = field.status ?? 'N/A'; // Status in column B
      row.getCell(3).value = field.comment ?? 'N/A'; // Comments in column C
      row.commit();
    });
  
    // Adjust column widths for better readability
    worksheet.getColumn(1).width = 50; // Header column width
    worksheet.getColumn(2).width = 30; // Status column width
    worksheet.getColumn(3).width = 50; // Comments column width
  
    // Generate the workbook buffer
    const buffer = await workbook.xlsx.writeBuffer();
  
    // Return the Blob for the generated Excel file
    return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }
}
