import { NgModule } from '@angular/core';

import { TrainingComponent } from './training.component';
import { SharedModule } from '../shared/shared.module';
import { TrainingRoutingModule } from './training-routing.module';
import { PastWorkoutsComponent } from './past-workouts/past-workouts.component';
import { RecommendWorkoutComponent } from './recommend-workout/recommend-workout.component';

@NgModule({
  declarations: [
    TrainingComponent,
    PastWorkoutsComponent,
    RecommendWorkoutComponent
  ],
  imports: [
    SharedModule,
    TrainingRoutingModule
  ]
})
export class TrainingModule {}
