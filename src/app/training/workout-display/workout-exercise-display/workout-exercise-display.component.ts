import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import {ExerciseSet, WorkoutExercise} from '../../../shared/models/recorded-workout.model';
import { DeleteDialogComponent } from '../../../shared/delete-dialog/delete-dialog.component';
import { RecordedWorkoutService } from '../../recorded-workout.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';

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
        this.initExerciseSet(null)
      ])
    });

    if (exerciseSets) {
      const arrayControl = <FormArray>newForm.controls['exerciseSets'];
      exerciseSets.forEach(exSet => {
        const newGroup = this.initExerciseSet(exSet);
        arrayControl.push(newGroup);
        // this.setCount++;
      });
    }

    this.exForm = newForm;
    this.exerciseSetControls = <FormArray>this.exForm.controls['exerciseSets'];
  }

  // TODO: THis is repeated in 3 places. REFACTOR!!
  initExerciseSet(exSet: ExerciseSet) {
    const weightVal = exSet ? exSet.weight : '';
    const repsVal = exSet ? exSet.reps : '';
    return this._fb.group({
      weight: [weightVal, [
        Validators.required,
        Validators.pattern(/^[1-9]+[0-9]*$/)]
      ],
      reps: [repsVal, [
        Validators.required,
        Validators.pattern(/^[1-9]+[0-9]*$/)]
      ]
    });
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
