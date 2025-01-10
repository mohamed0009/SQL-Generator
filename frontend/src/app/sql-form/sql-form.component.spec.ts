import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SqlFormComponent } from './sql-form.component';

describe('SqlFormComponent', () => {
  let component: SqlFormComponent;
  let fixture: ComponentFixture<SqlFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SqlFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
