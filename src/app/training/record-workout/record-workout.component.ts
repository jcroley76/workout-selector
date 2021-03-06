import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DropDown} from '../../shared/models/dropdown.model';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {RecordedWorkoutService} from '../recorded-workout.service';
import {DropdownService} from '../../shared/dropdown.service';
import {UIService} from '../../shared/ui.service';
import {AvailableWorkoutService} from '../../admin/available-workout.service';
import {AvailableWorkout} from '../../shared/models/available-workout.model';
import {AuthService} from '../../auth/auth.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-record-workout',
  templateUrl: './record-workout.component.html',
  styleUrls: ['./record-workout.component.css']
})
export class RecordWorkoutComponent implements OnInit, OnDestroy {
  rwForm: FormGroup;
  isLoading = true;
  editMode = false;
  canAddExercises = false;
  hasExercises = false;
  loadComponent = '';
  userId = '';
  id: string;
  sourceList: DropDown[];
  sourceSubscription: Subscription;
  typeList: DropDown[];
  typeSubscription: Subscription;
  emphasisList: DropDown[];
  emphasisSubscription: Subscription;
  measurementTypeList: DropDown[];
  measurementTypeSubscription: Subscription;
  private loadingSubscription: Subscription;
  private loggedInUserSubscription: Subscription;
  private availableWorkoutsSubscription: Subscription;
  private availableWorkoutList: AvailableWorkout[];
  private availableWorkoutSubscription: Subscription;
  private selectedAvailableWorkout: AvailableWorkout;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
              private recordedWorkoutService: RecordedWorkoutService,
              private availableWorkoutService: AvailableWorkoutService,
              private dropdownService: DropdownService,
              private uiService: UIService,
              private spinner: NgxSpinnerService) {
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

    this.sourceSubscription = this.dropdownService.sourceListChanged$
      .subscribe(srcList =>
        (this.sourceList = srcList)
      );
    this.fetchSourceList();

    this.typeSubscription = this.dropdownService.typeListChanged$
      .subscribe(typList =>
        (this.typeList = typList)
      );
    this.fetchTypeList();

    this.emphasisSubscription = this.dropdownService.emphasisListChanged$
      .subscribe(empList =>
        (this.emphasisList = empList)
      );
    this.fetchEmphasisList();

    this.measurementTypeSubscription = this.dropdownService.measurementTypeListChanged$
      .subscribe(meaList =>
        (this.measurementTypeList = meaList)
      );
    this.fetchMeasurementTypeList();

    this.availableWorkoutsSubscription = this.availableWorkoutService.availableWorkoutsChanged$
      .subscribe(aws => {
          if (aws.length > 0) {
            this.availableWorkoutList = aws;
          } else {
            this.noWorkoutsFound();
          }
        }
      );

    this.availableWorkoutSubscription = this.availableWorkoutService.availableWorkoutToEdit$
      .subscribe(aw =>
        (this.setAvailableWorkoutSelected(aw))
      );

    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          this.loadComponent = params['load'];
          this.editMode = params['id'] != null;
          this.initForm();
        }
      );
  }

  ngOnDestroy() {
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
    if (this.sourceSubscription) {
      this.sourceSubscription.unsubscribe();
    }
    if (this.typeSubscription) {
      this.typeSubscription.unsubscribe();
    }
    if (this.emphasisSubscription) {
      this.emphasisSubscription.unsubscribe();
    }
    if (this.measurementTypeSubscription) {
      this.measurementTypeSubscription.unsubscribe();
    }
    if (this.availableWorkoutsSubscription) {
      this.availableWorkoutsSubscription.unsubscribe();
    }
  }

  fetchSourceList() {
    this.dropdownService.fetchSourceList();
  }

  fetchTypeList() {
    this.dropdownService.fetchTypeList();
  }

  fetchEmphasisList() {
    this.dropdownService.fetchEmphasisList();
  }

  fetchMeasurementTypeList() {
    this.dropdownService.fetchMeasurementTypeList();
  }

  fetchAvailableWorkoutList(event) {
    console.log('fetchAvailableWorkoutList', event.value);
    this.availableWorkoutService.fetchAvailableWorkoutsBySource(event.value);
  }

  availableWorkoutSelected(event) {
    console.log('event', event);
    this.availableWorkoutService.fetchAvailableWorkout(event.value);
  }

  noWorkoutsFound() {
    this.availableWorkoutList = [];
    this.selectedAvailableWorkout = null;
    this.rwForm.controls['title'].setValue('');
    this.rwForm.controls['type'].setValue('');
    this.rwForm.controls['duration'].setValue('');
    this.rwForm.controls['emphasis'].setValue('');
  }

  initForm() {
    this.selectedAvailableWorkout = null;
    this.rwForm = new FormGroup({
      'date': new FormControl(new Date(), Validators.required),
      'title': new FormControl('', Validators.required),
      'type': new FormControl('', Validators.required),
      'notes': new FormControl(''),
      'source': new FormControl(''),
      'availableWorkouts': new FormControl(''),
      'duration': new FormControl(''),
      'emphasis': new FormControl(''),
    });

    if (this.editMode) {
      if (this.loadComponent === 'rw') {
        this.recordedWorkoutService.fetchCurrentWorkout(this.id);
        this.recordedWorkoutService.currentWorkoutSubject$.subscribe(rw => {
            console.log('edit workout', rw);
            if (rw) {
              this.rwForm.patchValue(rw);
              this.canAddExercises = this.isLiftingWorkout(rw.emphasis) || this.isLiftingWorkout(rw.type);
              this.hasExercises = rw.exercises ? true : false;
            }
          }
        );
      } else if (this.loadComponent === 'aw') {
        this.availableWorkoutService.fetchAvailableWorkout(this.id);
      }
    }
  }

  setAvailableWorkoutSelected(aw: AvailableWorkout) {
    console.log('setAvailableWorkoutSelected', aw);
    this.rwForm.patchValue(aw);
    this.canAddExercises = this.isLiftingWorkout(aw.emphasis) || this.isLiftingWorkout(aw.type);
    this.selectedAvailableWorkout = aw;
  }

  saveRecordedWorkout(gotoExercises: boolean) {
    this.spinner.show();
    this.rwForm.value.userId = this.userId;
    if (this.id) {
      this.rwForm.value.id = this.id;
    }
    if (this.canAddExercises && !this.hasExercises) {
      // console.log('exercises', this.rwForm.value.exercises);
      this.rwForm.value.exercises = [];
    }

    console.log('save recorded workout', this.rwForm.value);

    this.recordedWorkoutService.saveRecordedWorkout(this.rwForm.value)
      .then(id => {
        if (gotoExercises) {
          this.router.navigate(['/training/workout-display', id]);
        } else {
          this.router.navigate(['/training/past-workouts']);
        }
        this.onClear();
      });
  }

  checkCanAddExercises() {
    let result = false;
    if (this.rwForm.value.type) {
      result = this.isLiftingWorkout(this.rwForm.value.type);
    }
    if (this.rwForm.value.emphasis) {
      result = this.isLiftingWorkout(this.rwForm.value.emphasis);
    }
    this.canAddExercises = result;
  }

  isLiftingWorkout(values: string[]): boolean {
    let result = false;
    if (values) {
      values.forEach(value => {
        if (value === 'lifting weights' ||
          value === 'strength' ||
          value === 'hypertrophy (size)') {
          result = true;
        }
      });
    }
    return result;
  }

  onClear() {
    this.rwForm.reset();
    this.spinner.hide();
  }

}
