import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';

export interface Alert {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private alertSubject = new BehaviorSubject<Alert | null>(null);
  alert$ = this.alertSubject.asObservable();

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
    type: Alert['type'],
    duration: number
  ): void {
    const panelClass = `alert-${type}`;
    this.snackBar.open(message, 'Close', {
      duration,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [panelClass],
    });
  }
}
