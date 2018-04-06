import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  routeLinks: any[];

  ngOnInit(): void {
    this.routeLinks = [
      // {label: 'Admin', link: '/admin'},
      {label: 'Available Workouts', link: 'available-workouts'},
      {label: 'Add Workout', link: 'available-workout-add-edit'},
      {label: 'Exercises', link: 'exercises'},
      {label: 'Add Exercise', link: 'exercise-add-edit'}
    ];
  }
}
