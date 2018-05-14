import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AuthService} from '../../auth/auth.service';
import {RecordedWorkoutService} from '../recorded-workout.service';
import {UIService} from '../../shared/ui.service';
import {Subscription} from 'rxjs/Subscription';
import {RecordedWorkout} from '../../shared/models/recorded-workout.model';


@Component({
  selector: 'app-workout-display',
  templateUrl: './workout-display.component.html',
  styleUrls: ['./workout-display.component.css']
})
export class WorkoutDisplayComponent implements OnInit, OnDestroy {
  id: string;
  isLoading = true;
  userId = '';
  currentWorkout: RecordedWorkout;

  loadingSubscription: Subscription;
  loggedInUserSubscription: Subscription;
  currentWorkoutSubscription: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
              private recordedWorkoutService: RecordedWorkoutService,
              private uiService: UIService) {
  }

  ngOnInit() {
    this.loadingSubscription = this.uiService.loadingStateChanged$.subscribe(
      isLoading => {
        this.isLoading = isLoading;
      }
    );

    this.loggedInUserSubscription = this.authService.loggedInUser$.subscribe(user => {
      if (user) {
        this.userId = user.uid;
      }
    });

    this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
      }
    );

    this.currentWorkoutSubscription = this.recordedWorkoutService.currentWorkoutSubject$.subscribe(
      rw => {
        if (rw) {
          this.currentWorkout = rw;
        }
      });
    this.fetchCurrentWorkout();
  }

  fetchCurrentWorkout() {
    this.recordedWorkoutService.setCurrentWorkout(this.id);
  }

  ngOnDestroy() {
    if (this.loggedInUserSubscription) {
      this.loggedInUserSubscription.unsubscribe();
    }
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }

  onEditWorkout() {
    console.log('onEditWorkout', this.id);
    // this.exerciseAddEdit.workoutId = this.id;
    this.router.navigate(['/training/record-workout', {load: 'rw', id: this.id}]);
  }

}
