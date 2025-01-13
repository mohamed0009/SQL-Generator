import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

declare var Prism: any;

@Component({
  selector: 'app-sql-output',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
  ],
  template: `
    <mat-card class="sql-output-card" *ngIf="sql">
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
        </div>
      </mat-card-header>
      <mat-card-content>
        <pre
          class="sql-code line-numbers"
        ><code class="language-sql" [innerHTML]="highlightedSQL"></code></pre>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .sql-output-card {
        margin-top: 2rem;
        background: #1e1e1e;
        color: #d4d4d4;
        border-radius: 8px;
        overflow: hidden;
      }

      mat-card-header {
        background: #2d2d2d;
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .header-actions {
        display: flex;
        gap: 0.5rem;
      }

      mat-card-title {
        color: #fff;
        margin: 0;
        font-size: 1.1rem;
      }

      mat-card-content {
        padding: 1rem;
        margin: 0;
      }

      .sql-code {
        margin: 0 !important;
        padding: 1rem !important;
        background: #1e1e1e !important;
        border-radius: 4px;
        font-family: 'Fira Code', 'Consolas', monospace !important;
        font-size: 0.9rem !important;
        line-height: 1.5 !important;
        overflow-x: auto;
      }

      /* Prism.js Line Numbers */
      .line-numbers .line-numbers-rows {
        border-right: 1px solid #404040 !important;
        padding: 1rem 0;
      }

      /* Scrollbar Styling */
      .sql-code::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      .sql-code::-webkit-scrollbar-track {
        background: #1e1e1e;
      }

      .sql-code::-webkit-scrollbar-thumb {
        background: #424242;
        border-radius: 4px;
      }

      .sql-code::-webkit-scrollbar-thumb:hover {
        background: #4f4f4f;
      }

      /* Button Styling */
      button[mat-icon-button] {
        color: #d4d4d4;
      }

      button[mat-icon-button]:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.1);
      }

      /* Token colors for SQL syntax */
      :host ::ng-deep {
        .token.keyword {
          color: #569cd6 !important;
        }
        .token.function {
          color: #dcdcaa !important;
        }
        .token.string {
          color: #ce9178 !important;
        }
        .token.number {
          color: #b5cea8 !important;
        }
        .token.operator {
          color: #d4d4d4 !important;
        }
        .token.punctuation {
          color: #d4d4d4 !important;
        }
        .token.comment {
          color: #6a9955 !important;
        }
      }
    `,
  ],
})
export class SqlOutputComponent implements OnChanges {
  @Input() sql: string = '';
  highlightedSQL: string = '';

  constructor(private snackBar: MatSnackBar) {}

  ngOnChanges() {
    if (this.sql) {
      this.highlightedSQL = Prism.highlight(
        this.sql,
        Prism.languages.sql,
        'sql'
      );
      // Allow Prism to update line numbers
      setTimeout(() => {
        Prism.highlightAll();
      });
    }
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.sql).then(() => {
      this.snackBar.open('SQL copied to clipboard', 'Close', {
        duration: 2000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['success-snackbar'],
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
}
