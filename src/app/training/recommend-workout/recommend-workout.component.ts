import {Component, OnDestroy, OnInit} from '@angular/core';
import { AvailableWorkoutService } from '../../admin/available-workout.service';
import { Subscription } from 'rxjs/Subscription';
import { AvailableWorkout } from '../../shared/models/available-workout.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recommend-workout',
  templateUrl: './recommend-workout.component.html',
  styleUrls: ['./recommend-workout.component.css']
})
export class RecommendWorkoutComponent implements OnInit, OnDestroy {
  private awChangedSubscription: Subscription;
  searchText = '';
  availableWorkouts: AvailableWorkout[];
  filteredWorkouts: AvailableWorkout[];

  constructor( private availableWorkoutService: AvailableWorkoutService,
               private router: Router) { }

  ngOnInit() {
    this.awChangedSubscription = this.availableWorkoutService.availableWorkoutsChanged$.subscribe(
      (availableWorkouts: AvailableWorkout[]) => {
        console.log('availableWorkouts', availableWorkouts);
        this.availableWorkouts = availableWorkouts;
      }
    );
    this.availableWorkoutService.fetchAvailableWorkouts();
  }

  ngOnDestroy() {
    if (this.awChangedSubscription) {
      this.awChangedSubscription.unsubscribe();
    }
  }

  onSelectWorkout(aw: AvailableWorkout) {
    console.log('Selected Workout', aw);
    this.router.navigate(['/training/record-workout', aw.id]);
  }

  filterContains() {
    this.filteredWorkouts = this.availableWorkouts;
  }

  /// removes filter
  removeFilter() {
    this.filteredWorkouts = [];
    this.searchText = '';
  }
}
