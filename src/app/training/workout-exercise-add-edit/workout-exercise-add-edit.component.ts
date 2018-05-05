import {Component, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ExerciseSet} from "../../shared/models/recorded-workout.model";

@Component({
  selector: 'app-exercise-add-edit',
  templateUrl: './workout-exercise-add-edit.component.html',
  styleUrls: ['./workout-exercise-add-edit.component.css']
})
export class WorkoutExerciseAddEditComponent implements OnInit {
  @Input() editMode: boolean;
  @Input() workoutId: string;
  @Input() inputSets: ExerciseSet[];
  @Output() outputSets: ExerciseSet[];
  exForm: FormGroup;

  constructor() { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.exForm = new FormGroup({
      'exercise': new FormControl('', Validators.required),
      // TODO: Type Ahead Search: https://github.com/AngularFirebase/89-firestore-typeahead-autocomplete
      // TODO: ExerciseSets
    });
  }
}
