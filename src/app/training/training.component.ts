import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit {
  routeLinks: any[];

  constructor() { }

  ngOnInit() {
    this.routeLinks = [
      {label: 'Record a Workout', link: 'record-workout'},
      {label: 'Recommend a Workout', link: 'recommend-workout'},
      {label: 'Completed Workouts', link: 'past-workouts'},
    ];
  }

}
