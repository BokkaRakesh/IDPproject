import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import saveAs from 'file-saver';
import { StudyService } from '../services/study.service';
import { ExcelServiceImpl } from '../services/excel-service-impl.service';

@Component({
  selector: 'app-existing-study',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './existing-study.component.html',
  styleUrls: ['./existing-study.component.scss']
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

  constructor(
    private studyService: StudyService, 
    private excelService: ExcelServiceImpl,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.studyService.getStudies().subscribe(
      (studies) => {
        this.studies = studies;
        this.filteredStudies = studies;
      },
      (error) => {
        console.error('Error fetching studies:', error);
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
  onStudySelected(study: any) {
    study.selected = !study.selected;
  }
  // Method to handle individual study selection
  onSelectStudy(study: any) {
    this.selectedStudy = study;
    this.selectedStudy.fields = this.selectedStudy.fields.map((field: any, index: number) => ({
      ...field,
      key: `field_${index}`, // Add a unique key for each field
    }));
    this.initializeForm(); // Initialize the form for the selected study
  }
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
  // Check if any study is selected for bulk download
  anySelected(): boolean {
    return this.filteredStudies.some(study => study.selected);
  }
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
      };
  
      this.studyService.saveStudyData(updatedStudyData).subscribe({
        next: () => {
          alert('Study data updated successfully');
          
          // Refresh the table data after updating the record
          this.refreshStudies();
  
          // Reset the form and selected study
          this.studyForm.reset();
          this.selectedStudy = null;
        },
        error: (error) => {
          alert('Error updating study data');
          console.error('Error updating study data:', error);
        },
      });
    }
  }
  // Method to refresh studies from IndexedDB
refreshStudies() {
  this.studyService.getStudies().subscribe({
    next: (studies) => {
      // Update the studies and filtered studies arrays
      this.studies = studies;
      this.filteredStudies = studies;  // If you have any filters applied, update them here
    },
    error: (err) => {
      console.error('Error refreshing studies:', err);
    }
  });
}

  
  // Method to handle bulk download
  onBulkDownload() {
    const selectedStudies = this.filteredStudies.filter(study => study.selected);
    
    if (selectedStudies.length === 0) {
      alert('No studies selected for download.');
      return;
    }

    // Generate the Excel file for all selected studies
    this.excelService.createExcelWorkbook(selectedStudies).then((blob:any) => {
      saveAs(blob, 'studies_bulk_download.xlsx');
    }).catch(err => {
      console.error('Error generating bulk Excel file:', err);
    });
  }

  // Method to handle download for a single study
  onDownload(study: any) {
    if (!study.selected) {
      return;  // Prevent download if checkbox is not selected
    }
    this.excelService.createExcelWorkbook([study]).then((blob) => {
      saveAs(blob, `study_${study.studyId}_download.xlsx`);
    }).catch(err => {
      console.error('Error generating Excel file for study:', err);
    });
  }

  // Method to toggle select all checkbox
  toggleSelectAll(event: any) {
    const isChecked = event.target.checked;
    this.filteredStudies.forEach((study) => (study.selected = isChecked));
  }

  // Check if all studies are selected
  isAllSelected(): boolean {
    return this.filteredStudies.length > 0 && this.filteredStudies.every(study => study.selected);
  }

  // Method to edit a study (you can extend this with a modal or form)
  onEditStudy(study: any) {
    this.selectedStudy = study;
    // Add the logic to open a form/modal for editing the study details.
    console.log('Editing study:', study);
  }

  // Method to delete a study (you can extend this with a confirmation modal)
  onDeleteStudy(study: any) {
    if (confirm('Are you sure you want to delete this study?')) {
      this.studyService.deleteStudy(study.studyId).subscribe(
        () => {
          this.studies = this.studies.filter(s => s.studyId !== study.studyId);
          this.filteredStudies = this.filteredStudies.filter(s => s.studyId !== study.studyId);
          alert('Study deleted successfully');
        },
        (error) => {
          console.error('Error deleting study:', error);
        }
      );
    }
  }
}
