import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AvailableWorkoutService } from '../available-workout.service';
import { DropdownService } from '../../shared/dropdown.service';
import { DropDown } from '../../shared/models/dropdown.model';
import { NgForm } from '@angular/forms';
import { AvailableWorkout } from '../../shared/models/available-workout.model';
import { UIService } from '../../shared/ui.service';

@Component({
  selector: 'app-available-workout-add-edit',
  templateUrl: './available-workout-add-edit.component.html',
  styleUrls: ['./available-workout-add-edit.component.css']
})
export class AvailableWorkoutAddEditComponent implements OnInit, OnDestroy {
  isLoading = true;
  availableWorkout: AvailableWorkout;
  attributes = [];

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
    this.attributes.push(form.value.source);
    this.attributes.push(form.value.equipment);
    this.attributes.push(form.value.type);
    this.attributes.push(form.value.emphasis);
    this.attributes.push(form.value.record);
    console.log('attributes:', this.attributes);
    console.log('availableWorkout:', this.availableWorkout);
    // this.availableWorkout = {'', form.value.title, form.value.description, this.attributes};
    // this.availableWorkoutService.saveAvailableWorkout(this.availableWorkout);
  }





}
