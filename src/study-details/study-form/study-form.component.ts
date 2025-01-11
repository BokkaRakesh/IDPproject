import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-study-form',
  standalone: true,
  imports: [],
  templateUrl: './study-form.component.html',
  styleUrl: './study-form.component.scss'
})
export class StudyFormComponent implements OnInit {
  studyForm: FormGroup | undefined;
  fields = [
    { key: 'requestNewData', name: 'Request for new data Ingestion' },
    { key: 'jiraCreation', name: 'Jira creation in ICDP Dashboard' },
    { key: 'apolloMetaRequest', name: 'Apollo Meta request creation and approval' },
    { key: 'idtaCreation', name: 'IDTA creation and approval' },
    { key: 's3Bucket', name: 'S3 bucket creation and testing with the vendor' },
    { key: 'sampleDataTransfer', name: 'Sample data transfer with transfer log' },
    { key: 'sampleDataVerificationS3', name: 'Sample data verification on S3' },
    { key: 'sampleDataValidationFlywheel', name: 'Sample data validation on Flywheel' },
    { key: 'sampleDataIngestionConfirmation', name: 'Sample data ingestion confirmation to the vendor' },
    { key: 'gearsCurationTags', name: 'Gears+Curation+Tags Verification' },
    { key: 'fullDatasetTransfer', name: 'Full dataset transfer by the vendor' },
    { key: 'fullDatasetVerificationS3', name: 'Full dataset verification on S3' },
    { key: 'fullDatasetIngestionFlywheel', name: 'Full dataset ingestion on Flywheel' },
    { key: 'fullDatasetValidationVendor', name: 'Full dataset validation confirmation to the vendor' },
    { key: 'onboardingDocs', name: 'Onboarding documentation' },
    { key: 'dataIngestionChecklist', name: 'Data Ingestion Checklist' },
    { key: 'closeLoopVendor', name: 'Close the loop with the vendor' },
    { key: 'datasetAvailability', name: 'Dataset availability confirmation to the study teams' },
    { key: 'dataAccessRequests', name: 'Data access requests by the users' },
    { key: 'dataAccessJiraCreation', name: 'Data access Jira creation in ICDP' },
    { key: 'dataAccessCompletion', name: 'Data access completion by the data managers' }
  ];
  

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.studyForm = this.fb.group({
      studyId: ['', Validators.required],
      studyName: ['', Validators.required],
      ...this.fields.reduce((acc: { [key: string]: any }, field) => {
        acc[field.key] = ['Not yet started'];
        acc[field.key + '_comment'] = [''];
        return acc;
      }, {}),
    });
    
  }

  onSubmit() {
    if (this.studyForm) {
      const formData = this.studyForm.value;
      // Save to JSON file or mock API endpoint
      console.log(formData);
    } else {
      console.error('Form is not initialized.');
    }
  }
  
}

