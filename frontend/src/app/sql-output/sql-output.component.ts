import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from '../services/alert.service';
declare var Prism: any;

@Component({
  selector: 'app-sql-output',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sql-output" *ngIf="sql || error">
      <div class="card">
        <div class="card-header">
          <h3>Generated SQL</h3>
        </div>
        <div class="card-content">
          @if (error) {
          <div class="alert alert-error">
            <i class="fas fa-exclamation-circle"></i>
            {{ error }}
          </div>
          } @if (sql) {
          <div class="sql-container">
            <pre
              class="line-numbers"
            ><code [innerHTML]="highlightedSql" class="language-sql"></code></pre>
            <button
              class="copy-button"
              (click)="copyToClipboard(sql)"
              [class.copied]="isCopied"
              [title]="isCopied ? 'Copied!' : 'Copy to clipboard'"
            >
              <i
                class="fas"
                [class.fa-copy]="!isCopied"
                [class.fa-check]="isCopied"
              ></i>
              <span class="copy-tooltip">{{
                isCopied ? 'Copied!' : 'Copy'
              }}</span>
            </button>
          </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .sql-output {
        margin-top: 2rem;
      }

      .card {
        background-color: var(--bg-primary);
        border-radius: var(--radius);
        box-shadow: var(--shadow);
        overflow: hidden;
      }

      .card-header {
        padding: 1rem 1.5rem;
        border-bottom: 1px solid var(--border-color);
        background-color: var(--bg-secondary);

        h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 500;
          color: var(--text-primary);
        }
      }

      .card-content {
        padding: 1.5rem;
      }

      .sql-container {
        position: relative;
        border-radius: var(--radius);
        overflow: hidden;

        pre {
          margin: 0;
          padding: 1rem !important;
          background-color: #1e1e1e !important;
          border-radius: var(--radius);
          font-family: 'Fira Code', monospace;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .copy-button {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          padding: 0.5rem 0.75rem;
          border-radius: var(--radius);
          background-color: rgba(255, 255, 255, 0.1);
          border: none;
          color: #d4d4d4;
          cursor: pointer;
          transition: all var(--transition-fast);
          display: flex;
          align-items: center;
          gap: 0.5rem;

          i {
            font-size: 1rem;
          }

          .copy-tooltip {
            font-size: 0.85rem;
            font-weight: 500;
          }

          &:hover {
            background-color: rgba(255, 255, 255, 0.2);
            transform: var(--scale-hover);
          }

          &:active {
            transform: var(--scale-active);
          }

          &.copied {
            background-color: rgba(34, 197, 94, 0.2);
            color: #4ade80;
          }
        }
      }

      /* Dark mode styles */
      @media (prefers-color-scheme: dark) {
        .card-header {
          background-color: var(--dark-bg-secondary);
          border-bottom-color: var(--dark-border-color);

          h3 {
            color: var(--dark-text-primary);
          }
        }
      }

      @media (max-width: 640px) {
        .copy-button .copy-tooltip {
          display: none;
        }
      }
    `,
  ],
})
export class SqlOutputComponent implements OnChanges {
  @Input() sql = '';
  @Input() error = '';
  highlightedSql = '';
  isCopied = false;

  constructor(private alertService: AlertService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['sql'] && this.sql) {
      this.highlightedSql = Prism.highlight(
        this.sql,
        Prism.languages.sql,
        'sql'
      );
    }
  }

  copyToClipboard(text: string): void {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        this.isCopied = true;
        this.alertService.success('SQL copied to clipboard');

        // Reset the copied state after 2 seconds
        setTimeout(() => {
          this.isCopied = false;
        }, 2000);
      })
      .catch(() => {
        this.alertService.error('Failed to copy SQL');
      });
  }
}
