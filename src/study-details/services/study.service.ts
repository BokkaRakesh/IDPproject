import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import saveAs from 'file-saver';
import { ExcelServiceImpl } from './excel-service-impl.service';
import { DatabaseService } from './indexed-db.service';

@Injectable({
  providedIn: 'root',
})
export class StudyService {
  constructor(
    private dbService: DatabaseService,
    private excelService: ExcelServiceImpl  // Inject ExcelServiceImpl
  ) {}

  // Method to wrap IDBRequest in an Observable
  private wrapIDBRequest(request: IDBRequest<any[]>): Observable<any[]> {
    return new Observable<any[]>((observer) => {
      request.onsuccess = (event: Event) => {
        const target = event.target as IDBRequest<any[]>;
        if (target) {
          observer.next(target.result);
          observer.complete();
        } else {
          observer.error('Request failed: target is null');
        }
      };

      request.onerror = (event: Event) => {
        const target = event.target as IDBRequest<any[]>;
        if (target) {
          observer.error(target.error);
        } else {
          observer.error('Request failed: target is null');
        }
      };
    });
  }

  // Method to retrieve all studies
  getStudies(): Observable<any[]> {
    return this.dbService.openDb().pipe(
      switchMap((db) => {
        if (!db) {
          return of([]); // Return empty array if IndexedDB is not initialized
        }

        const transaction = db.transaction(this.dbService.storeName, 'readonly');
        const store = transaction.objectStore(this.dbService.storeName);
        const request = store.getAll(); // Retrieve all records from the store

        return this.wrapIDBRequest(request).pipe(
          catchError((err) => {
            console.error('Error retrieving studies from IndexedDB:', err);
            return of([]); // Return empty array on error
          })
        );
      }),
      catchError((err) => {
        console.error('Error opening the database or fetching studies:', err);
        return of([]); // Return empty array on error
      })
    );
  }

  // Method to save study data to IndexedDB
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

  // Method to update study data in IndexedDB
  updateStudyData(updatedStudyData: any): Observable<void> {
    return new Observable<void>((observer) => {
      this.dbService.openDb().subscribe({
        next: (db) => {
          if (db) {
            const transaction = db.transaction(this.dbService.storeName, 'readwrite');
            const store = transaction.objectStore(this.dbService.storeName);

            if (!updatedStudyData.studyId) {
              observer.error('Study ID is missing');
              return;
            }

            const request = store.put(updatedStudyData);

            request.onsuccess = () => {
              observer.next();
              observer.complete();
            };

            request.onerror = (err) => {
              observer.error('Error updating study: ' + err);
            };
          }
        },
        error: (err) => observer.error('Error opening database: ' + err),
      });
    });
  }

  // Method to save study data to Excel (single)
  async saveToExcel(studyData: any): Promise<void> {
    try {
      // Generate the Excel file and prompt for download
      const workbookBlob = await this.excelService.createExcelWorkbook(studyData);
      saveAs(workbookBlob, `Study_${studyData.studyId}_${new Date().toISOString()}.xlsx`);
    } catch (error) {
      console.error('Error generating Excel file:', error);
    }
  }

  // Method to save bulk study data to Excel (multiple studies)
  async saveBulkToExcel(studyDataList: any[]): Promise<void> {
    try {
      // Generate the bulk Excel file and prompt for download
      const workbookBlob = await this.excelService.createBulkExcelWorkbook(studyDataList);
      saveAs(workbookBlob, `Bulk_Studies_${new Date().toISOString()}.xlsx`);
    } catch (error) {
      console.error('Error generating bulk Excel file:', error);
    }
  }

  // Method to check if the study ID already exists
  checkStudyIdExists(studyId: string): Observable<boolean> {
    return this.dbService.checkStudyId(studyId); // Replace with your IndexedDB check logic
  }

  // Method to delete a study record
  deleteStudy(studyId: string): Observable<void> {
    return new Observable<void>((observer) => {
      this.dbService.openDb().subscribe({
        next: (db) => {
          if (db) {
            const transaction = db.transaction(this.dbService.storeName, 'readwrite');
            const store = transaction.objectStore(this.dbService.storeName);
            const request = store.delete(studyId);

            request.onsuccess = () => {
              observer.next();
              observer.complete();
            };

            request.onerror = (err) => {
              observer.error('Error deleting study: ' + err);
            };
          }
        },
        error: (err) => observer.error('Error opening database: ' + err),
      });
    });
  }
}
