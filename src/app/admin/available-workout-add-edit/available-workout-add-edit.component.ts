import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Subscription } from 'rxjs';
import { AvailableWorkoutService } from '../available-workout.service';
import { DropdownService } from '../../shared/dropdown.service';
import { DropDown } from '../../shared/models/dropdown.model';
import { NgForm } from '@angular/forms';
import { UIService } from '../../shared/ui.service';

@Component({
  selector: 'app-available-workout-add-edit',
  templateUrl: './available-workout-add-edit.component.html',
  styleUrls: ['./available-workout-add-edit.component.css']
})
export class AvailableWorkoutAddEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') awForm: NgForm;
  isLoading = true;
  editMode = false;
  equipmentList: DropDown[];
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

  constructor( private availableWorkoutService: AvailableWorkoutService,
               private dropdownService: DropdownService,
               private uiService: UIService) { }

  ngOnInit() {
    this.loadingSubscription = this.uiService.loadingStateChanged.subscribe(
      isLoading => {
        this.isLoading = isLoading;
      }
    );
    this.equipmentSubscription = this.dropdownService.equipmentListChanged
      .subscribe(eqipList =>
        (this.equipmentList = eqipList)
    );
    this.fetchEquipmentList();

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

  fetchEquipmentList() {
    this.dropdownService.fetchEquipmentList();
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

  saveAvailableWorkout(form: NgForm) {
    console.log('NgForm:', form);
    const value = form.value;
    const availableWorkout = {
      title: value.title,
      description: value.description,
      sources: value.source,
      equipment: value.equipment,
      type: value.type,
      emphasis: value.emphasis,
      record: value.record
    };

    console.log('availableWorkout:', availableWorkout);

    // TODO: Create Edit functionality
    if (this.editMode) {
      this.availableWorkoutService.updateAvailableWorkout(availableWorkout);
    } else {
      this.availableWorkoutService.addAvailableWorkout(availableWorkout);
    }
    this.editMode = false;
    // TODO: Redirect to Available Workouts list after successful save.
    form.reset();
  }

  onClear() {
    this.awForm.reset();
    this.editMode = false;
  }

}
