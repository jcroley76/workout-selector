import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DropDown } from '../../shared/models/dropdown.model';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecordedWorkoutService } from '../recorded-workout.service';
import { DropdownService } from '../../shared/dropdown.service';
import { UIService } from '../../shared/ui.service';
import { RecordedWorkout } from '../../shared/models/recorded-workout.model';
import { AvailableWorkoutService } from '../../admin/available-workout.service';
import {AvailableWorkout} from "../../shared/models/available-workout.model";

@Component({
  selector: 'app-record-workout',
  templateUrl: './record-workout.component.html',
  styleUrls: ['./record-workout.component.css']
})
export class RecordWorkoutComponent implements OnInit, OnDestroy {
  rwForm: FormGroup;
  isLoading = true;
  editMode = false;
  loadComponent = '';
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

  constructor(private route: ActivatedRoute,
              private router: Router,
              private recordedWorkoutService: RecordedWorkoutService,
              private availableWorkoutService: AvailableWorkoutService,
              private dropdownService: DropdownService,
              private uiService: UIService) { }

  ngOnInit() {
    this.loadingSubscription = this.uiService.loadingStateChanged$.subscribe(
      isLoading => {
        this.isLoading = isLoading;
      }
    );

    this.sourceSubscription = this.dropdownService.sourceListChanged
      .subscribe(srcList =>
        (this.sourceList = srcList)
      );
    this.fetchSourceList();

    this.typeSubscription = this.dropdownService.typeListChanged
      .subscribe(typList =>
        (this.typeList = typList)
      );
    this.fetchTypeList();

    this.emphasisSubscription = this.dropdownService.emphasisListChanged
      .subscribe(empList =>
        (this.emphasisList = empList)
      );
    this.fetchEmphasisList();

    this.measurementTypeSubscription = this.dropdownService.measurementTypeListChanged
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
      'duration': new FormControl('', {
        validators: [
          Validators.pattern('^(?:(?:([01]?\\d|2[0-3]):)?([0-5]?\\d):)?([0-5]?\\d)$')
        ]
      }),
      'emphasis': new FormControl(''),
      // TODO: ExerciseSets
    });

    console.log('editMode', this.editMode);
    if (this.editMode) {
      // TODO: Determine if relating source is Past Workouts (RecordedWorkout) or RecommendedWorkout (AvailableWorkout)
      console.log('load', this.loadComponent);
      if (this.loadComponent === 'rw') {
        this.recordedWorkoutService
          .fetchRecordedWorkout(this.id)
          .subscribe((rw: RecordedWorkout) => {
              console.log('edit rw', rw);
              if (rw) {
                this.rwForm.patchValue(rw);
              }
            }
          );
      } else if (this.loadComponent === 'aw') {
        this.availableWorkoutService
          .fetchAvailableWorkout(this.id)
          .subscribe((aw: AvailableWorkout) => {
            console.log('edit aw', aw);
            if (aw) {
              this.rwForm.patchValue(aw);
            }
          });
      }
    }
  }

  saveRecordedWorkout() {
    if (this.loadComponent === 'rw') {
      console.log('save recorded workout', this.rwForm.value);
      this.recordedWorkoutService.updateDataToDatabase(this.id, this.rwForm.value);
    } else {
      this.recordedWorkoutService.addDataToDatabase(this.rwForm.value);
    }
    this.onClear();
    this.router.navigate(['/training/past-workouts']);
  }

  onClear() {
    this.rwForm.reset();
  }

}
