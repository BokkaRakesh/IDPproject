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
