import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private config: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
    panelClass: ['compact-snackbar'],
  };

  constructor(private snackBar: MatSnackBar) {}

  success(message: string, duration = 3000): void {
    this.showSnackbar(message, 'success', duration);
  }

  error(message: string, duration = 5000): void {
    this.showSnackbar(message, 'error', duration);
  }

  info(message: string, duration = 3000): void {
    this.showSnackbar(message, 'info', duration);
  }

  warning(message: string, duration = 4000): void {
    this.showSnackbar(message, 'warning', duration);
  }

  private showSnackbar(
    message: string,
    type: 'success' | 'error' | 'info' | 'warning',
    duration: number
  ): void {
    const isDarkMode = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    const config = {
      ...this.config,
      duration,
      panelClass: [
        `alert-${type}`,
        isDarkMode ? 'dark-theme' : 'light-theme',
        'compact-snackbar',
      ],
    };

    this.snackBar.open(message, 'Close', config);
  }
}
