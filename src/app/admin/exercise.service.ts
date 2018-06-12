import {AngularFirestore} from 'angularfire2/firestore';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import {Exercise} from '../shared/models/exercise.model';
import {FirestoreService} from '../shared/firestore.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Injectable()
export class ExerciseService {
  exercisesChanged$ = new Subject<Exercise[]>();
  exerciseToEdit$ = new Subject<Exercise>();
  private exercises: Exercise[] = [];
  private fbSubs: Subscription[] = [];

  constructor(private fss: FirestoreService,
              private spinner: NgxSpinnerService) {
  }

  fetchExercises() {
    this.spinner.show();
    this.fbSubs.push(this.fss.colWithIds$('exercises')
      .subscribe((exercises: Exercise[]) => {
        this.spinner.hide();
        this.exercises = exercises;
        this.exercisesChanged$.next([...this.exercises]);
      }, error => {
        this.spinner.hide();
        console.error('Fetching Exercises failed, please try again later', error);
        this.exercisesChanged$.next(null);
      }));
  }

  fetchExercise(id: string) {
    console.log('fetchExercise', id);
    this.fbSubs.push(
      this.fss.doc$('exercises/' + id)
      .subscribe((ex: Exercise) => {
        this.exerciseToEdit$.next(ex);
      })
    );
    return this.exerciseToEdit$;
  }

  deleteExercise(exercise: Exercise) {
    this.spinner.show();
    const docRef = this.fss.doc('exercises/' + exercise.id);
    return this.fss.delete(docRef).then(val => this.spinner.hide());
  }

  saveExercise(exercise: Exercise) {
    console.log('saveExercise', exercise);
    if (exercise.id) {
      const docRef = this.fss.doc('exercises/' + exercise.id);
      return this.fss.upsert(docRef, exercise).then(data => {
        console.log('saveExercise upsert', data);
        return exercise.id;
      });
    } else {
      const colRef = this.fss.col('exercises');
      return this.fss.add(colRef, exercise).then(data => {
        console.log('saveExercise add', data);
        return data.id;
      });
    }
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }
}
