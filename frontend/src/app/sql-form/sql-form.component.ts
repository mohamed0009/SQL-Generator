import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';
import { SqlGeneratorService, TableRequest } from '../sql-generator.service';
import { SqlOutputComponent } from '../sql-output/sql-output.component';
import { saveAs } from 'file-saver';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AlertService } from '../services/alert.service';
import { AlertComponent } from '../components/alert/alert.component';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
} from '@angular/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-sql-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    SqlOutputComponent,
  ],
  templateUrl: './sql-form.component.html',
  styleUrls: ['./sql-form.component.scss'],
  animations: [
    trigger('columnAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate(
          '300ms ease-out',
          style({ transform: 'translateY(0)', opacity: 1 })
        ),
      ]),
      transition(':leave', [
        animate(
          '200ms ease-in',
          style({ transform: 'translateY(20px)', opacity: 0 })
        ),
      ]),
    ]),
    trigger('listAnimation', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ transform: 'translateY(20px)', opacity: 0 }),
            stagger(100, [
              animate(
                '300ms ease-out',
                style({ transform: 'translateY(0)', opacity: 1 })
              ),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class SqlFormComponent {
  protected sqlForm: FormGroup;
  protected generatedSQL = '';
  protected error = '';
  protected isLoading = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly sqlService: SqlGeneratorService,
    private readonly alertService: AlertService
  ) {
    this.sqlForm = this.fb.group({
      tableName: ['', Validators.required],
      columns: this.fb.array([]),
    });
  }

  protected get columns(): FormArray {
    return this.sqlForm.get('columns') as FormArray;
  }

  protected addColumn(): void {
    const columnGroup = this.fb.group({
      name: ['', Validators.required],
      type: ['entier', Validators.required],
      primaryKey: [false],
      autoIncrement: [false],
      required: [false],
      unique: [false],
      defaultValue: [''],
      reference: [''],
    });
    this.columns.push(columnGroup);
  }

  protected onSubmit(): void {
    if (this.sqlForm.valid && this.columns.length > 0) {
      console.log('Form data:', this.sqlForm.value); // Debug log
      const request: TableRequest = {
        tables: [
          {
            name: this.sqlForm.get('tableName')?.value,
            columns: this.columns.value,
          },
        ],
      };

      this.isLoading = true;
      this.sqlService.generateSQL(request).subscribe({
        next: (response) => {
          console.log('Response:', response); // Debug log
          this.generatedSQL = response;
          this.error = '';
          this.alertService.success('SQL generated successfully');
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error:', error); // Debug log
          this.error =
            error.message || 'An error occurred while generating SQL';
          this.generatedSQL = '';
          this.alertService.error(this.error);
          this.isLoading = false;
        },
      });
    } else {
      this.error =
        'Please add at least one column and fill all required fields';
      this.generatedSQL = '';
      this.alertService.warning(this.error);
    }
  }

  protected importJson(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          this.sqlForm.patchValue({
            tableName: json.tables[0].name,
          });

          // Clear existing columns
          while (this.columns.length) {
            this.columns.removeAt(0);
          }

          // Add columns from JSON
          json.tables[0].columns.forEach((col: any) => {
            this.columns.push(
              this.fb.group({
                name: [col.name, Validators.required],
                type: [col.type, Validators.required],
                primaryKey: [col.primaryKey || false],
                autoIncrement: [col.autoIncrement || false],
                required: [col.required || false],
                unique: [col.unique || false],
                defaultValue: [col.defaultValue || ''],
                reference: [col.reference || ''],
              })
            );
          });
          this.alertService.success('JSON imported successfully');
        } catch (error) {
          this.error = 'Invalid JSON file format';
          this.alertService.error(this.error);
        }
      };
      reader.readAsText(file);
    }
  }

  protected exportJson(): void {
    const data = {
      tables: [
        {
          name: this.sqlForm.get('tableName')?.value,
          columns: this.columns.value,
        },
      ],
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    saveAs(blob, `${data.tables[0].name}_structure.json`);
    this.alertService.success('JSON exported successfully');
  }

  protected exportSql(): void {
    if (this.generatedSQL) {
      const blob = new Blob([this.generatedSQL], { type: 'text/plain' });
      saveAs(blob, `${this.sqlForm.get('tableName')?.value}.sql`);
      this.alertService.success('SQL exported successfully');
    }
  }

  protected copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.alertService.info('SQL copied to clipboard');
    });
  }
}
