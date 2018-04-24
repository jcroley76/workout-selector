import { NgModule } from '@angular/core';

import { TrainingComponent } from './training.component';
import { SharedModule } from '../shared/shared.module';
import { TrainingRoutingModule } from './training-routing.module';
import { PastWorkoutsComponent } from './past-workouts/past-workouts.component';
import { RecommendWorkoutComponent } from './recommend-workout/recommend-workout.component';
import { FilterContainsPipe } from '../shared/utils/filterContains.pipe';
import { RecordWorkoutComponent } from './record-workout/record-workout.component';
import { RecordedWorkoutService } from './recorded-workout.service';

@NgModule({
  declarations: [
    TrainingComponent,
    PastWorkoutsComponent,
    RecommendWorkoutComponent,
    FilterContainsPipe,
    RecordWorkoutComponent
  ],
  imports: [
    SharedModule,
    TrainingRoutingModule
  ],
  providers: [FilterContainsPipe, RecordedWorkoutService]
})
export class TrainingModule {}
