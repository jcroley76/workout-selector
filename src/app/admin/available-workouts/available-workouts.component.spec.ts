import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableWorkoutsComponent } from './available-workouts.component';

describe('AvailableWorkoutsComponent', () => {
  let component: AvailableWorkoutsComponent;
  let fixture: ComponentFixture<AvailableWorkoutsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvailableWorkoutsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableWorkoutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
