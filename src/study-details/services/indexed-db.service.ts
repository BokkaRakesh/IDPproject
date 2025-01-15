import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

export interface DatabaseService {
  openDb(): Observable<IDBDatabase | null>;
  saveData(db: IDBDatabase, storeName: string, data: any): Observable<void>;
  checkStudyId(studyId: string): Observable<boolean>;
}


@Injectable({
  providedIn: 'root',
})
export class DatabaseService implements DatabaseService {
  dbName = 'StudyDataDB';
  storeName = 'studies';  // Define the storeName here

  constructor() {}

  openDb(): Observable<IDBDatabase | null> {
    return new Observable<IDBDatabase | null>((observer) => {
      const request = indexedDB.open(this.dbName, 1);
  
      // Schema setup (creating object store if not exists)
      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBRequest).result as IDBDatabase;  // Correct casting here
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'studyId' });
        }
      };
  
      // Successful DB open
      request.onsuccess = (event: Event) => {
        const db = (event.target as IDBRequest).result as IDBDatabase; // Correct casting here
        observer.next(db);
        observer.complete();
      };
  
      // Error while opening the DB
      request.onerror = (event: Event) => {
        console.error('Error opening IndexedDB:', event);
        observer.error(event);
      };
    });
  }
  

  // Save data to the store
  saveData(db: IDBDatabase, storeName: string, data: any): Observable<void> {
    return new Observable<void>((observer) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      store.put(data);

      transaction.oncomplete = () => {
        observer.next();
        observer.complete();
      };

      transaction.onerror = (event: Event) => {
        console.error('Error saving data to IndexedDB:', event);
        observer.error(event);
      };
    });
  }

  // Check if studyId exists in IndexedDB
  checkStudyId(studyId: string): Observable<boolean> {
    return new Observable((observer) => {
      const request = indexedDB.open(this.dbName);

      request.onsuccess = (event: Event) => {
        const db = (event.target as IDBRequest).result as IDBDatabase;
        const transaction = db.transaction(this.storeName, 'readonly');
        const store = transaction.objectStore(this.storeName);

        // Try to get the study using the studyId
        const getRequest = store.get(studyId);

        getRequest.onsuccess = () => {
          if (getRequest.result) {
            // Study ID found
            observer.next(true);
          } else {
            // Study ID not found
            observer.next(false);
          }
          observer.complete();
        };

        getRequest.onerror = (err: Event) => {
          observer.error(err);
        };
      };

      request.onerror = (err: Event) => {
        observer.error(err);
      };
    });
  }
}
