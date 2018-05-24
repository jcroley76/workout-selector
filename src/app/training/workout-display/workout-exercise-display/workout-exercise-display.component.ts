import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { WorkoutExercise} from '../../../shared/models/recorded-workout.model';
import { DeleteDialogComponent } from '../../../shared/delete-dialog/delete-dialog.component';
import { RecordedWorkoutService } from '../../recorded-workout.service';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { TrainingUtils } from '../../training.utils';

@Component({
  selector: 'app-workout-exercise-display',
  templateUrl: './workout-exercise-display.component.html',
  styleUrls: ['./workout-exercise-display.component.css']
})
export class WorkoutExerciseDisplayComponent implements OnInit {

  @Input() workoutExercise: WorkoutExercise;
  exForm: FormGroup;
  exerciseSetControls: FormArray;
  editMode = false;

  constructor(private recordedWorkoutService: RecordedWorkoutService,
              private _fb: FormBuilder,
              private dialog: MatDialog,
              private trainingUtils: TrainingUtils) { }

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
    // TODO:
    console.log('editExercise', this.workoutExercise);
    if (this.workoutExercise.sets) {
      this.editMode = true;
      this.initForm();
    }
  }

  initForm() {
    const exerciseSets = this.workoutExercise.sets;
    const newForm = this._fb.group({
      exerciseSets: this._fb.array([
        // this.trainingUtils.initExerciseSetControls(null)
      ])
    });

    if (exerciseSets) {
      const arrayControl = <FormArray>newForm.controls['exerciseSets'];
      exerciseSets.forEach(exSet => {
        const newGroup = this.trainingUtils.initExerciseSetControls(exSet);
        arrayControl.push(newGroup);
        // this.setCount++;
      });
    }

    this.exForm = newForm;
    this.exerciseSetControls = <FormArray>this.exForm.controls['exerciseSets'];
  }

  onClear() {
    // TODO:
    console.log('display onClear');
  }


  saveExercise() {
    // TODO:
    console.log('display saveExercise');
  }

}
