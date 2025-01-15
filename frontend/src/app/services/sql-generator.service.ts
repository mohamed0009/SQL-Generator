import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Table, Column } from '../models/sql.models';

@Injectable({
  providedIn: 'root',
})
export class SqlGeneratorService {
  private apiUrl = 'http://localhost:8080/api/sql';

  constructor(private http: HttpClient) {}

  parseTextInput(text: string): Table[] {
    const lines = text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    const tables: Table[] = [];
    let currentTable: Table | null = null;

    for (const line of lines) {
      if (line.toLowerCase().startsWith('table ')) {
        if (currentTable) {
          tables.push(currentTable);
        }
        const tableName = line
          .replace(/^table\s+/i, '')
          .replace(':', '')
          .trim();
        currentTable = {
          name: tableName,
          columns: [],
        };
      } else if (line.startsWith('-') && currentTable) {
        const columnDef = line.substring(1).trim();
        const column = this.parseColumnDefinition(columnDef);
        if (column) {
          currentTable.columns.push(column);
        }
      }
    }

    if (currentTable) {
      tables.push(currentTable);
    }

    return tables;
  }

  private parseColumnDefinition(def: string): Column | null {
    const match = def.match(/(\w+)\s*\(([^)]+)\)/);
    if (!match) return null;

    const name = match[1];
    const specs = match[2].split(',').map((s) => s.trim().toLowerCase());

    const column: Column = {
      name,
      type: this.mapTypeToSQL(specs[0]),
      primaryKey: specs.includes('clé primaire'),
      autoIncrement: specs.includes('auto'),
      required: specs.includes('requis'),
      unique: specs.includes('unique'),
      defaultValue: this.extractDefaultValue(specs),
      reference: this.extractReference(specs),
    };

    return column;
  }

  private extractReference(specs: string[]): string | null {
    const refSpec = specs.find((s) => s.startsWith('référence:'));
    if (refSpec) {
      return refSpec.split(':')[1].trim();
    }
    return null;
  }

  private extractDefaultValue(specs: string[]): string | null {
    const defaultSpec = specs.find((s) => s.includes('par défaut:'));
    if (defaultSpec) {
      const value = defaultSpec.split(':')[1].trim();
      if (value === 'maintenant' || value === "aujourd'hui") {
        return 'CURRENT_TIMESTAMP';
      }
      return value;
    }
    return null;
  }

  public mapTypeToSQL(type: string): string {
    const typeMap: { [key: string]: string } = {
      entier: 'INT',
      texte: 'VARCHAR(255)',
      date: 'DATETIME',
      decimal: 'DECIMAL(10,2)',
      booleen: 'BOOLEAN',
      temps: 'TIME',
      timestamp: 'TIMESTAMP',
      long_texte: 'TEXT',
      date_seule: 'DATE',
      grand_entier: 'BIGINT',
      flottant: 'FLOAT',
      double: 'DOUBLE',
      // Direct mappings for already SQL-formatted types
      INT: 'INT',
      VARCHAR: 'VARCHAR(255)',
      DATETIME: 'DATETIME',
      DECIMAL: 'DECIMAL(10,2)',
      BOOLEAN: 'BOOLEAN',
      TIME: 'TIME',
      TIMESTAMP: 'TIMESTAMP',
      TEXT: 'TEXT',
      DATE: 'DATE',
      BIGINT: 'BIGINT',
      FLOAT: 'FLOAT',
      DOUBLE: 'DOUBLE',
    };

    // First try exact match
    if (typeMap[type]) {
      return typeMap[type];
    }

    // Then try lowercase
    const lowercaseType = type.toLowerCase();
    if (typeMap[lowercaseType]) {
      return typeMap[lowercaseType];
    }

    // If no match found, return the original type in uppercase
    return type.toUpperCase();
  }

  generateSQLFromText(text: string): Observable<string> {
    const tables = this.parseTextInput(text);
    return this.generateSQL(tables);
  }

  generateSQL(tables: Table[]): Observable<string> {
    return this.http
      .post<string>(
        `${this.apiUrl}/generate`,
        { tables },
        { responseType: 'text' as 'json' }
      )
      .pipe(catchError(this.handleError));
  }

  downloadSQL(sql: string, filename: string = 'generated-sql.sql'): void {
    const blob = new Blob([sql], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
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

  exportToJson(tables: Table[]): void {
    const jsonData = {
      tables: tables.map((table) => ({
        name: table.name,
        columns: table.columns.map((col) => ({
          name: col.name,
          type: col.type,
          primaryKey: col.primaryKey || false,
          autoIncrement: col.autoIncrement || false,
          required: col.required || false,
          unique: col.unique || false,
          reference: col.reference || null,
          defaultValue: col.defaultValue || null,
        })),
      })),
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: 'application/json',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sql-tables.json';
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
