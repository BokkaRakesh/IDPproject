import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule, AbstractControl, AsyncValidatorFn } from "@angular/forms";
import { StudyService } from "../services/study.service";
import { CommonModule } from "@angular/common";
import { DropdownModule } from "primeng/dropdown";
import { TreeTableModule } from "primeng/treetable";
import { Observable, of } from "rxjs";
import { map, debounceTime, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-study-form',
  standalone: true,
  imports: [CommonModule, TreeTableModule, FormsModule, ReactiveFormsModule, DropdownModule],
  templateUrl: './study-form.component.html',
  styleUrls: ['./study-form.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StudyFormComponent implements OnInit {
  studyForm!: FormGroup;
  @Input() mode: 'new' | 'existing' = 'new';

  statusOptions = [
    { label: 'Not yet started', value: 'notStarted' },
    { label: 'In progress', value: 'inProgress' },
    { label: 'Complete', value: 'complete' }
  ];

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
    { key: 'dataAccessJiraCreation', name: 'Data access jira creation in ICDP' },
    { key: 'dataAccessCompletion', name: 'Data access completion by the data managers' }
  ];

  constructor(private fb: FormBuilder, private studyService: StudyService) {}

  ngOnInit() {
    this.initlizeForm();
  }

  initlizeForm() {
    this.studyForm = this.fb.group({
      studyId: ['', [Validators.required], [this.studyIdAsyncValidator()]],
      ...this.fields.reduce((acc: Record<string, any>, field) => {
        acc[field.key] = ['notStarted', Validators.required];
        acc[field.key + '_comment'] = [''];
        return acc;
      }, {}),
    });
  }

  // Async Validator to check if studyId exists
  studyIdAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<any> => {
      if (!control.value) {
        return of(null); // If no value is provided, return null (no validation)
      }
  
      return this.studyService.checkStudyIdExists(control.value).pipe(
        map((exists: boolean) => exists ? { studyIdExists: true } : null), // If exists, return error object with key 'studyIdExists'
        catchError(() => of(null)) // Handle error, do not block submission
      );
    };
  }
  onSubmit() {
    if (this.studyForm.valid) {
      const formData = this.studyForm.value;
      const newStudyData = {
        studyId: formData.studyId,
        fields: this.fields.map((field) => ({
          name: field.name,
          status: formData[field.key],
          comment: formData[field.key + '_comment'],
        })),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      this.studyService.saveStudyData(newStudyData).subscribe(
        () => {
          alert('Study data saved successfully');
          // this.studyService.saveToExcel(newStudyData);
          this.studyForm.reset();
          this.initlizeForm();
        },
        (error) => console.error('Error saving study data:', error)
      );
    }
  }
}
