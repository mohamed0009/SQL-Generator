import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { fadeInUp, slideInOut } from '../animations/shared-animations';

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
  animations: [fadeInUp, slideInOut],
  template: `
    <mat-card class="sql-output-card sql-syntax" *ngIf="sql" @slideInOut>
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
        background: var(--sql-background);
        color: var(--sql-foreground);
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid rgba(78, 201, 176, 0.2);
      }

      mat-card-header {
        background: rgba(45, 45, 45, 0.7);
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba(78, 201, 176, 0.2);
      }

      .header-actions {
        display: flex;
        gap: 0.75rem;
        margin-right: -0.5rem;
      }

      mat-card-title {
        color: var(--sql-type);
        margin: 0;
        font-size: 1.1rem;
        font-weight: 500;
      }

      mat-card-content {
        padding: 1rem;
        margin: 0;
      }

      .sql-code {
        margin: 0 !important;
        padding: 1rem !important;
        background: var(--sql-background) !important;
        border-radius: 4px;
        font-family: 'Fira Code', monospace !important;
        font-size: 0.9rem !important;
        line-height: 1.5 !important;
        overflow-x: auto;
      }

      /* Prism.js Line Numbers */
      .line-numbers .line-numbers-rows {
        border-right: 1px solid rgba(78, 201, 176, 0.2) !important;
        padding: 1rem 0;

        > span::before {
          color: var(--sql-line-number) !important;
        }
      }

      /* Scrollbar Styling */
      .sql-code::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      .sql-code::-webkit-scrollbar-track {
        background: var(--sql-background);
      }

      .sql-code::-webkit-scrollbar-thumb {
        background: rgba(78, 201, 176, 0.2);
        border-radius: 4px;
      }

      .sql-code::-webkit-scrollbar-thumb:hover {
        background: rgba(78, 201, 176, 0.3);
      }

      /* Enhanced Button Styling */
      button[mat-icon-button] {
        color: var(--sql-foreground);
        position: relative;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        background: rgba(78, 201, 176, 0.1);
        border: 1px solid rgba(78, 201, 176, 0.2);
        width: 36px;
        height: 36px;
        line-height: 36px;

        &:hover {
          color: var(--sql-type);
          background: rgba(78, 201, 176, 0.15);
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

          &::after {
            opacity: 1;
            transform: scale(1);
          }
        }

        &:active {
          transform: translateY(0);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        &::after {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          border: 2px solid var(--sql-type);
          border-radius: 50%;
          opacity: 0;
          transform: scale(0.8);
          transition: all 0.3s ease;
        }

        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
          transition: transform 0.3s ease;
        }

        &:hover mat-icon {
          transform: scale(1.1);
        }
      }

      /* Custom tooltip styling */
      ::ng-deep {
        .mat-tooltip {
          background: var(--sql-background);
          color: var(--sql-type);
          font-size: 12px;
          padding: 8px 12px;
          border: 1px solid rgba(78, 201, 176, 0.2);
          border-radius: 4px;
        }
      }

      /* Success Snackbar styling */
      ::ng-deep .success-snackbar {
        background: var(--sql-background);
        color: var(--sql-type);
        border-left: 4px solid var(--sql-type);

        .mat-simple-snackbar-action {
          color: var(--sql-keyword);
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
