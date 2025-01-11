import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StudyFormComponent } from './study-form/study-form.component';



@NgModule({
  declarations: [StudyFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class StudyDetailsModule { }
