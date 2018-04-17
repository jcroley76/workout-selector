import { NgModule } from '@angular/core';

import { TrainingComponent } from './training.component';
import { SharedModule } from '../shared/shared.module';
import { TrainingRoutingModule } from './training-routing.module';
import { PastWorkoutsComponent } from './past-workouts/past-workouts.component';
import { RecommendWorkoutComponent } from './recommend-workout/recommend-workout.component';
import { FilterPipe } from '../shared/filter.pipe';

@NgModule({
  declarations: [
    TrainingComponent,
    PastWorkoutsComponent,
    RecommendWorkoutComponent,
    FilterPipe
  ],
  imports: [
    SharedModule,
    TrainingRoutingModule
  ],
  providers: [FilterPipe]
})
export class TrainingModule {}
