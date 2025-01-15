import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-file-input',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="file-input-container">
      <input
        type="file"
        #textFileInput
        accept=".txt"
        (change)="onFileSelected($event, 'text')"
        style="display: none"
      />
      <input
        type="file"
        #jsonFileInput
        accept=".json"
        (change)="onFileSelected($event, 'json')"
        style="display: none"
      />

      <div class="button-group">
        <button
          mat-raised-button
          color="primary"
          (click)="textFileInput.click()"
        >
          <mat-icon>upload_file</mat-icon>
          Upload Text File
        </button>

        <button
          mat-stroked-button
          color="accent"
          (click)="jsonFileInput.click()"
        >
          <mat-icon>code</mat-icon>
          Import JSON
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .file-input-container {
        margin: 1rem 0;
        text-align: center;
      }

      .button-group {
        display: flex;
        gap: 1rem;
        justify-content: center;
      }
    `,
  ],
})
export class FileInputComponent {
  @Output() fileContent = new EventEmitter<{
    content: string;
    type: 'text' | 'json';
  }>();

  constructor(private snackBar: MatSnackBar) {}

  onFileSelected(event: any, type: 'text' | 'json'): void {
    const file = event.target.files[0];
    if (!file) return;

    if (type === 'text' && !file.name.endsWith('.txt')) {
      this.snackBar.open('Please select a .txt file', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      return;
    }

    if (type === 'json' && !file.name.endsWith('.json')) {
      this.snackBar.open('Please select a .json file', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        if (content) {
          if (type === 'json') {
            // Validate JSON
            JSON.parse(content);
          }
          this.fileContent.emit({ content, type });
          this.snackBar.open('File loaded successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });
        }
      } catch (error) {
        this.snackBar.open(
          type === 'json' ? 'Invalid JSON file' : 'Error reading file',
          'Close',
          {
            duration: 3000,
            panelClass: ['error-snackbar'],
          }
        );
      }
    };

    reader.onerror = () => {
      this.snackBar.open('Error reading file', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
    };

    reader.readAsText(file);
  }
}
