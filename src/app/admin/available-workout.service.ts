import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs';
import {AvailableWorkout} from '../shared/models/available-workout.model';
import {UIService} from '../shared/ui.service';
import {FirestoreService} from '../shared/firestore.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Injectable()
export class AvailableWorkoutService {
  availableWorkoutsChanged$ = new Subject<AvailableWorkout[]>();
  availableWorkoutToEdit$ = new Subject<AvailableWorkout>();

  private availableWorkouts: AvailableWorkout[] = [];
  private fbSubs: Subscription[] = [];

  constructor(private fss: FirestoreService,
              private spinner: NgxSpinnerService,
              private uiService: UIService) {
  }

  fetchAvailableWorkouts() {
    this.spinner.show();
    this.fbSubs.push(this.fss.colWithIds$('available-workouts')
      .subscribe((availableWorkouts: AvailableWorkout[]) => {
        this.spinner.hide();
        this.availableWorkouts = availableWorkouts;
        this.availableWorkoutsChanged$.next([...this.availableWorkouts]);
      }, error => {
        this.spinner.hide();
        this.uiService.showSnackbar('Fetching Workouts failed, please try again later', null, 3000);
        this.availableWorkoutsChanged$.next(null);
      })
    );
  }

  fetchAvailableWorkoutsBySource(source: string) {
    console.log('fetchAvailableWorkoutsBySource', source);
    this.spinner.show();
    this.fbSubs.push(
      this.fss.colWithIds$('available-workouts',
        ref => ref.where('source', '==', source))
        .subscribe((availableWorkouts: AvailableWorkout[]) => {
          this.spinner.hide();
          console.log('availableWorkouts', availableWorkouts);
          this.availableWorkouts = availableWorkouts;
          this.availableWorkoutsChanged$.next([...this.availableWorkouts]);
        }, error => {
          this.spinner.hide();
          this.uiService.showSnackbar('Fetching Workouts failed for this source: ' + source, null, 3000);
          this.availableWorkoutsChanged$.next(null);
        })
    );
  }

  fetchAvailableWorkout(id: string) {
    this.fbSubs.push(
      this.fss.doc$('available-workouts/' + id)
        .subscribe((aw: AvailableWorkout) => {
          this.availableWorkoutToEdit$.next(aw);
        })
    );
    return this.availableWorkoutToEdit$;
  }

  deleteAvailableWorkout(availableWorkout: AvailableWorkout) {
    this.spinner.show();
    const docRef = this.fss.doc('available-workouts/' + availableWorkout.id);
    return this.fss.delete(docRef).then(val => this.spinner.hide());
  }

  saveAvailableWorkout(availableWorkout: AvailableWorkout): Promise<string> {
    if (availableWorkout.id) {
      const docRef = this.fss.doc('available-workouts/' + availableWorkout.id);
      return this.fss.upsert(docRef, availableWorkout).then(data => {
        console.log('saveAvailableWorkout upsert', data);
        return availableWorkout.id;
      });
    } else {
      const colRef = this.fss.col('available-workouts');
      return this.fss.add(colRef, availableWorkout).then(data => {
        console.log('saveAvailableWorkout add', data);
        return data.id;
      });
    }
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }
}
