import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { TrainingComponent } from './training.component';
import { RecordWorkoutComponent } from './record-workout/record-workout.component';
import { RecommendWorkoutComponent } from './recommend-workout/recommend-workout.component';
import { PastWorkoutsComponent } from './past-workouts/past-workouts.component';

const routes: Routes = [
  { path: 'training',
    component: TrainingComponent,
    canLoad: [AuthGuard],
    children: [
    { path: 'recommend-workout', component: RecommendWorkoutComponent },
    { path: 'past-workouts', component: PastWorkoutsComponent },
    { path: 'record-workout', component: RecordWorkoutComponent },
    { path: 'record-workout/:load/:id', component: RecordWorkoutComponent },
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingRoutingModule {}
