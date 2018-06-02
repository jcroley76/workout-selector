import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ExerciseService} from '../../../admin/exercise.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {MatAutocompleteSelectedEvent} from '@angular/material';
import {ArrayType} from '@angular/compiler/src/output/output_ast';
import {WorkoutExercise} from '../../../shared/models/recorded-workout.model';
import {Exercise} from '../../../shared/models/exercise.model';

@Component({
  selector: 'app-add-exercise-to-workout',
  templateUrl: './add-exercise-to-workout.component.html',
  styleUrls: ['./add-exercise-to-workout.component.css']
})
export class AddExerciseToWorkoutComponent implements OnInit {
  @Input() inputArray: ArrayType[];
  panelOpenState = false;
  exForm: FormGroup;
  workoutExercise: WorkoutExercise;
  showSets = false;
  exerciseList: Exercise[];
  selectedExercise: Exercise;
  startAt: BehaviorSubject<string | null> = new BehaviorSubject('');

  constructor(private _fb: FormBuilder,
              private exerciseService: ExerciseService) {
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

    this.initForm();
  }

  initForm() {
    const newForm = this._fb.group({
      searchExercises: ['', [Validators.required, Validators.maxLength(25)]],
    });
    this.exForm = newForm;
  }

  setPanelOpenState(val: boolean) {
    this.panelOpenState = val;
  }

  searchExercises($event) {
    this.startAt.next($event.target.value);
  }

  exerciseSelected($event: MatAutocompleteSelectedEvent) {
    this.selectedExercise = $event.source['value'];
    this.exForm.controls['searchExercises'].setValue(this.selectedExercise.name);
    this.workoutExercise = {
      exercise: this.selectedExercise,
      sets: []
    };
    this.showSets = true;
  }

  closeExerciseSets(event) {
    this.showSets = false;
    this.selectedExercise = null;
    this.workoutExercise = null;
    this.exForm.reset();
    this.setPanelOpenState(false);
  }
}
