import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {TrainingUtils} from '../../training.utils';
import {WorkoutExercise} from '../../../shared/models/recorded-workout.model';
import {RecordedWorkoutService} from '../../recorded-workout.service';

@Component({
  selector: 'app-exercise-set-manager',
  templateUrl: './exercise-set-manager.component.html',
  styleUrls: ['./exercise-set-manager.component.css']
})
export class ExerciseSetManagerComponent implements OnInit {
  @Input() workoutExercise: WorkoutExercise;
  @Output() close = new EventEmitter();
  exSetFormGroup: FormGroup;
  exerciseSetControls: FormArray;
  setCount = 0;

  constructor(private trainingUtils: TrainingUtils,
              private _fb: FormBuilder,
              private recordedWorkoutService: RecordedWorkoutService) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    const exerciseSets = this.workoutExercise.sets;
    const newForm = this._fb.group({
      exerciseSets: this._fb.array([])
    });

    const arrayControl = <FormArray>newForm.controls['exerciseSets'];
    if (exerciseSets.length > 0) {
      exerciseSets.forEach(exSet => {
        const newGroup = this.trainingUtils.initExerciseSetControls(exSet);
        arrayControl.push(newGroup);
      });
    } else {
      arrayControl.push( this.trainingUtils.initExerciseSetControls(null) );
    }

    this.setCount = arrayControl.controls.length - 1;
    // console.log('setCount', this.setCount);

    this.exSetFormGroup = newForm;
    this.exerciseSetControls = <FormArray>this.exSetFormGroup.controls['exerciseSets'];
  }

  addExerciseSet() {
    const newGroup = this.trainingUtils.initExerciseSetControls(null);
    this.exerciseSetControls.push(newGroup);
    this.setCount++;
  }

  copyExerciseSet() {
    const exSet = this.exerciseSetControls.controls[this.setCount].value;
    const copiedGroup = this.trainingUtils.initExerciseSetControls(exSet);
    this.exerciseSetControls.push(copiedGroup);
    this.setCount++;
  }

  removeExerciseSet() {
    this.exerciseSetControls.removeAt(this.setCount);
    this.setCount--;
  }

  onClear() {
    this.exSetFormGroup.reset();
    this.exerciseSetControls.reset();
    this.close.emit('true');
  }

  saveExercise() {
    const workoutExercise: WorkoutExercise = {
      exercise: this.workoutExercise.exercise,
      sets: this.exSetFormGroup.value['exerciseSets'],
    };

    this.recordedWorkoutService.saveExerciseSets(workoutExercise)
      .then( val => this.onClear() );
  }
}
