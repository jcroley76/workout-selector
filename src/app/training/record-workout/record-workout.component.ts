import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DropDown} from '../../shared/models/dropdown.model';
import {Subscription} from 'rxjs/Subscription';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {RecordedWorkoutService} from '../recorded-workout.service';
import {DropdownService} from '../../shared/dropdown.service';
import {UIService} from '../../shared/ui.service';
import {RecordedWorkout} from '../../shared/models/recorded-workout.model';
import {AvailableWorkoutService} from '../../admin/available-workout.service';
import {AvailableWorkout} from '../../shared/models/available-workout.model';
import {AuthService} from '../../auth/auth.service';

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

  constructor(private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
              private recordedWorkoutService: RecordedWorkoutService,
              private availableWorkoutService: AvailableWorkoutService,
              private dropdownService: DropdownService,
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

  initForm() {
    this.rwForm = new FormGroup({
      'date': new FormControl(new Date(), Validators.required),
      'title': new FormControl('', Validators.required),
      'type': new FormControl('', Validators.required),
      'description': new FormControl(''),
      'sources': new FormControl(''),
      'duration': new FormControl(''),
      'emphasis': new FormControl(''),
    });

    if (this.editMode) {
      if (this.loadComponent === 'rw') {
        this.recordedWorkoutService
          .fetchCurrentWorkout(this.id)
          .subscribe((rw: RecordedWorkout) => {
              if (rw) {
                this.rwForm.patchValue(rw);
                this.canAddExercises = this.isLiftingWorkout(rw.emphasis) || this.isLiftingWorkout(rw.type);
                this.hasExercises = rw.exercises ? true : false;
              }
            }
          );
      } else if (this.loadComponent === 'aw') {
        this.availableWorkoutService
          .fetchAvailableWorkout(this.id)
          .subscribe((aw: AvailableWorkout) => {
            if (aw) {
              this.rwForm.patchValue(aw);
              this.canAddExercises = this.isLiftingWorkout(aw.emphasis) || this.isLiftingWorkout(aw.type);
            }
          });
      }
    }
  }

  saveRecordedWorkout(gotoExercises: boolean) {
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
  }

}
