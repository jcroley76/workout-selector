import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs';

import { UIService } from '../shared/ui.service';
import { RecordedWorkout } from '../shared/models/recorded-workout.model';

@Injectable()
export class RecordedWorkoutService {
  recordedWorkoutsChanged$ = new Subject<RecordedWorkout[]>();
  recordedWorkoutToEdit$ = new Subject<RecordedWorkout>();

  private recordedWorkouts: RecordedWorkout[] = [];
  private fbSubs: Subscription[] = [];

  constructor(private db: AngularFirestore, private uiService: UIService) {
  }

  fetchRecordedWorkoutsByUser(userId: string) {
    const rwRef = this.db
      .collection<RecordedWorkout>('recorded-workouts',
          ref => ref.where('userId', '==', userId)
      );

    console.log('rwRef', rwRef);

    rwRef
      .snapshotChanges()
      .map(docArray => {
        // throw(new Error());
        return docArray.map(doc => {
          return  {
            id: doc.payload.doc.id,
            date: doc.payload.doc.data().date,
            title: doc.payload.doc.data().title,
            description: doc.payload.doc.data().description,
            duration: doc.payload.doc.data().duration,
            sources: doc.payload.doc.data().sources,
            type: doc.payload.doc.data().type,
            emphasis: doc.payload.doc.data().emphasis,
            record: doc.payload.doc.data().record,
            exercises: doc.payload.doc.data().exercises,
            userId: doc.payload.doc.data().userId
          };
        });
      })
      .subscribe((recordedWorkouts: RecordedWorkout[]) => {
        this.uiService.loadingStateChanged$.next(false);
        this.recordedWorkouts = recordedWorkouts;
        this.recordedWorkoutsChanged$.next([...this.recordedWorkouts]);
      }, error => {
        this.uiService.loadingStateChanged$.next(false);
        this.uiService.showSnackbar('Fetching Workouts failed, please try again later', null, 3000);
        this.recordedWorkoutsChanged$.next(null);
      });
  }

  fetchRecordedWorkouts() {
    this.uiService.loadingStateChanged$.next(true);
    this.fbSubs.push(this.db
      .collection('recorded-workouts')
      .snapshotChanges()
      .map(docArray => {
        // throw(new Error());
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            date: doc.payload.doc.data().date,
            title: doc.payload.doc.data().title,
            description: doc.payload.doc.data().description,
            duration: doc.payload.doc.data().duration,
            sources: doc.payload.doc.data().sources,
            type: doc.payload.doc.data().type,
            emphasis: doc.payload.doc.data().emphasis,
            record: doc.payload.doc.data().record,
            exercises: doc.payload.doc.data().exercises,
            userId: doc.payload.doc.data().userId
          };
        });
      })
      .subscribe((recordedWorkouts: RecordedWorkout[]) => {
        this.uiService.loadingStateChanged$.next(false);
        this.recordedWorkouts = recordedWorkouts;
        this.recordedWorkoutsChanged$.next([...this.recordedWorkouts]);
      }, error => {
        this.uiService.loadingStateChanged$.next(false);
        this.uiService.showSnackbar('Fetching Workouts failed, please try again later', null, 3000);
        this.recordedWorkoutsChanged$.next(null);
      }));
  }

  fetchRecordedWorkout(id: string) {
    this.fbSubs.push(this.db
      .collection('recorded-workouts')
      .doc(id)
      .valueChanges()
      .subscribe((aw: RecordedWorkout) => {
        this.recordedWorkoutToEdit$.next(aw);
      })
    );
    return this.recordedWorkoutToEdit$;
  }

  deleteRecordedWorkout(recordedWorkout: RecordedWorkout) {
    this.deleteFromDatabase(recordedWorkout);
  }

  addDataToDatabase(recordedWorkout: RecordedWorkout) {
    this.db.collection('recorded-workouts').add(recordedWorkout)
      .then(function(docRef) {
        console.log('Recorded Workout Added with ID: ', docRef.id);
      })
      .catch(function(error) {
        console.error('Error adding Recorded Workout: ', error);
      });
  }

  updateDataToDatabase(id: string, recordedWorkout: RecordedWorkout) {
    const awRef = this.db.collection('recorded-workouts').doc(id);
    console.log('awRef: ', awRef);
    awRef.update(recordedWorkout)
      .then(function() {
        console.log('Recorded Workout successfully updated!');
      })
      .catch(function(error) {
        // The document probably doesn't exist.
        console.error('Error updating Recorded Workout: ', error);
      });
  }

  deleteFromDatabase(recordedWorkout: RecordedWorkout) {
    this.db.collection('recorded-workouts')
      .doc(recordedWorkout.id)
      .delete()
      .then(function() {
        console.log('Recorded Workout successfully deleted!');
      }).catch(function(error) {
      console.error('Error removing Recorded Workout: ', error);
    });
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }
}
