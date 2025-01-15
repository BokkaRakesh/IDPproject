import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudyFormComponent } from './study-form/study-form.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ExistingStudyComponent } from './existing-study/existing-study.component';

@Component({
  selector: 'app-study-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, StudyFormComponent, ExistingStudyComponent],
  templateUrl: './study-details.component.html',
  styleUrls: ['./study-details.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StudyDetailsComponent {
 @Input() selectedOption: string = 'new'; // Default selection for form mode
  constructor() {}
}
