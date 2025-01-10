import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, map } from 'rxjs';

export interface Column {
  name: string;
  type: string;
  primaryKey: boolean;
  autoIncrement: boolean;
  required: boolean;
  unique: boolean;
  defaultValue?: string;
  reference?: string;
}

export interface Table {
  name: string;
  columns: Column[];
}

export interface TableRequest {
  tables: Table[];
}

@Injectable({
  providedIn: 'root',
})
export class SqlGeneratorService {
  private apiUrl = 'http://localhost:8080/api/sql';

  constructor(private http: HttpClient) {}

  generateSQL(request: TableRequest): Observable<string> {
    console.log('Sending request:', request);
    return this.http
      .post(`${this.apiUrl}/generate/simple`, request, {
        responseType: 'text', // Explicitly request text response
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error:', error);
          return throwError(
            () => error.error?.message || 'Failed to generate SQL'
          );
        })
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.status === 0) {
      // Network error
      errorMessage =
        'Cannot connect to server. Please make sure the backend is running.';
    } else {
      // Backend error
      errorMessage = `Server returned code ${error.status}, error: ${error.error}`;
    }
    return throwError(() => errorMessage);
  }
}
