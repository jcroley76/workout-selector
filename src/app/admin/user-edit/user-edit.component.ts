import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { User } from '../../auth/user.model';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  usForm: FormGroup;
  user: User;
  email: string;

  constructor(private dialogRef: MatDialogRef<UserEditComponent>,
              @Inject(MAT_DIALOG_DATA) data) {
    this.user = data.user;
    this.usForm = new FormGroup({
      'admin': new FormControl(data.user.roles.admin),
      'trainer': new FormControl(data.user.roles.trainer),
      'subscriber': new FormControl(data.user.roles.subscriber),
    });
  }

  ngOnInit() {
  }

  saveUser() {
    console.log('this.usForm.value', this.usForm.value);
    this.user.roles = this.usForm.value;
    this.dialogRef.close({action: 'save', user: this.user});
  }

  cancel() {
    console.log('cancel called');
    this.dialogRef.close('cancel');
  }

}
