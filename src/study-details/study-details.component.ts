import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
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
export class StudyDetailsComponent {
 @Input() selectedOption: string = 'new'; // Default selection for form mode
  constructor() {}
}
