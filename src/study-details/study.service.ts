import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudyService {

  constructor() {}

  // Method to save study data (simulating an API call with a delay)
  saveStudyData(studyData: any): Observable<void> {
    console.log('Study data saved:', studyData);
    // Simulate a delay to mimic an API response
    return of(undefined).pipe(delay(500)); // 500ms delay to mimic async behavior
  }

  // Method to create and return an Excel workbook (using exceljs)
  async createExcelWorkbook(studyData: any): Promise<Blob> {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Study Data');

    // Define static columns
    worksheet.columns = [
      { header: 'Study ID', key: 'studyId', width: 15 },
      { header: 'Study Name', key: 'studyName', width: 30 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Timestamp', key: 'timestamp', width: 30 },
      // Dynamically add fields based on the 'fields' array
      { header: 'Request for new data Ingestion', key: 'requestNewData', width: 30 },
      { header: 'Jira creation in ICDP Dashboard', key: 'jiraCreation', width: 30 },
      { header: 'Apollo Meta request creation and approval', key: 'apolloMetaRequest', width: 30 },
      { header: 'IDTA creation and approval', key: 'idtaCreation', width: 30 },
      { header: 'S3 bucket creation and testing with the vendor', key: 's3Bucket', width: 30 },
      { header: 'Sample data transfer with transfer log', key: 'sampleDataTransfer', width: 30 },
      { header: 'Sample data verification on S3', key: 'sampleDataVerificationS3', width: 30 },
      { header: 'Sample data validation on Flywheel', key: 'sampleDataValidationFlywheel', width: 30 },
      { header: 'Sample data ingestion confirmation to the vendor', key: 'sampleDataIngestionConfirmation', width: 30 },
      { header: 'Gears+Curation+Tags Verification', key: 'gearsCurationTags', width: 30 },
      { header: 'Full dataset transfer by the vendor', key: 'fullDatasetTransfer', width: 30 },
      { header: 'Full dataset verification on S3', key: 'fullDatasetVerificationS3', width: 30 },
      { header: 'Full dataset ingestion on Flywheel', key: 'fullDatasetIngestionFlywheel', width: 30 },
      { header: 'Full dataset validation confirmation to the vendor', key: 'fullDatasetValidationVendor', width: 30 },
      { header: 'Onboarding documentation', key: 'onboardingDocs', width: 30 },
      { header: 'Data Ingestion Checklist', key: 'dataIngestionChecklist', width: 30 },
      { header: 'Close the loop with the vendor', key: 'closeLoopVendor', width: 30 },
      { header: 'Dataset availability confirmation to the study teams', key: 'datasetAvailability', width: 30 },
      { header: 'Data access requests by the users', key: 'dataAccessRequests', width: 30 },
      { header: 'Data access jira creation in ICDP', key: 'dataAccessJiraCreation', width: 30 },
      { header: 'Data access completion by the data managers', key: 'dataAccessCompletion', width: 30 }
    ];

    // Add data row from the studyData object
    worksheet.addRow({
      studyId: studyData.studyId,
      studyName: studyData.studyName,
      status: studyData.status,
      timestamp: new Date().toISOString(), // Add current timestamp
      requestNewData: studyData.requestNewData,
      jiraCreation: studyData.jiraCreation,
      apolloMetaRequest: studyData.apolloMetaRequest,
      idtaCreation: studyData.idtaCreation,
      s3Bucket: studyData.s3Bucket,
      sampleDataTransfer: studyData.sampleDataTransfer,
      sampleDataVerificationS3: studyData.sampleDataVerificationS3,
      sampleDataValidationFlywheel: studyData.sampleDataValidationFlywheel,
      sampleDataIngestionConfirmation: studyData.sampleDataIngestionConfirmation,
      gearsCurationTags: studyData.gearsCurationTags,
      fullDatasetTransfer: studyData.fullDatasetTransfer,
      fullDatasetVerificationS3: studyData.fullDatasetVerificationS3,
      fullDatasetIngestionFlywheel: studyData.fullDatasetIngestionFlywheel,
      fullDatasetValidationVendor: studyData.fullDatasetValidationVendor,
      onboardingDocs: studyData.onboardingDocs,
      dataIngestionChecklist: studyData.dataIngestionChecklist,
      closeLoopVendor: studyData.closeLoopVendor,
      datasetAvailability: studyData.datasetAvailability,
      dataAccessRequests: studyData.dataAccessRequests,
      dataAccessJiraCreation: studyData.dataAccessJiraCreation,
      dataAccessCompletion: studyData.dataAccessCompletion
    });

    // Generate the workbook buffer
    const buffer = await workbook.xlsx.writeBuffer();
    
    // Return the Blob for the generated Excel file
    return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }
}
