import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Table, SQLDialect } from '../models/sql.models';

@Injectable({
  providedIn: 'root',
})
export class SqlGeneratorService {
  private apiUrl = 'http://localhost:8080/api/sql';

  constructor(private http: HttpClient) {}

  generateSQL(
    tables: Table[],
    dialect: SQLDialect = 'MySQL'
  ): Observable<string> {
    console.log('Sending request:', { tables, dialect }); // Debug log

    return this.http
      .post(
        `${this.apiUrl}/generate`,
        { tables, dialect },
        {
          responseType: 'text', // Important: expect text response
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    let errorMessage = 'An error occurred while generating SQL';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;

      if (error.status === 0) {
        errorMessage =
          'Cannot connect to the server. Please make sure the backend is running.';
      }
    }

    return throwError(() => new Error(errorMessage));
  }

  validateSQL(sql: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/validate`, { sql });
  }

  exportAsTypeScript(tables: Table[]): string {
    let output = '';
    tables.forEach((table) => {
      output += `interface ${this.pascalCase(table.name)} {\n`;
      table.columns.forEach((column) => {
        output += `  ${column.name}: ${this.mapSqlTypeToTs(column.type)};\n`;
      });
      output += '}\n\n';
    });
    return output;
  }

  private pascalCase(str: string): string {
    return str
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }

  private mapSqlTypeToTs(sqlType: string): string {
    const typeMap: Record<string, string> = {
      INTEGER: 'number',
      VARCHAR: 'string',
      TEXT: 'string',
      DATE: 'Date',
      BOOLEAN: 'boolean',
    };
    return typeMap[sqlType.toUpperCase()] || 'any';
  }
}
