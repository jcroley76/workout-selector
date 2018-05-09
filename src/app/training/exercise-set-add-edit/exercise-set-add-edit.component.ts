import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-exercise-set-add-edit',
  templateUrl: './exercise-set-add-edit.component.html',
  styleUrls: ['./exercise-set-add-edit.component.css']
})
export class ExerciseSetAddEditComponent {
  // Inspired by: https://stackoverflow.com/questions/38007236/how-to-dynamically-add-and-remove-form-fields-in-angular-2
  @Input() exerciseSetForm: FormGroup;

}
