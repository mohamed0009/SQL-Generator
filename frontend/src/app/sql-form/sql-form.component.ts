import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SqlGeneratorService } from '../services/sql-generator.service';
import { AlertService } from '../services/alert.service';
import { SqlOutputComponent } from '../sql-output/sql-output.component';
import { finalize } from 'rxjs/operators';
import { Table, SQLDialect, columnTemplates } from '../models/sql.models';
import { HistoryService } from '../services/history.service';
import { Observable } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-sql-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatCardModule,
    MatProgressSpinnerModule,
    SqlOutputComponent,
  ],
  templateUrl: './sql-form.component.html',
  styleUrls: ['./sql-form.component.scss'],
  animations: [
    trigger('columnAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate(
          '200ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '200ms ease-in',
          style({ opacity: 0, transform: 'translateY(-20px)' })
        ),
      ]),
    ]),
  ],
})
export class SqlFormComponent {
  sqlForm!: FormGroup;
  isLoading = false;
  generatedSQL = '';
  error = '';
  canUndo$: Observable<boolean>;
  canRedo$: Observable<boolean>;

  constructor(
    private fb: FormBuilder,
    private sqlService: SqlGeneratorService,
    private alertService: AlertService,
    private historyService: HistoryService,
    private snackBar: MatSnackBar
  ) {
    this.initForm();
    this.canUndo$ = this.historyService.canUndo$;
    this.canRedo$ = this.historyService.canRedo$;
  }

  private initForm(): void {
    this.sqlForm = this.fb.group({
      tableName: ['', Validators.required],
      dialect: ['MySQL', Validators.required],
      columns: this.fb.array([]),
    });
  }

  get columns(): FormArray {
    return this.sqlForm.get('columns') as FormArray;
  }

  protected addColumn(): void {
    const column = this.fb.group({
      name: ['', Validators.required],
      type: ['entier', Validators.required],
      primaryKey: [false],
      autoIncrement: [false],
      required: [false],
      unique: [false],
      reference: [''],
    });
    this.columns.push(column);
  }

  protected removeColumn(index: number): void {
    this.columns.removeAt(index);
  }

  protected addTemplateColumn(type: keyof typeof columnTemplates): void {
    const template = columnTemplates[type];
    const column = this.fb.group({
      name: [template.name, Validators.required],
      type: [template.type, Validators.required],
      primaryKey: [template.primaryKey ?? false],
      autoIncrement: [template.autoIncrement ?? false],
      required: [template.required ?? false],
      unique: [template.unique ?? false],
      reference: [''],
    });
    this.columns.push(column);
  }

  protected onSubmit(): void {
    if (this.sqlForm.valid && this.columns.length > 0) {
      const tables: Table[] = [
        {
          name: this.sqlForm.get('tableName')?.value,
          columns: this.columns.value.map((col: any) => ({
            name: col.name,
            type: col.type,
            primaryKey: !!col.primaryKey,
            autoIncrement: !!col.autoIncrement,
            required: !!col.required,
            unique: !!col.unique,
            reference: col.reference || null,
            defaultValue: col.defaultValue || null,
          })),
        },
      ];

      const dialect: SQLDialect = this.sqlForm.get('dialect')?.value;

      this.isLoading = true;
      this.error = '';
      console.log('Submitting tables:', tables);

      this.sqlService
        .generateSQL(tables, dialect)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: (sql) => {
            console.log('Generated SQL:', sql);
            this.generatedSQL = sql;
            this.snackBar.open('SQL generated successfully!', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar'],
            });
          },
          error: (err) => {
            console.error('SQL Generation Error:', err);
            this.error = err.message || 'Failed to generate SQL';
            this.snackBar.open(this.error, 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar'],
            });
          },
        });
    } else {
      this.snackBar.open(
        'Please fill in all required fields and add at least one column',
        'Close',
        {
          duration: 3000,
          panelClass: ['error-snackbar'],
        }
      );
    }
  }

  protected importJson(event: any): void {
    const file = event.target.files[0];
    if (!file) {
      this.snackBar.open('No file selected', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      return;
    }

    if (!file.name.toLowerCase().endsWith('.json')) {
      this.snackBar.open('Please select a JSON file', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        console.log('Parsed JSON:', json);

        // Check if it's a tables array structure
        if (!Array.isArray(json.tables) || json.tables.length === 0) {
          throw new Error('No tables found in JSON');
        }

        // Get the first table (or you could add UI to let user choose which table to import)
        const table = json.tables[0];

        if (!table.name || !Array.isArray(table.columns)) {
          throw new Error('Invalid table structure');
        }

        // Reset form with the table data
        this.sqlForm.patchValue({
          tableName: table.name,
          dialect: json.dialect || 'MySQL',
        });

        // Clear existing columns
        while (this.columns.length) {
          this.columns.removeAt(0);
        }

        // Add columns from JSON
        table.columns.forEach((column: any) => {
          if (!column.name || !column.type) {
            throw new Error('Column missing required fields');
          }

          this.columns.push(
            this.fb.group({
              name: [column.name, Validators.required],
              type: [column.type, Validators.required],
              primaryKey: [!!column.primaryKey],
              autoIncrement: [!!column.autoIncrement],
              required: [!!column.required],
              unique: [!!column.unique],
              reference: [column.reference || ''],
            })
          );
        });

        this.snackBar.open('JSON imported successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['success-snackbar'],
        });
      } catch (error) {
        console.error('Import error:', error);
        this.snackBar.open(
          `Invalid JSON format: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`,
          'Close',
          {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['error-snackbar'],
          }
        );
      }
    };

    reader.readAsText(file);
  }

  protected exportJson(): void {
    const formValue = this.sqlForm.value;
    const jsonData = {
      tableName: formValue.tableName,
      dialect: formValue.dialect,
      columns: formValue.columns,
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: 'application/json',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${formValue.tableName}_schema.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  protected exportSql(): void {
    if (this.generatedSQL) {
      const blob = new Blob([this.generatedSQL], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${this.sqlForm.get('tableName')?.value}_schema.sql`;
      link.click();
      window.URL.revokeObjectURL(url);
    }
  }

  protected undo(): void {
    const previousState = this.historyService.undo();
    if (previousState) {
      this.updateFormState(previousState);
    }
  }

  protected redo(): void {
    const nextState = this.historyService.redo();
    if (nextState) {
      this.updateFormState(nextState);
    }
  }

  private updateFormState(state: any): void {
    this.sqlForm.patchValue({
      tableName: state.tableName,
      dialect: state.dialect,
    });
    this.columns.clear();
    state.columns.forEach((column: any) => {
      this.columns.push(this.fb.group(column));
    });
  }
}
