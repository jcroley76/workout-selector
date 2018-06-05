import {AngularFirestore} from 'angularfire2/firestore';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import {Exercise} from '../shared/models/exercise.model';
import {UIService} from '../shared/ui.service';
import {FirestoreService} from '../shared/firestore.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Injectable()
export class ExerciseService {
  exercisesChanged$ = new Subject<Exercise[]>();
  exerciseToEdit$ = new Subject<Exercise>();
  private exercises: Exercise[] = [];
  private fbSubs: Subscription[] = [];

  constructor(private fss: FirestoreService,
              private spinner: NgxSpinnerService,
              private afs: AngularFirestore,
              private uiService: UIService) {
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

  // TODO: Improve search: https://angularfirebase.com/lessons/algolia-firestore-quickstart-with-firebase-cloud-functions/
  // Inspired By: https://github.com/audiBookning/autocomplete-search-angularfirebase2-5-plus/blob/master/src/app/movies.service.ts
  searchExerciseNames(start: BehaviorSubject<string>): Observable<Exercise[]> {
    return start.switchMap(startText => {
      const endText = startText + '\uf8ff';
      return this.afs
        .collection('exercises', ref =>
          ref
            .orderBy('name')
            .limit(10)
            .startAt(startText)
            .endAt(endText)
        )
        .snapshotChanges()
        .debounceTime(200)
        .distinctUntilChanged()
        .map(changes => {
          // console.log('changes', changes);
          return changes.map(c => {
            return {
              id: c.payload.doc.id,
              name: c.payload.doc.data().name,
              description: c.payload.doc.data().description,
              movementPattern: c.payload.doc.data().movementPattern,
              equipment: c.payload.doc.data().equipment,
              muscleGroup: c.payload.doc.data().muscleGroup
            };
          });
        });
    });
  }

  fetchExercise(id: string) {
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
