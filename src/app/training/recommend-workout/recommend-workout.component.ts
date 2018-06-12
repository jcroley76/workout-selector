import { Component, OnInit } from '@angular/core';
import { AvailableWorkout } from '../../shared/models/available-workout.model';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-recommend-workout',
  templateUrl: './recommend-workout.component.html',
  styleUrls: ['./recommend-workout.component.css']
})
export class RecommendWorkoutComponent implements OnInit {
  searchConfigAW = {
    ...environment.algolia,
    indexName: 'ngFitnessLog_AvailableWorkouts'
  };
  showResultsAW = false;

  constructor( private router: Router) { }

  ngOnInit() {
  }

  searchChangedAW(query) {
    this.showResultsAW = true;
    // if (query.length) {
    //   this.showResultsAW = true;
    // } else {
    //   this.showResultsAW = false;
    // }
  }

  onSelectWorkout(aw: AvailableWorkout) {
    console.log('Selected Workout', aw);
    this.router.navigate(['/training/record-workout', {load: 'aw', id: aw.id}]);
  }
}
