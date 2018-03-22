import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs';

import { AvailableWorkout } from '../shared/models/available-workout.model';
import { UIService } from '../shared/ui.service';

@Injectable()
export class AvailableWorkoutService {
  availableWorkoutsChanged = new Subject<AvailableWorkout[]>();
  availableWorkoutToEdit = new Subject<AvailableWorkout>();
  private availableWorkouts: AvailableWorkout[] = [];
  private fbSubs: Subscription[] = [];

  constructor(private db: AngularFirestore, private uiService: UIService) {
  }

  fetchAvailableWorkouts() {
    this.uiService.loadingStateChanged.next(true);
    this.fbSubs.push(this.db
      .collection('available-workouts')
      .snapshotChanges()
      .map(docArray => {
        // throw(new Error());
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            title: doc.payload.doc.data().title,
            description: doc.payload.doc.data().description,
            sources: doc.payload.doc.data().sources,
            equipment: doc.payload.doc.data().equipment,
            type: doc.payload.doc.data().type,
            emphasis: doc.payload.doc.data().emphasis,
            record: doc.payload.doc.data().record
          };
        });
      })
      .subscribe((availableWorkouts: AvailableWorkout[]) => {
        this.uiService.loadingStateChanged.next(false);
        this.availableWorkouts = availableWorkouts;
        this.availableWorkoutsChanged.next([...this.availableWorkouts]);
      }, error => {
        this.uiService.loadingStateChanged.next(false);
        this.uiService.showSnackbar('Fetching Workouts failed, please try again later', null, 3000);
        this.availableWorkoutsChanged.next(null);
      }));
  }

  searchAvailableWorkouts() {
    // TODO: Find available workout based upon criteria
  }

  saveAvailableWorkout(availableWorkout: AvailableWorkout) {
    if (availableWorkout.id) {
      this.updateDataToDatabase(availableWorkout);
    } else {
      this.addDataToDatabase(availableWorkout);
    }
  }

  deleteAvailableWorkout(availableWorkout: AvailableWorkout) {
    this.deleteFromDatabase(availableWorkout);
  }

  private addDataToDatabase(availableWorkout: AvailableWorkout) {
    this.db.collection('available-workouts').add(availableWorkout)
      .then(function(docRef) {
        console.log('Available Workout written with ID: ', docRef.id);
      })
      .catch(function(error) {
        console.error('Error adding Available Workout: ', error);
      });
  }

  private updateDataToDatabase(availableWorkout: AvailableWorkout) {
    const awRef = this.db.collection('available-workouts').doc(availableWorkout.id);
    console.log('awRef: ', awRef);
    awRef.update(availableWorkout)
      .then(function() {
        console.log('Available Workout successfully updated!');
      })
      .catch(function(error) {
        // The document probably doesn't exist.
        console.error('Error updating Available Workout: ', error);
      });
  }

  private deleteFromDatabase(availableWorkout: AvailableWorkout) {
    this.db.collection('available-workouts')
      .doc(availableWorkout.id)
      .delete()
      .then(function() {
        console.log('Available Workout successfully deleted!');
      }).catch(function(error) {
        console.error('Error removing Available Workout: ', error);
      });
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }
}
