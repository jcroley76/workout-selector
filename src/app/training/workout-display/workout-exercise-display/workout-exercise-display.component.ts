import {Component, Input, OnInit} from '@angular/core';
import {WorkoutExercise} from '../../../shared/models/recorded-workout.model';

@Component({
  selector: 'app-workout-exercise-display',
  templateUrl: './workout-exercise-display.component.html',
  styleUrls: ['./workout-exercise-display.component.css']
})
export class WorkoutExerciseDisplayComponent implements OnInit {

  @Input() workoutExercise: WorkoutExercise;

  constructor() { }

  ngOnInit() {
  }

  removeExercise() {
    console.log('removeExercise', this.workoutExercise);
  }

  editExercise() {
    console.log('editExercise', this.workoutExercise);
  }

}
