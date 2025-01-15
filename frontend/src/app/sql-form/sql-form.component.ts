import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { SqlOutputComponent } from '../sql-output/sql-output.component';
import { FileInputComponent } from '../components/file-input/file-input.component';
import { SqlGeneratorService } from '../services/sql-generator.service';
import { Table, Column } from '../models/sql.models';
import { cardAnimation, listAnimation } from '../animations/shared-animations';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sql-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatCardModule,
    SqlOutputComponent,
    FileInputComponent,
  ],
  templateUrl: './sql-form.component.html',
  styleUrls: ['./sql-form.component.scss'],
  animations: [cardAnimation, listAnimation],
})
export class SqlFormComponent implements OnInit {
  sqlForm!: FormGroup;
  isLoading = false;
  generatedSQL: string = '';
  currentTableIndex = 0;

  constructor(
    private fb: FormBuilder,
    private sqlService: SqlGeneratorService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.sqlForm = this.fb.group({
      tables: this.fb.array([]),
    });
  }

  get tables(): FormArray {
    return this.sqlForm.get('tables') as FormArray;
  }

  getColumns(tableIndex: number): FormArray {
    return this.tables.at(tableIndex).get('columns') as FormArray;
  }

  addTable(): void {
    const tableGroup = this.fb.group({
      tableName: ['', Validators.required],
      columns: this.fb.array([]),
    });
    this.tables.push(tableGroup);
  }

  removeTable(index: number): void {
    this.tables.removeAt(index);
  }

  addColumnToTable(tableIndex: number): void {
    const columns = this.getColumns(tableIndex);
    const columnGroup = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      primaryKey: [false],
      autoIncrement: [false],
      required: [false],
      unique: [false],
      reference: [''],
    });
    columns.push(columnGroup);
  }

  removeColumnFromTable(tableIndex: number, columnIndex: number): void {
    const columns = this.getColumns(tableIndex);
    columns.removeAt(columnIndex);
  }

  onFileUploaded(event: { content: string; type: 'text' | 'json' }): void {
    try {
      this.isLoading = true;
      let tables: Table[];

      if (event.type === 'json') {
        // Parse JSON and handle the tables array structure
        const jsonData = JSON.parse(event.content);
        tables = jsonData.tables || []; // Extract tables array from the JSON
      } else {
        tables = this.sqlService.parseTextInput(event.content);
      }

      // Clear existing tables
      while (this.tables.length) {
        this.tables.removeAt(0);
      }

      // Add tables from the imported file
      tables.forEach((table) => {
        const tableGroup = this.fb.group({
          tableName: [table.name, Validators.required],
          columns: this.fb.array([]),
        });

        const columnsArray = tableGroup.get('columns') as FormArray;

        // Add each column to the form array
        if (Array.isArray(table.columns)) {
          table.columns.forEach((column) => {
            const columnGroup = this.fb.group({
              name: [column.name, Validators.required],
              type: [
                this.sqlService.mapTypeToSQL(column.type),
                Validators.required,
              ],
              primaryKey: [column.primaryKey || false],
              autoIncrement: [column.autoIncrement || false],
              required: [column.required || false],
              unique: [column.unique || false],
              reference: [column.reference || ''],
              defaultValue: [column.defaultValue || ''],
            });
            columnsArray.push(columnGroup);
          });
        }

        this.tables.push(tableGroup);
      });

      // Generate SQL
      this.sqlService.generateSQL(tables).subscribe({
        next: (sql: string) => {
          this.generatedSQL = sql;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error generating SQL:', error);
          this.isLoading = false;
          this.snackBar.open('Error generating SQL', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],
          });
        },
      });
    } catch (error) {
      console.error('Error processing file:', error);
      this.isLoading = false;
      this.snackBar.open('Error processing file', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
    }
  }

  onSubmit(): void {
    if (this.sqlForm.valid && this.tables.length > 0) {
      this.isLoading = true;
      const formData = this.sqlForm.value;

      const tables: Table[] = formData.tables.map((table: any) => ({
        name: table.tableName,
        columns: table.columns.map((col: any) => ({
          name: col.name,
          type: col.type,
          primaryKey: col.primaryKey,
          autoIncrement: col.autoIncrement,
          required: col.required,
          unique: col.unique,
          reference: col.reference || null,
        })),
      }));

      this.sqlService.generateSQL(tables).subscribe({
        next: (sql: string) => {
          this.generatedSQL = sql;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error generating SQL:', error);
          this.isLoading = false;
        },
      });
    }
  }
}
