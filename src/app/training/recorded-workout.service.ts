import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {UIService} from '../shared/ui.service';
import {RecordedWorkout, WorkoutExercise} from '../shared/models/recorded-workout.model';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {FirestoreService} from '../shared/firestore.service';

@Injectable()
export class RecordedWorkoutService {
  private recordedWorkouts: RecordedWorkout[] = [];
  recordedWorkoutsChanged$ = new Subject<RecordedWorkout[]>();
  private currentWorkout: RecordedWorkout;
  currentWorkoutSubject$ = new BehaviorSubject<RecordedWorkout>(this.currentWorkout);

  private collectionRef = this.fss.col('recorded-workouts');

  // TODO: UIService isn't working. Find a spinner module to add to app.

  constructor(private fss: FirestoreService,
              private uiService: UIService) {
  }

  fetchRecordedWorkoutsByUser(userId: string) {
    console.log('fetchRecordedWorkoutsByUser', userId);
    this.fss.colWithIds$('recorded-workouts',
                        ref => ref.where('userId', '==', userId) )
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

  fetchCurrentWorkout(selectedId: string) {
    this.currentWorkout = this.recordedWorkouts.find(
      rw => rw.id === selectedId
    );
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
          console.log('currentWorkout has no exercises');
          this.currentWorkout.exercises = [];
        }
        this.currentWorkout.exercises.push(workoutExercise);
      }
      const docRef = this.fss.doc('recorded-workouts/' + this.currentWorkout.id);
      return this.fss.upsert(docRef, this.currentWorkout);

    } else {
      console.error('No current workout for saveExerciseSets');
    }
  }

  deleteRecordedWorkout(recordedWorkout: RecordedWorkout) {
    const docRef = this.fss.doc('recorded-workouts/' + recordedWorkout.id);
    return this.fss.delete(docRef);
  }

  deleteExerciseFromWorkout(workoutExercise: WorkoutExercise) {
    if (this.currentWorkout) {
      const index = this.currentWorkout.exercises.indexOf(workoutExercise);
      this.currentWorkout.exercises.splice(index, 1);
      const docRef = this.fss.doc('recorded-workouts/' + this.currentWorkout.id);
      return this.fss.upsert(docRef, this.currentWorkout);
    } else {
      console.error('No current workout for deleteExerciseFromWorkout');
    }
  }

  saveRecordedWorkout(recordedWorkout: RecordedWorkout): Promise<string> {
    if (recordedWorkout.id) {
      const docRef = this.fss.doc('recorded-workouts/' + recordedWorkout.id);
      return this.fss.upsert(docRef, recordedWorkout).then( data => {
        console.log('saveRecordedWorkout upsert', data);
        return recordedWorkout.id;
      });
    } else {
      return this.fss.add(this.collectionRef, recordedWorkout).then( data => {
        console.log('saveRecordedWorkout add', data);
        return data.id;
      });
    }
  }
}
