import { Injectable } from "@angular/core";
import { Observable, from } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import saveAs from "file-saver";
import { ExcelServiceImpl } from "./excel-service-impl.service";
import { DatabaseService } from "./indexed-db.service";

@Injectable({
  providedIn: 'root',
})
export class StudyService {
  constructor(
    private dbService: DatabaseService,
    private excelService: ExcelServiceImpl
  ) {}

// Method to wrap IDBRequest in an Observable
private wrapIDBRequest(request: IDBRequest<any[]>): Observable<any[]> {
  return new Observable<any[]>((observer) => {
    request.onsuccess = (event: Event) => {
      const target = event.target as IDBRequest<any[]>; // Type assertion to IDBRequest
      if (target) {
        observer.next(target.result); // Send result to observer
        observer.complete();
      } else {
        observer.error('Request failed: target is null');
      }
    };

    request.onerror = (event: Event) => {
      const target = event.target as IDBRequest<any[]>; // Type assertion to IDBRequest
      if (target) {
        observer.error(target.error); // Send error to observer
      } else {
        observer.error('Request failed: target is null');
      }
    };
  });
}


  getStudies(): Observable<any[]> {
    return this.dbService.openDb().pipe(
      switchMap((db) => {
        if (!db) {
          return new Observable<any[]>((observer) => observer.error('IndexedDB not initialized'));
        }

        // Create the transaction and retrieve studies after getting the DB object
        const transaction = db.transaction(this.dbService.storeName, 'readonly');
        const store = transaction.objectStore(this.dbService.storeName);
        const request = store.getAll(); // IDBRequest

        return this.wrapIDBRequest(request).pipe(
          catchError((err) => {
            console.error('Error retrieving studies from IndexedDB:', err);
            return new Observable<any[]>(); // Return an empty observable on error
          })
        );
      }),
      catchError((err) => {
        console.error('Error opening the database or fetching studies:', err);
        return new Observable<any[]>(); // Return an empty observable on error
      })
    );
  }

  saveStudyData(studyData: any): Observable<void> {
    return new Observable<void>((observer) => {
      this.dbService.openDb().subscribe({
        next: (db) => {
          if (db) {
            this.dbService.saveData(db, this.dbService.storeName, studyData).subscribe({
              next: () => {
                observer.next();
                observer.complete();
              },
              error: (err) => observer.error(err),
            });
          }
        },
        error: (err) => observer.error(err),
      });
    });
  }

  async saveToExcel(studyData: any): Promise<void> {
    try {
      // Call the method from ExcelServiceImpl to generate Excel file
      const workbookBlob = await this.excelService.createExcelWorkbook(studyData);
      saveAs(workbookBlob, `Study_${studyData.studyId}_${new Date().toISOString()}.xlsx`);
    } catch (error) {
      console.error('Error generating Excel file:', error);
    }
  }
  createExcelWorkbook(studyData: any): Promise<Blob> {
    return this.excelService.createExcelWorkbook(studyData);
  }
  // Add a method to check if the study ID already exists
  checkStudyIdExists(studyId: string): Observable<boolean> {
    return this.dbService.checkStudyId(studyId); // Replace with your IndexedDB check logic
  }
  
  
  

}
