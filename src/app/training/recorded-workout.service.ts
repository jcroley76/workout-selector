import {AngularFirestore} from 'angularfire2/firestore';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs';

import {UIService} from '../shared/ui.service';
import {RecordedWorkout, WorkoutExercise} from '../shared/models/recorded-workout.model';

@Injectable()
export class RecordedWorkoutService {
  recordedWorkoutsChanged$ = new Subject<RecordedWorkout[]>();
  recordedWorkoutToEdit$ = new Subject<RecordedWorkout>();
  currentWorkoutSubject$ = new Subject<RecordedWorkout>();

  private recordedWorkouts: RecordedWorkout[] = [];
  private fbSubs: Subscription[] = [];

  currentWorkout: RecordedWorkout;

  constructor(private db: AngularFirestore, private uiService: UIService) {
  }

  fetchRecordedWorkoutsByUser(userId: string) {
    const rwRef = this.db
      .collection<RecordedWorkout>('recorded-workouts',
        ref => ref.where('userId', '==', userId)
      );

    rwRef
      .snapshotChanges()
      .map(docArray => {
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

// .snapshotChanges() returns a DocumentChangeAction[], which contains
// a lot of information about "what happened" with each change. If you want to
// get the data and the id use the map operator.
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
      .subscribe((rw: RecordedWorkout) => {
        this.recordedWorkoutToEdit$.next(rw);
      })
    );
    return this.recordedWorkoutToEdit$;
  }

  setCurrentWorkout(selectedId: string) {
    this.currentWorkout = this.recordedWorkouts.find(
      rw => rw.id === selectedId
    );
    console.log('setCurrentWorkout', this.currentWorkout);
    this.currentWorkoutSubject$.next({...this.currentWorkout});
    return this.currentWorkoutSubject$;
  }

  // https://stackoverflow.com/questions/47514419/how-to-add-subcollection-to-a-document-in-firebase-cloud-firestore
  saveExerciseSets(workoutExercise: WorkoutExercise) {
    if (this.currentWorkout) {
      const foundEx = this.currentWorkout.exercises
        ? this.currentWorkout.exercises.find(wktEx => wktEx.exercise.id === workoutExercise.exercise.id)
        : null;

      if (foundEx) {
        const index = this.currentWorkout.exercises.indexOf(foundEx);
        this.currentWorkout.exercises[index] = workoutExercise;
      } else {
        if (!this.currentWorkout.exercises) {
          this.currentWorkout.exercises = [];
        }
        this.currentWorkout.exercises.push(workoutExercise);
      }
      // TODO: When adding 1st exercise to workout, display doesn't refresh after save.
      // This may be due to the currentWorkout.exercises being uninitiated
      this.updateDataToDatabase(this.currentWorkout.id, this.currentWorkout);

    } else {
      console.error('No current workout for saveExerciseSets');
    }
  }

  deleteRecordedWorkout(recordedWorkout: RecordedWorkout) {
    this.deleteFromDatabase(recordedWorkout);
  }

  deleteExerciseFromWorkout(workoutExercise: WorkoutExercise) {
    if (this.currentWorkout) {
      const index = this.currentWorkout.exercises.indexOf(workoutExercise);
      this.currentWorkout.exercises.splice(index, 1);
      this.updateDataToDatabase(this.currentWorkout.id, this.currentWorkout);
    } else {
      console.error('No current workout for deleteExerciseFromWorkout');
    }
  }

  addDataToDatabase(recordedWorkout: RecordedWorkout) {
    this.db.collection('recorded-workouts').add(recordedWorkout)
      .then(function (docRef) {
        console.log('Recorded Workout Added with ID: ', docRef.id);
      })
      .catch(function (error) {
        console.error('Error adding Recorded Workout: ', error);
      });
  }

  updateDataToDatabase(id: string, recordedWorkout: RecordedWorkout) {
    const rwRef = this.db.collection('recorded-workouts').doc(id);
    rwRef.update(recordedWorkout)
      .then(function () {
        console.log('Recorded Workout successfully updated!');
      })
      .catch(function (error) {
        // The document probably doesn't exist.
        console.error('Error updating Recorded Workout: ', error);
      });
  }

  deleteFromDatabase(recordedWorkout: RecordedWorkout) {
    this.db.collection('recorded-workouts')
      .doc(recordedWorkout.id)
      .delete()
      .then(function () {
        console.log('Recorded Workout successfully deleted!');
      }).catch(function (error) {
      console.error('Error removing Recorded Workout: ', error);
    });
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }
}
