import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { Exercise } from '../shared/models/exercise.model';
import { UIService } from '../shared/ui.service';
import { DropDown } from '../shared/models/dropdown.model';

@Injectable()
export class ExerciseService {
  exercisesChanged = new Subject<Exercise[]>();
  exerciseToEdit = new Subject<Exercise>();
  private exercises: Exercise[] = [];
  private fbSubs: Subscription[] = [];

  constructor(private afs: AngularFirestore,
              private uiService: UIService) {
  }

  fetchExercises() {
    this.uiService.loadingStateChanged$.next(true);
    this.fbSubs.push(this.afs
      .collection('exercises')
      .snapshotChanges()
      .map(docArray => {
        // throw(new Error());
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            name: doc.payload.doc.data().name,
            description: doc.payload.doc.data().description,
            movementPattern: doc.payload.doc.data().movementPattern,
            equipment: doc.payload.doc.data().equipment,
            muscleGroup: doc.payload.doc.data().muscleGroup,
          };
        });
      })
      .subscribe((exercises: Exercise[]) => {
        this.uiService.loadingStateChanged$.next(false);
        this.exercises = exercises;
        this.exercisesChanged.next([...this.exercises]);
      }, error => {
        this.uiService.loadingStateChanged$.next(false);
        this.uiService.showSnackbar('Fetching Exercises failed, please try again later', null, 3000);
        this.exercisesChanged.next(null);
      }));
  }

  // Inspired By: https://github.com/audiBookning/autocomplete-search-angularfirebase2-5-plus/blob/master/src/app/movies.service.ts
  searchExerciseNames(start: BehaviorSubject<string>): Observable<Exercise[]> {
    console.log('service searchExerciseNames', start);
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
    this.fbSubs.push(this.afs
      .collection('exercises')
      .doc(id)
      .valueChanges()
      .subscribe((ex: Exercise) => {
        this.exerciseToEdit.next(ex);
      })
    );
    return this.exerciseToEdit;
  }

  deleteExercise(exercise: Exercise) {
    this.deleteFromDatabase(exercise);
  }

  addDataToDatabase(exercise: Exercise) {
    this.afs.collection('exercises').add(exercise)
      .then(function(docRef) {
        console.log('Exercise Added with ID: ', docRef.id);
      })
      .catch(function(error) {
        console.error('Error adding Exercise: ', error);
      });
  }

  updateDataToDatabase(id: string, exercise: Exercise) {
    const exRef = this.afs.collection('exercises').doc(id);
    console.log('exRef: ', exRef);
    exRef.update(exercise)
      .then(function() {
        console.log('Exercise successfully updated!');
      })
      .catch(function(error) {
        // The document probably doesn't exist.
        console.error('Error updating Exercise: ', error);
      });
  }

  deleteFromDatabase(exercise: Exercise) {
    this.afs.collection('exercises')
      .doc(exercise.id)
      .delete()
      .then(function() {
        console.log('Exercise successfully deleted!');
      }).catch(function(error) {
      console.error('Error removing Exercise: ', error);
    });
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }
}
