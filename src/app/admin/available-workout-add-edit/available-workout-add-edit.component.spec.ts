import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableWorkoutAddEditComponent } from './available-workout-add-edit.component';

describe('AvailableWorkoutAddEditComponent', () => {
  let component: AvailableWorkoutAddEditComponent;
  let fixture: ComponentFixture<AvailableWorkoutAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvailableWorkoutAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableWorkoutAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
