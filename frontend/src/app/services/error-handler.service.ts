import { Injectable } from '@angular/core';
import { AlertService } from './alert.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor(private alertService: AlertService) {}

  handleError(error: HttpErrorResponse): void {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Server returned code ${error.status}, error: ${error.error}`;
    }

    this.alertService.error(errorMessage);
  }
}
