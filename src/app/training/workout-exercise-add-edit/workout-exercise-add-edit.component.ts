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
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-workout-exercise-add-edit',
  templateUrl: './workout-exercise-add-edit.component.html',
  styleUrls: ['./workout-exercise-add-edit.component.css']
})
export class WorkoutExerciseAddEditComponent implements OnInit, OnDestroy {
  @Input() inputArray: ArrayType[]; // I think this is for incoming sets
  panelOpenState = false;
  exForm: FormGroup;
  id: string;
  showSets = false;
  setCount = 0;

  currentWorkoutSubscription: Subscription;
  currentWorkout: RecordedWorkout;

  exerciseList: Exercise[];
  selectedExercise: Exercise;
  startAt: BehaviorSubject<string | null> = new BehaviorSubject('');

  constructor(private _fb: FormBuilder,
              private route: ActivatedRoute,
              private exerciseService: ExerciseService,
              private recordedWorkoutService: RecordedWorkoutService) {
  }


  // Inspired By:
  // https://github.com/audiBookning/autocomplete-search-angularfirebase2-5-plus/blob/master/src/app/movie-search/movie-search.component.ts

  ngOnInit() {
    this.startAt.subscribe(start => {
      if (start) {
        this.exerciseService.searchExerciseNames(this.startAt).subscribe(exercises => {
          this.exerciseList = exercises;
        });
      }
    });

    // TODO: This works but the same code appears in workout-display-component.ts.
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
      }
    );

    this.currentWorkoutSubscription = this.recordedWorkoutService.currentWorkoutSubject$.subscribe(
      rw => {
        if (rw) {
          this.currentWorkout = rw;
        }
      });
    this.fetchCurrentWorkout();

    this.initForm();
  }

  ngOnDestroy() {
    if (this.currentWorkoutSubscription) {
      this.currentWorkoutSubscription.unsubscribe();
    }
  }

  fetchCurrentWorkout() {
    this.recordedWorkoutService.setCurrentWorkout(this.id);
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

  togglePanel() {
    this.panelOpenState = !this.panelOpenState;
    console.log('panelOpenState', this.panelOpenState);
  }

  addExerciseSet() {
    const control = <FormArray>this.exForm.controls['exerciseSets'];
    const newGroup = this.initExerciseSet();
    control.push(newGroup);
    this.setCount++;
  }

  copyExerciseSet() {
    const control = <FormArray>this.exForm.controls['exerciseSets'];
    const newGroup = this.initExerciseSet();
    const copiedGroup = Object.assign(newGroup, control.controls[this.setCount]);
    control.push(copiedGroup);
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
    // console.log('currentWorkout.exercises.length', this.currentWorkout.exercises.length);
    if (!this.currentWorkout.exercises || this.currentWorkout.exercises.length === 0) {
      this.currentWorkout.exercises = [];
    }
    this.currentWorkout.exercises.push(workoutExercise);

    console.log('currentWorkout', this.currentWorkout);
    this.recordedWorkoutService.saveExerciseSets(this.currentWorkout);
    this.onClear();
    // TODO: This will cause and endless loop because of the [expanded] property of the expansion panel
    // this.togglePanel();
  }

}
