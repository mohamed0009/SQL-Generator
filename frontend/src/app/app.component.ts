import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SqlFormComponent } from './sql-form/sql-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SqlFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'SQL Generator';
}
