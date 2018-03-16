import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendWorkoutComponent } from './recommend-workout.component';

describe('RecommendWorkoutComponent', () => {
  let component: RecommendWorkoutComponent;
  let fixture: ComponentFixture<RecommendWorkoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecommendWorkoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendWorkoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
