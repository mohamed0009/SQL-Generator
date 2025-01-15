import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Table, Column } from './models/sql.models';

@Injectable({
  providedIn: 'root',
})
export class SqlGeneratorService {
  private apiUrl = 'http://localhost:8080/api/sql';

  constructor(private http: HttpClient) {}

  parseTextInput(text: string): Table[] {
    const lines = text.split('\n').map((line) => line.trim());
    const tables: Table[] = [];
    let currentTable: Table | null = null;

    for (const line of lines) {
      if (line.startsWith('table ')) {
        // New table definition
        if (currentTable) {
          tables.push(currentTable);
        }
        const tableName = line.replace('table ', '').replace(':', '').trim();
        currentTable = {
          name: tableName,
          columns: [],
        };
      } else if (line.startsWith('-') && currentTable) {
        // Column definition
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
    // Match pattern: name (type, constraints)
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
    };

    return column;
  }

  private mapTypeToSQL(type: string): string {
    const typeMap: { [key: string]: string } = {
      entier: 'INT',
      texte: 'VARCHAR(255)',
      date: 'DATETIME',
    };
    return typeMap[type] || type.toUpperCase();
  }

  private extractDefaultValue(specs: string[]): string | null {
    const defaultSpec = specs.find((s) => s.startsWith('par défaut:'));
    if (defaultSpec) {
      return defaultSpec.split(':')[1].trim();
    }
    return null;
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

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => 'Error generating SQL: ' + error.message);
  }
}
