import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AlertService } from '../services/alert.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-sql-output',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  template: `
    <mat-card class="sql-output" *ngIf="sql || error" [@fadeSlide]>
      <mat-card-header>
        <mat-card-title>Generated SQL</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        @if (error) {
        <div class="error-message" [@fadeSlide]>
          <mat-icon color="warn">error</mat-icon>
          {{ error }}
        </div>
        } @if (sql) {
        <div class="sql-container" [@fadeSlide]>
          <pre><code>{{ sql }}</code></pre>
          <button
            mat-icon-button
            color="primary"
            (click)="copyToClipboard(sql); copyState = !copyState"
            class="copy-button"
            [@copyAnimation]="copyState"
          >
            <mat-icon>content_copy</mat-icon>
          </button>
        </div>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .sql-output {
        margin-top: 20px;
      }

      .error-message {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #f44336;
        margin-bottom: 15px;
      }

      .sql-container {
        position: relative;
        background-color: #1e1e1e;
        border-radius: 4px;
        padding: 16px;
      }

      pre {
        margin: 0;
        white-space: pre-wrap;
        font-family: 'Fira Code', monospace;
        font-size: 14px;
        color: #d4d4d4;
      }

      .copy-button {
        position: absolute;
        top: 8px;
        right: 8px;
        background-color: rgba(255, 255, 255, 0.1);
      }
    `,
  ],
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ transform: 'translateY(-20px)', opacity: 0 }),
        animate(
          '300ms ease-out',
          style({ transform: 'translateY(0)', opacity: 1 })
        ),
      ]),
      transition(':leave', [
        animate(
          '200ms ease-in',
          style({ transform: 'translateY(-20px)', opacity: 0 })
        ),
      ]),
    ]),
    trigger('copyAnimation', [
      transition('* => *', [
        animate('200ms ease', style({ transform: 'scale(1.1)' })),
        animate('200ms ease', style({ transform: 'scale(1)' })),
      ]),
    ]),
  ],
})
export class SqlOutputComponent {
  @Input() sql = '';
  @Input() error = '';
  protected copyState = false;

  constructor(private readonly alertService: AlertService) {}

  protected copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.alertService.info('SQL copied to clipboard');
    });
  }
}
