import { NgModule } from '@angular/core';

import { TrainingComponent } from './training.component';
import { SharedModule } from '../shared/shared.module';
import { TrainingRoutingModule } from './training-routing.module';
import { PastWorkoutsComponent } from './past-workouts/past-workouts.component';
import { RecommendWorkoutComponent } from './recommend-workout/recommend-workout.component';
import { FilterContainsPipe } from '../shared/utils/filterContains.pipe';
import { RecordWorkoutComponent } from './record-workout/record-workout.component';
import { RecordedWorkoutService } from './recorded-workout.service';
import { ReactiveFormsModule } from '@angular/forms';
import { WorkoutDisplayComponent } from './workout-display/workout-display.component';
import { WorkoutExerciseAddEditComponent } from './workout-exercise-add-edit/workout-exercise-add-edit.component';
import { ExerciseSetAddEditComponent } from './workout-exercise-add-edit/exercise-set-add-edit/exercise-set-add-edit.component';
import { ExerciseService } from '../admin/exercise.service';
import { WorkoutExerciseDisplayComponent } from './workout-display/workout-exercise-display/workout-exercise-display.component';

@NgModule({
  declarations: [
    TrainingComponent,
    PastWorkoutsComponent,
    RecommendWorkoutComponent,
    FilterContainsPipe,
    RecordWorkoutComponent,
    WorkoutDisplayComponent,
    WorkoutExerciseAddEditComponent,
    ExerciseSetAddEditComponent,
    WorkoutExerciseDisplayComponent
  ],
  imports: [
    ReactiveFormsModule,
    SharedModule,
    TrainingRoutingModule
  ],
  providers: [
    FilterContainsPipe,
    RecordedWorkoutService,
    ExerciseService,
    WorkoutExerciseAddEditComponent
  ]
})
export class TrainingModule {}
