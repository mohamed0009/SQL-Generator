import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SqlGeneratorService } from '../services/sql-generator.service';
import { Table } from '../models/sql.models';

@Component({
  selector: 'app-sql-output',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  template: `
    <mat-card class="sql-output-card">
      <mat-card-header>
        <mat-card-title>Generated SQL</mat-card-title>
        <div class="header-actions">
          <button
            mat-icon-button
            (click)="copyToClipboard()"
            matTooltip="Copy to clipboard"
          >
            <mat-icon>content_copy</mat-icon>
          </button>
          <button
            mat-icon-button
            (click)="downloadSQL()"
            matTooltip="Download SQL"
          >
            <mat-icon>download</mat-icon>
          </button>
          <button
            mat-icon-button
            (click)="exportJson()"
            matTooltip="Export as JSON"
          >
            <mat-icon>code</mat-icon>
          </button>
        </div>
      </mat-card-header>
      <mat-card-content>
        <pre class="sql-code"><code>{{ sql }}</code></pre>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .sql-output-card {
        margin-top: 2rem;
        background: var(--sql-background);
        border: 1px solid rgba(0, 128, 102, 0.2);
      }

      mat-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: rgba(0, 128, 102, 0.05);
        border-bottom: 1px solid rgba(0, 128, 102, 0.1);
      }

      .header-actions {
        display: flex;
        gap: 0.5rem;
      }

      mat-card-content {
        padding: 1rem;
        margin: 0;
      }

      .sql-code {
        margin: 0;
        padding: 1rem;
        background: #1e1e1e;
        color: #d4d4d4;
        border-radius: 4px;
        font-family: 'Fira Code', monospace;
        font-size: 0.9rem;
        line-height: 1.5;
        overflow-x: auto;
        white-space: pre-wrap;
      }
    `,
  ],
})
export class SqlOutputComponent {
  @Input() sql: string = '';
  @Input() tables: Table[] = [];

  constructor(
    private snackBar: MatSnackBar,
    private sqlService: SqlGeneratorService
  ) {}

  copyToClipboard() {
    navigator.clipboard.writeText(this.sql).then(() => {
      this.snackBar.open('SQL copied to clipboard', 'Close', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    });
  }

  downloadSQL() {
    const blob = new Blob([this.sql], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'generated-sql.sql';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  exportJson() {
    if (this.tables.length === 0) {
      this.snackBar.open('No tables to export', 'Close', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      return;
    }

    this.sqlService.exportToJson(this.tables);
    this.snackBar.open('JSON file exported', 'Close', {
      duration: 2000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}
