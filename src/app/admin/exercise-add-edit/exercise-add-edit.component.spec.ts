import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseAddEditComponent } from './exercise-add-edit.component';

describe('ExerciseAddEditComponent', () => {
  let component: ExerciseAddEditComponent;
  let fixture: ComponentFixture<ExerciseAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExerciseAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciseAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
