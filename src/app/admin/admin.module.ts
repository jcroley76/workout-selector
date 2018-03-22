import { NgModule } from '@angular/core';
import { SharedModule} from '../shared/shared.module';
import { AvailableWorkoutAddEditComponent} from './available-workout-add-edit/available-workout-add-edit.component';
import { AvailableWorkoutsComponent} from './available-workouts/available-workouts.component';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { DeleteDialogComponent } from '../shared/delete-dialog/delete-dialog.component';

@NgModule({
  declarations: [
    DeleteDialogComponent,
    AdminComponent,
    AvailableWorkoutAddEditComponent,
    AvailableWorkoutsComponent
  ],
  imports: [
    SharedModule,
    AdminRoutingModule
  ],
  entryComponents: [DeleteDialogComponent]
})
export class AdminModule {}
