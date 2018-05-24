import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ExerciseService} from '../../../admin/exercise.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {MatAutocompleteSelectedEvent} from '@angular/material';
import {ArrayType} from '@angular/compiler/src/output/output_ast';
import {RecordedWorkoutService} from '../../recorded-workout.service';
import {RecordedWorkout, WorkoutExercise} from '../../../shared/models/recorded-workout.model';
import {Subscription} from 'rxjs/Subscription';
import {Exercise} from '../../../shared/models/exercise.model';
import {ActivatedRoute, Params} from '@angular/router';
import {TrainingUtils} from '../../training.utils';

@Component({
  selector: 'app-add-exercise-to-workout',
  templateUrl: './add-exercise-to-workout.component.html',
  styleUrls: ['./add-exercise-to-workout.component.css']
})
export class AddExerciseToWorkoutComponent implements OnInit, OnDestroy {
  @Input() inputArray: ArrayType[];
  panelOpenState = false;
  exForm: FormGroup;
  exerciseSetControls: FormArray;
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
              private trainingUtils: TrainingUtils,
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
        this.trainingUtils.initExerciseSetControls(null)
      ])
    });

    // if (this.inputArray) {
    //   const arrayControl = <FormArray>newForm.controls['exerciseSets'];
    //   this.inputArray.forEach(item => {
    //     const newGroup = this.initExerciseSet();
    //     arrayControl.push(newGroup);
    //     this.setCount++;
    //   });
    // }

    this.exForm = newForm;
    this.exerciseSetControls = <FormArray>this.exForm.controls['exerciseSets'];
  }

  setPanelOpenState(val: boolean) {
    this.panelOpenState = val;
    if (this.panelOpenState === false) {
      this.onClear();
    }
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
    this.exerciseSetControls.reset();
    this.showSets = false;
  }

  saveExercise() {
    const workoutExercise: WorkoutExercise = {
      exercise: this.selectedExercise,
      sets: this.exForm.value['exerciseSets'],
    };
    if (!this.currentWorkout.exercises || this.currentWorkout.exercises.length === 0) {
      this.currentWorkout.exercises = [];
    }
    this.currentWorkout.exercises.push(workoutExercise);

    console.log('saving Workout', this.currentWorkout);
    this.recordedWorkoutService.saveExerciseSets(this.currentWorkout);
    this.setPanelOpenState(false);
  }

}
