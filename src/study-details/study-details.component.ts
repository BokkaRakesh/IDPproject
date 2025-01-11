import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { StudyFormComponent } from './study-form/study-form.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-study-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, StudyFormComponent],
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

  constructor() {}

  ngOnInit(): void {
    // Example data for TreeTable (this can be fetched from an API or service)
    this.studies = [
      {
        key: '1',
        data: {
          studyId: 'WO30070',
          studyName: 'Main Study',
          status: 'In Progress',
        },
        children: [
          {
            key: '1-1',
            data: {
              studyId: 'WO30071',
              studyName: 'Sub Study 1',
              status: 'Not Started',
            },
          },
          {
            key: '1-2',
            data: {
              studyId: 'WO30072',
              studyName: 'Sub Study 2',
              status: 'Completed',
            },
          },
        ],
      },
    ];

    // Store the original studies data
    this.originalStudies = [...this.studies];

    // Subscribe to search query changes and perform filtering
    this.searchQuerySubject
      .pipe(
        debounceTime(300), // Delay for 300ms after typing
        distinctUntilChanged(), // Only emit when search term changes
        switchMap(query => this.filterStudies(query)) // Use switchMap to filter studies
      )
      .subscribe(filteredStudies => {
        this.studies = filteredStudies;
      });
  }

  // Filter studies based on the search query (search only by studyId)
  private filterStudies(query: string): Observable<any[]> {
    if (query) {
      const filteredStudies = this.originalStudies.filter(study => {
        // Convert both query and studyId to lowercase for case-insensitive comparison
        const studyId = study.data.studyId.toLowerCase();
        const searchQuery = query.toLowerCase();
        
        // Check if the search query is part of the studyId (it can be at any position)
        return studyId.includes(searchQuery);
      });
  
      return new Observable(observer => {
        observer.next(filteredStudies);
        observer.complete();
      });
    } else {
      // If query is empty, return all studies
      return new Observable(observer => {
        observer.next([...this.originalStudies]);
        observer.complete();
      });
    }
  }
  

  // Called when the search query changes
  onSearchQueryChange(query: string) {
    // Emit new query only if it has 3 or more characters
    if (query.length >= 3) {
      this.searchQuerySubject.next(query); // Emit query for processing
    } else {
      // Optionally, clear the results if less than 3 characters are entered
      this.studies = [...this.originalStudies];
    }
  }
  
}
