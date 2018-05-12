import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ExerciseService} from '../../admin/exercise.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {MatAutocompleteSelectedEvent} from '@angular/material';
import {ArrayType} from '@angular/compiler/src/output/output_ast';
import {RecordedWorkoutService} from '../recorded-workout.service';
import {RecordedWorkout, WorkoutExercise} from '../../shared/models/recorded-workout.model';
import {Subscription} from 'rxjs/Subscription';
import {Exercise} from '../../shared/models/exercise.model';

@Component({
  selector: 'app-workout-exercise-add-edit',
  templateUrl: './workout-exercise-add-edit.component.html',
  styleUrls: ['./workout-exercise-add-edit.component.css']
})
export class WorkoutExerciseAddEditComponent implements OnInit, OnDestroy {
  @Input() editMode: boolean;
  @Input() inputArray: ArrayType[]; // I think this is for incoming sets
  exForm: FormGroup;
  showSets = false;
  setCount = 0;

  recordedWorkoutSubscription: Subscription;
  currentWorkout: RecordedWorkout;

  exerciseList: Exercise[];
  selectedExercise: Exercise;
  startAt: BehaviorSubject<string | null> = new BehaviorSubject('');

  constructor(private _fb: FormBuilder,
              private exerciseService: ExerciseService,
              private recordedWorkoutService: RecordedWorkoutService) {
  }


  // TODO: Inspired By:
  // https://github.com/audiBookning/autocomplete-search-angularfirebase2-5-plus/blob/master/src/app/movie-search/movie-search.component.ts

  ngOnInit() {
    this.initForm();

    this.startAt.subscribe(start => {
      if (start) {
        this.exerciseService.searchExerciseNames(this.startAt).subscribe(exercises => {
          this.exerciseList = exercises;
        });
      }
    });

    this.recordedWorkoutSubscription = this.recordedWorkoutService.recordedWorkoutToEdit$.subscribe(
      workout => {
        if (workout) {
          console.warn('currentWorkout', workout);
          this.currentWorkout = workout;
        }
      });
  }

  ngOnDestroy() {
    if (this.recordedWorkoutSubscription) {
      this.recordedWorkoutSubscription.unsubscribe();
    }
  }

  // inspired by: https://scotch.io/tutorials/how-to-build-nested-model-driven-forms-in-angular-2
  initForm() {
    const newForm = this._fb.group({
      searchExercises: ['', [Validators.required, Validators.maxLength(25)]],
      exerciseSets: this._fb.array([
        this.initExerciseSet()
      ])
    });

    if (this.inputArray) {
      const arrayControl = <FormArray>newForm.controls['exerciseSets'];
      this.inputArray.forEach(item => {
        const newGroup = this.initExerciseSet();
        arrayControl.push(newGroup);
        this.setCount++;
      });
    }

    this.exForm = newForm;
  }

  initExerciseSet() {
    return this._fb.group({
      weight: ['', [
        Validators.required,
        Validators.pattern(/^[1-9]+[0-9]*$/)]
      ],
      reps: ['', [
        Validators.required,
        Validators.pattern(/^[1-9]+[0-9]*$/)]
      ]
    });
  }

  addExerciseSet() {
    const control = <FormArray>this.exForm.controls['exerciseSets'];
    const newGroup = this.initExerciseSet();
    control.push(newGroup);
    this.setCount++;
  }

  removeExerciseSet() {
    // remove last exerciseSet from the list
    const control = <FormArray>this.exForm.controls['exerciseSets'];
    control.removeAt(this.setCount);
    this.setCount--;
  }

  searchExercises($event) {
    this.startAt.next($event.target.value);
  }

  exerciseSelected($event: MatAutocompleteSelectedEvent) {
    this.selectedExercise = $event.source['value'];
    this.exForm.controls['searchExercises'].setValue(this.selectedExercise.name);
    this.showSets = true;
  }

  onClear() {
    this.exForm.reset();
    this.showSets = false;
  }

  saveExercise() {
    console.log('saveExercise', this.exForm.value);

    const workoutExercise: WorkoutExercise = {
      exercise: this.selectedExercise,
      sets: this.exForm.value['exerciseSets'],
    };
    this.currentWorkout.exercises = [];
    this.currentWorkout.exercises.push(workoutExercise);
    // TODO: This is still not saving correctly. Workout if formatted correctly but the DB doesn't like it :(
    console.log('currentWorkout', this.currentWorkout);
    this.recordedWorkoutService.updateDataToDatabase(this.currentWorkout.id, this.currentWorkout);
    this.onClear();
  }
}
