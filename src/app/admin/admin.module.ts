import { NgModule } from '@angular/core';
import { SharedModule} from '../shared/shared.module';
import { AvailableWorkoutAddEditComponent} from './available-workout-add-edit/available-workout-add-edit.component';
import { AvailableWorkoutsComponent} from './available-workouts/available-workouts.component';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { DeleteDialogComponent } from '../shared/delete-dialog/delete-dialog.component';
import { UsersComponent } from './users/users.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { ExercisesComponent } from './exercises/exercises.component';
import { ExerciseAddEditComponent } from './exercise-add-edit/exercise-add-edit.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DeleteDialogComponent,
    AdminComponent,
    AvailableWorkoutAddEditComponent,
    AvailableWorkoutsComponent,
    ExercisesComponent,
    ExerciseAddEditComponent,
    UsersComponent,
    UserEditComponent
  ],
  imports: [
    ReactiveFormsModule,
    SharedModule,
    AdminRoutingModule
  ],
  entryComponents: [
    DeleteDialogComponent,
    UserEditComponent
  ]
})
export class AdminModule {}
