import {Component, OnDestroy, OnInit} from '@angular/core';
import { AvailableWorkoutService } from '../../admin/available-workout.service';
import { Subscription } from 'rxjs/Subscription';
import { AvailableWorkout } from '../../shared/models/available-workout.model';

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

  constructor( private availableWorkoutService: AvailableWorkoutService) { }

  ngOnInit() {
    this.awChangedSubscription = this.availableWorkoutService.availableWorkoutsChanged$.subscribe(
      (availableWorkouts: AvailableWorkout[]) => {
        console.log('availableWorkouts', availableWorkouts);
        this.availableWorkouts = availableWorkouts;
        // this.applyFilters();
      }
    );
    this.availableWorkoutService.fetchAvailableWorkouts();
  }

  ngOnDestroy() {
    if (this.awChangedSubscription) {
      this.awChangedSubscription.unsubscribe();
    }
  }

  /// checks if object is present in array
  isPresent(array, item) {
    return array.some(el => {
      return el.id === item.id;
    });
  }

  // TODO: Move this to some type of shared service
  filterContains(searchText: string) {
    this.filteredWorkouts = [];
    this.availableWorkouts
      .filter( it => {
        for (const prop in it) {
          if (it[prop]) {
            if (Array.isArray(it[prop])) {
              it[prop].forEach(item => {
                if (item.toLowerCase().includes(searchText)) {
                  if (!this.isPresent(this.filteredWorkouts, it)) {
                    this.filteredWorkouts.push(it);
                  }
                }
              });
            } else {
              if (it[prop].toLowerCase().includes(searchText)) {
                if (!this.isPresent(this.filteredWorkouts, it)) {
                  this.filteredWorkouts.push(it);
                }
              }
            }
          }
        }
      });
  }

  /// removes filter
  removeFilter() {
    this.filteredWorkouts = [];
    this.searchText = '';
  }
}
