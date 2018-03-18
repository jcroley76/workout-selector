import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { AvailableWorkout } from '../shared/models/available-workout.model';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs';

@Injectable()
export class AvailableWorkoutService {
  // private availableWorkout: AvailableWorkout;
  availableWorkoutsChanged = new Subject<AvailableWorkout[]>();
  startedEditing = new Subject<AvailableWorkout>();
  private fbSubs: Subscription[] = [];

  constructor(private db: AngularFirestore) {
  }

  fetchAvailableWorkouts() {
    this.fbSubs.push(this.db
      .collection('available-workouts')
      .valueChanges()
      .subscribe((availableWorkouts: AvailableWorkout[]) => {
        this.availableWorkoutsChanged.next(availableWorkouts);
      }));
  }

  searchAvailableWorkouts() {
    // TODO: Find available workout based upon criteria
  }

  addAvailableWorkout(availableWorkout: AvailableWorkout) {
    this.addDataToDatabase(availableWorkout);
  }

  updateAvailableWorkout(availableWorkout: AvailableWorkout) {
    this.addDataToDatabase(availableWorkout);
  }

  private addDataToDatabase(availableWorkout: AvailableWorkout) {
    console.log('Available-Workout adding: ', availableWorkout);
    this.db.collection('available-workouts').add(availableWorkout);
  }
}
