import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder} from '@angular/forms';
import {TrainingUtils} from '../../training.utils';

@Component({
  selector: 'app-exercise-set-manager',
  templateUrl: './exercise-set-manager.component.html',
  styleUrls: ['./exercise-set-manager.component.css']
})
export class ExerciseSetManagerComponent implements OnInit {
  @Input() exerciseSets: FormArray;
  setCount = 0;

  constructor(private trainingUtils: TrainingUtils) { }

  ngOnInit() {
    console.log('exerciseSets', this.exerciseSets);
  }

  // TODO: There may be something funky going on here. It needs testing.

  addExerciseSet() {
    // const control = <FormArray>this.exForm.controls['exerciseSets'];
    const newGroup = this.trainingUtils.initExerciseSetControls(null);
    this.exerciseSets.push(newGroup);
    this.setCount++;
  }

  copyExerciseSet() {
    // const control = <FormArray>this.exForm.controls['exerciseSets'];
    const newGroup = this.trainingUtils.initExerciseSetControls(null);
    const copiedGroup = Object.assign(newGroup, this.exerciseSets.controls[this.setCount]);
    this.exerciseSets.push(copiedGroup);
    this.setCount++;
  }

  removeExerciseSet() {
    // remove last exerciseSet from the list
    // const control = <FormArray>this.exForm.controls['exerciseSets'];
    this.exerciseSets.removeAt(this.setCount);
    this.setCount--;
  }

}
