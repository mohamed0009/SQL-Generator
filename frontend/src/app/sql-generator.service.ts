import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Table, SQLDialect, ExportFormat } from './models/sql.models';

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
    return this.http
      .post<string>(
        `${this.apiUrl}/generate`,
        { tables, dialect },
        {
          responseType: 'text' as 'json',
        }
      )
      .pipe(catchError(this.handleError));
  }

  exportAs(tables: Table[], format: ExportFormat): string {
    switch (format) {
      case 'TypeScript':
        return this.generateTypeScript(tables);
      case 'Java Entity':
        return this.generateJavaEntity(tables);
      case 'JSON':
        return JSON.stringify(tables, null, 2);
      default:
        return '';
    }
  }

  private generateTypeScript(tables: Table[]): string {
    let output = '';
    tables.forEach((table) => {
      output += `interface ${this.pascalCase(table.name)} {\n`;
      table.columns.forEach((column) => {
        const type = this.mapSqlTypeToTs(column.type);
        output += `  ${column.name}${column.required ? '' : '?'}: ${type};\n`;
      });
      output += '}\n\n';
    });
    return output;
  }

  private generateJavaEntity(tables: Table[]): string {
    let output = '';
    tables.forEach((table) => {
      output += `@Entity\n@Table(name = "${table.name}")\n`;
      output += `public class ${this.pascalCase(table.name)} {\n\n`;
      table.columns.forEach((column) => {
        if (column.primaryKey) {
          output += '  @Id\n';
        }
        if (column.autoIncrement) {
          output += '  @GeneratedValue(strategy = GenerationType.IDENTITY)\n';
        }
        const type = this.mapSqlTypeToJava(column.type);
        output += `  private ${type} ${column.name};\n\n`;
      });
      output += '}\n\n';
    });
    return output;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Server returned code ${error.status}, error: ${error.error}`;
    }
    return throwError(() => errorMessage);
  }

  private pascalCase(str: string): string {
    return str
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }

  private mapSqlTypeToTs(sqlType: string): string {
    switch (sqlType.toLowerCase()) {
      case 'entier':
        return 'number';
      case 'texte':
        return 'string';
      case 'date':
        return 'Date';
      default:
        return 'any';
    }
  }

  private mapSqlTypeToJava(sqlType: string): string {
    switch (sqlType.toLowerCase()) {
      case 'entier':
        return 'Integer';
      case 'texte':
        return 'String';
      case 'date':
        return 'LocalDateTime';
      default:
        return 'Object';
    }
  }
}
