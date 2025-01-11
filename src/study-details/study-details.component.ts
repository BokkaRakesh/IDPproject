import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { StudyFormComponent } from './study-form/study-form.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { StudyService } from './study.service';
import { ExistingStudyComponent } from './existing-study/existing-study.component';

@Component({
  selector: 'app-study-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, StudyFormComponent, ExistingStudyComponent],
  templateUrl: './study-details.component.html',
  styleUrls: ['./study-details.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StudyDetailsComponent implements OnInit {
  selectedOption: string = 'new'; // Default selection for form mode
  searchQuery: string = ''; // Query for search functionality
  studies: any[] = []; // Data for existing studies (to populate TreeTable)
  originalStudies: any[] = []; // Store original studies data to reset after filtering
  expandedRowKeys: any = {}; // Keys for expanded rows in TreeTable
  searchQuerySubject: BehaviorSubject<string> = new BehaviorSubject<string>(''); // RxJS Subject


  filteredStudies: any[] = []; // List of filtered studies based on the search query
  selectedStudy: any; // The selected study when a row is clicked
  studyForm!: FormGroup; // The reactive form to edit the selected study
  statusOptions = [
    { label: 'Not yet started', value: 'notStarted' },
    { label: 'In progress', value: 'inProgress' },
    { label: 'Complete', value: 'complete' },
  ];
  studyData: any[] = []; // To hold all study records

  constructor(private studyService: StudyService, private fb:FormBuilder) {}

  ngOnInit(): void {
    // Subscribe to the getStudies() Observable and update the studies array
    this.studyService.getStudies().subscribe(
      (studies) => {
        this.studies = studies; // This will update your studies array with the fetched data
      },
      (error) => {
        console.error('Error fetching studies:', error); // Handle error if necessary
      }
    );
  }

  // Filter studies based on the search query
  filterStudies() {
    if (this.searchQuery) {
      this.filteredStudies = this.studies.filter((study) =>
        study.studyId.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredStudies = this.studies;
    }
  }

  // When a study row is clicked, set the selected study
  onSelectStudy(study: any) {
    this.selectedStudy = study;
    this.selectedStudy.fields = this.selectedStudy.fields.map((field: any, index: number) => ({
      ...field,
      key: `field_${index}`, // Add a unique key for each field
    }));
    this.initializeForm(); // Initialize the form for the selected study
  }

  // Initialize the form for the selected study
  private initializeForm() {
    // Add keys to fields dynamically before initializing the form


    const fieldsGroup: any = {};

    // Set studyId as disabled
    fieldsGroup['studyId'] = [{ value: this.selectedStudy.studyId, disabled: true }];

    // Loop through the fields and create form controls for each field
    this.selectedStudy.fields.forEach((field: any) => {
      fieldsGroup[field.key] = [field.status, Validators.required]; // Field status control
      fieldsGroup[field.key + '_comment'] = [field.comment]; // Field comment control
    });

    // Initialize the form group
    this.studyForm = this.fb.group(fieldsGroup);
  }

  // Handle form submission
  onSubmit() {
    if (this.studyForm.valid) {
      const formData = this.studyForm.value;
      const updatedStudyData = {
        studyId: formData.studyId,
        fields: this.selectedStudy.fields.map((field: any) => ({
          name: field.name,
          status: formData[field.key],
          comment: formData[field.key + '_comment'],
        })),
        updatedAt: new Date(),
      };

      // Save updated data (e.g., send it to a backend API)
      this.studyService.saveStudyData(updatedStudyData);
      alert('Study data updated successfully');
    }
  }
  
}
