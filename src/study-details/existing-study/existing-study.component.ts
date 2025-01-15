import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import saveAs from 'file-saver';
import { StudyService } from '../services/study.service';

@Component({
  selector: 'app-existing-study',
  standalone:true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './existing-study.component.html',
  styleUrl: './existing-study.component.scss'
})

export class ExistingStudyComponent implements OnInit {
  @Input() mode: 'new' | 'existing' = 'existing';
  searchQuery: string = ''; // Query for search functionality
  studies: any[] = []; // Data for existing studies (to populate TreeTable)
  filteredStudies: any[] = []; // List of filtered studies based on the search query
  selectedStudy: any; // The selected study when a row is clicked
  studyForm!: FormGroup; // The reactive form to edit the selected study
  statusOptions = [
    { label: 'Not yet started', value: 'notStarted' },
    { label: 'In progress', value: 'inProgress' },
    { label: 'Complete', value: 'complete' },
  ];

  constructor(private studyService: StudyService, private fb:FormBuilder) {}

  ngOnInit(): void {
    // Subscribe to the getStudies() Observable and update the studies array
    this.studyService.getStudies().subscribe(
      (studies) => {
        this.studies = studies;
        this.filteredStudies =  studies;// This will update your studies array with the fetched data
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
        studyId: this.selectedStudy.studyId,
        fields: this.selectedStudy.fields.map((field: any) => ({
          name: field.name,
          status: formData[field.key],
          comment: formData[field.key + '_comment'],
        })),
        createdAt: this.selectedStudy.createdAt,
        updatedAt: new Date(),
        mode:this.mode
      };
  
      // Save updated data
      this.studyService.saveStudyData(updatedStudyData).subscribe({
        next: () => {
          alert('Study data updated successfully');
          this.saveToExcel(updatedStudyData); // Proceed to Excel creation
  
          // Reset the form and hide it
          this.studyForm.reset(); // Reset the form
          this.selectedStudy = null; // Hide the form
        },
        error: (error) => {
          alert('Error updating study data');
          console.error('Error updating study data:', error);
        },
      });
    }
  }
  
    async saveToExcel(studyData: any) {
      try {
        const workbookBlob = await this.studyService.createExcelWorkbook(studyData);
        saveAs(workbookBlob, `Study_${studyData.studyId}_${new Date().toISOString()}.xlsx`);
      } catch (error) {
        console.error('Error generating Excel file:', error);
      }
    }
}

