import { ExerciseSet } from '../shared/models/recorded-workout.model';
import { FormBuilder, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable()
export class TrainingUtils {

  constructor(private _fb: FormBuilder) { }

  initExerciseSetControls(exSet: ExerciseSet) {
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
}
