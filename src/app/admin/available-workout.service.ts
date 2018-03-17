import {AngularFirestore} from 'angularfire2/firestore';
import {Injectable} from '@angular/core';
import {AvailableWorkout} from '../shared/models/available-workout.model';

@Injectable()
export class AvailableWorkoutService {
  // private availableWorkout: AvailableWorkout;

  constructor(private db: AngularFirestore) {
  }

  fetchAvailableWorkouts() {
    // TODO: Retrieve list of all available workouts
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
