import {AngularFirestore} from 'angularfire2/firestore';
import {Injectable} from '@angular/core';
import {AvailableWorkout} from '../shared/models/available-workout.model';

@Injectable()
export class AvailableWorkoutService {
  private availableWorkout: AvailableWorkout;

  constructor(private db: AngularFirestore) {
  }

  saveAvailableWorkout(availableWorkout: AvailableWorkout) {
    this.addDataToDatabase(availableWorkout);
  }

  private addDataToDatabase(availableWorkout: AvailableWorkout) {
    this.db.collection('available-workouts').add(availableWorkout);
  }
}
