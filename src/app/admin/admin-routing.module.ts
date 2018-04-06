import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { AuthGuard } from '../auth/auth.guard';
import { AvailableWorkoutsComponent } from './available-workouts/available-workouts.component';
import { AvailableWorkoutAddEditComponent } from './available-workout-add-edit/available-workout-add-edit.component';
import { ExercisesComponent } from './exercises/exercises.component';
import { ExerciseAddEditComponent } from './exercise-add-edit/exercise-add-edit.component';

const routes: Routes = [
  { path: 'admin',
    component: AdminComponent,
    canLoad: [AuthGuard], // TODO: Change to AdminGuard
    children: [
      { path: 'available-workouts', component: AvailableWorkoutsComponent },
      { path: 'available-workout-add-edit', component: AvailableWorkoutAddEditComponent },
      { path: 'available-workout-add-edit/:id', component: AvailableWorkoutAddEditComponent },
      { path: 'exercises', component: ExercisesComponent },
      { path: 'exercise-add-edit', component: ExerciseAddEditComponent },
      { path: 'exercise-add-edit/:id', component: ExerciseAddEditComponent },
    ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
