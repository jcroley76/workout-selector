import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { WorkoutExercise} from '../../../shared/models/recorded-workout.model';
import { DeleteDialogComponent } from '../../../shared/delete-dialog/delete-dialog.component';
import { RecordedWorkoutService } from '../../recorded-workout.service';

@Component({
  selector: 'app-workout-exercise-display',
  templateUrl: './workout-exercise-display.component.html',
  styleUrls: ['./workout-exercise-display.component.css']
})
export class WorkoutExerciseDisplayComponent implements OnInit {

  @Input() workoutExercise: WorkoutExercise;
  editMode = false;

  constructor(private recordedWorkoutService: RecordedWorkoutService,
              private dialog: MatDialog) { }

  ngOnInit() {
    // console.log('WorkoutExerciseDisplayComponent workoutExercise', this.workoutExercise);
  }

  removeExercise() {
    // Open Warning dialog then delete item
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.data = {
      title: this.workoutExercise.exercise.name,
      description: this.workoutExercise.exercise.movementPattern
    };

    const dialogRef = this.dialog.open(DeleteDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => {
        if (data === 'delete') {
          this.recordedWorkoutService.deleteExerciseFromWorkout(this.workoutExercise);
        }
      }
    );
  }

  editExercise() {
    console.log('editExercise', this.workoutExercise);
    if (this.workoutExercise.sets) {
      this.editMode = true;
    }
  }

  closeExerciseSets(event) {
    this.editMode = false;
  }

}
