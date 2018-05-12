import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { RecordedWorkoutService } from '../recorded-workout.service';
import { UIService } from '../../shared/ui.service';
import { Subscription } from 'rxjs/Subscription';
import { RecordedWorkout } from '../../shared/models/recorded-workout.model';


@Component({
  selector: 'app-workout-display',
  templateUrl: './workout-display.component.html',
  styleUrls: ['./workout-display.component.css']
})
export class WorkoutDisplayComponent implements OnInit {
  id: string;
  isLoading = true;
  userId = '';
  loggedInUserSubscription: Subscription;
  recordedWorkout: RecordedWorkout;
  private loadingSubscription: Subscription;


  constructor(private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
              private recordedWorkoutService: RecordedWorkoutService,
              private uiService: UIService) { }

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

    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          this.recordedWorkoutService.fetchRecordedWorkout(this.id).subscribe( rw => {
            console.log('rw', rw);
            if (rw) {
              this.recordedWorkout = rw;
            }
          });
        }
      );
  }

  onEditWorkout() {
    console.log('onEditWorkout', this.id);
    // this.exerciseAddEdit.workoutId = this.id;
    this.router.navigate(['/training/record-workout', {load: 'rw', id: this.id}]);
  }

}
