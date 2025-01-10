import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <div class="alert" [class]="type" *ngIf="show">
      <mat-icon>{{ getIcon() }}</mat-icon>
      <span class="message">{{ message }}</span>
      <button mat-icon-button (click)="show = false">
        <mat-icon>close</mat-icon>
      </button>
    </div>
  `,
  styles: [
    `
      .alert {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        border-radius: 4px;
        margin: 8px 0;
        animation: slideIn 0.3s ease-out;
      }

      .message {
        margin: 0 12px;
        flex: 1;
      }

      .success {
        background-color: #e8f5e9;
        color: #2e7d32;
      }

      .error {
        background-color: #ffebee;
        color: #c62828;
      }

      .warning {
        background-color: #fff3e0;
        color: #ef6c00;
      }

      .info {
        background-color: #e3f2fd;
        color: #1565c0;
      }

      @keyframes slideIn {
        from {
          transform: translateY(-100%);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
    `,
  ],
})
export class AlertComponent {
  @Input() type: 'success' | 'error' | 'info' | 'warning' = 'info';
  @Input() message = '';
  protected show = true;

  protected getIcon(): string {
    const icons = {
      success: 'check_circle',
      error: 'error',
      warning: 'warning',
      info: 'info',
    };
    return icons[this.type];
  }
}
