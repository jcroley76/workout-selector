import {Component, Input, OnInit} from '@angular/core';
import {ArrayType} from '@angular/compiler/src/output/output_ast';
import {WorkoutExercise} from '../../../shared/models/recorded-workout.model';
import {Exercise} from '../../../shared/models/exercise.model';
import {environment} from '../../../../environments/environment';
import {ExerciseService} from '../../../admin/exercise.service';

@Component({
  selector: 'app-add-exercise-to-workout',
  templateUrl: './add-exercise-to-workout.component.html',
  styleUrls: ['./add-exercise-to-workout.component.css']
})
export class AddExerciseToWorkoutComponent implements OnInit {
  @Input() inputArray: ArrayType[];
  panelOpenState = false;
  workoutExercise: WorkoutExercise;
  showSets = false;

  searchConfigEX = {
    ...environment.algolia,
    indexName: 'ngFitnessLog_Exercises'
  };

  // Inspired By:
  // https://github.com/audiBookning/autocomplete-search-angularfirebase2-5-plus/blob/master/src/app/movie-search/movie-search.component.ts

  constructor(private exerciseService: ExerciseService) {
  }

  ngOnInit() {
  }

  setPanelOpenState(val: boolean) {
    this.panelOpenState = val;
  }

  exerciseSelected(event) {
    // console.log(event);
    this.exerciseService.fetchExercise(event.item.id)
      .subscribe((ex: Exercise) => {
          // console.log('edit ex', ex);
          if (ex) {
            this.workoutExercise = {
              exercise: ex,
              sets: []
            };
            this.showSets = true;
          }
        }
      );
  }

  closeExerciseSets(event) {
    this.showSets = false;
    this.workoutExercise = null;
    this.setPanelOpenState(false);
  }
}
