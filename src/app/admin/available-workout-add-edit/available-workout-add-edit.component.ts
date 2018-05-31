import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AvailableWorkoutService } from '../available-workout.service';
import { DropdownService } from '../../shared/dropdown.service';
import { DropDown } from '../../shared/models/dropdown.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UIService } from '../../shared/ui.service';
import { AvailableWorkout } from '../../shared/models/available-workout.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Equipment } from '../../shared/models/equipment.model';
import { EquipmentService } from '../equipment.service';

@Component({
  selector: 'app-available-workout-add-edit',
  templateUrl: './available-workout-add-edit.component.html',
  styleUrls: ['./available-workout-add-edit.component.css']
})
export class AvailableWorkoutAddEditComponent implements OnInit, OnDestroy {
  awForm: FormGroup;
  isLoading = true;
  editMode = false;
  id: string;
  equipmentList: Equipment[];
  equipmentSubscription: Subscription;
  sourceList: DropDown[];
  sourceSubscription: Subscription;
  typeList: DropDown[];
  typeSubscription: Subscription;
  emphasisList: DropDown[];
  emphasisSubscription: Subscription;
  measurementTypeList: DropDown[];
  measurementTypeSubscription: Subscription;
  private loadingSubscription: Subscription;

  constructor( private route: ActivatedRoute,
               private router: Router,
               private availableWorkoutService: AvailableWorkoutService,
               private equipmentService: EquipmentService,
               private dropdownService: DropdownService,
               private uiService: UIService) { }

  ngOnInit() {
    this.loadingSubscription = this.uiService.loadingStateChanged$.subscribe(
      isLoading => {
        this.isLoading = isLoading;
      }
    );
    this.equipmentSubscription = this.equipmentService.equipmentListChanged$
      .subscribe(eqipList =>
        (this.equipmentList = eqipList)
    );
    this.fetchEquipmentList();

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
          this.editMode = params['id'] != null;
          this.initForm();
        }
      );
  }

  ngOnDestroy() {
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
    if (this.equipmentSubscription) {
      this.equipmentSubscription.unsubscribe();
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

  // TODO: Console errors when loading in edit mode
  // ERROR Error: Value must be an array in multiple-selection mode.
  fetchEquipmentList() {
    this.equipmentService.fetchEquipmentList();
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

  // Example: https://toddmotto.com/angular-2-form-controls-patch-value-set-value
  initForm() {
    this.awForm = new FormGroup({
      'title': new FormControl('', Validators.required),
      'description': new FormControl('', Validators.required),
      'record': new FormControl('', Validators.required),
      'sources': new FormControl('', Validators.required),
      'duration': new FormControl('', Validators.required),
      'emphasis': new FormControl(''),
      'equipment': new FormControl(''),
      'type': new FormControl(''),
    });

    console.log('editMode', this.editMode);
    if (this.editMode) {
      this.availableWorkoutService
        .fetchAvailableWorkout(this.id)
        .subscribe(
          (aw: AvailableWorkout) => {
            console.log('edit aw', aw);
            if (aw) {
              this.awForm.patchValue(aw);
            }
          }
        );
    }
  }

  saveAvailableWorkout() {
    if (this.editMode) {
      console.log('save available workout', this.awForm.value);
      this.availableWorkoutService.updateDataToDatabase(this.id, this.awForm.value);
    } else {
      this.availableWorkoutService.addDataToDatabase(this.awForm.value);
    }
    this.onClear();
    this.router.navigate(['/admin/available-workouts']);
  }

  onClear() {
    this.awForm.reset();
  }
}
