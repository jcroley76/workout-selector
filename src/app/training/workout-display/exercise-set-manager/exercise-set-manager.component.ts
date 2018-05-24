import {Component, Input, OnInit} from '@angular/core';
// import {ArrayType} from '@angular/compiler/src/output/output_ast';
import {FormArray, FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-exercise-set-manager',
  templateUrl: './exercise-set-manager.component.html',
  styleUrls: ['./exercise-set-manager.component.css']
})
export class ExerciseSetManagerComponent implements OnInit {
  // @Input() inputArray: ArrayType[];
  @Input() exerciseSets: FormArray;
  setCount = 0;

  constructor(private _fb: FormBuilder) { }

  ngOnInit() {
    console.log('exerciseSets', this.exerciseSets);
  }

  // TODO: THis is repeated in 3 places. REFACTOR!!
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
    // const control = <FormArray>this.exForm.controls['exerciseSets'];
    const newGroup = this.initExerciseSet();
    this.exerciseSets.push(newGroup);
    this.setCount++;
  }

  copyExerciseSet() {
    // const control = <FormArray>this.exForm.controls['exerciseSets'];
    const newGroup = this.initExerciseSet();
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
