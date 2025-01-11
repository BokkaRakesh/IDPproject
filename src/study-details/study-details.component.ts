import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-study-details',
  standalone: true,
  imports: [],
  templateUrl: './study-details.component.html',
  styleUrl: './study-details.component.scss'
})
export class StudyDetailsComponent implements OnInit{
  selectedOption: string = 'new'; // Default selection
  searchQuery: string = '';
  studies: any[] = []; // Data for existing studies
  expandedRowKeys: any = {};
constructor(){
  
}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  searchStudies() {
    // Mock logic to fetch studies based on search query
  }
}
