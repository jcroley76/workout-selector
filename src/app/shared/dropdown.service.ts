import { Injectable } from '@angular/core';
import { DropDown } from './models/dropdown.model';
import { Subject } from 'rxjs/Subject';
import { FirestoreService } from './firestore.service';

@Injectable()
export class DropdownService {

  sourceList: DropDown[] = [];
  sourceListChanged$ = new Subject<DropDown[]>();

  typeList: DropDown[] = [];
  typeListChanged$ = new Subject<DropDown[]>();

  emphasisList: DropDown[] = [];
  emphasisListChanged$ = new Subject<DropDown[]>();

  measurementTypeList: DropDown[] = [];
  measurementTypeListChanged$ = new Subject<DropDown[]>();

  muscleGroupList: DropDown[] = [];
  muscleGroupListChanged$ = new Subject<DropDown[]>();

  movementPatternList: DropDown[] = [];
  movementPatternListChanged$ = new Subject<DropDown[]>();

  constructor(private fss: FirestoreService) {
  }

  fetchSourceList() {
    this.fss.colWithIds$('workout-source')
      .subscribe((sourceList: DropDown[]) => {
        this.sourceList = sourceList.sort((v1, v2) => {
          return this.orderDropDowns(v1, v2);
        });
        this.sourceListChanged$.next([...this.sourceList]);
      }, error => {
        console.error('Fetching Source List failed, please try again later', error);
        this.sourceListChanged$.next(null);
      });
  }

  fetchTypeList() {
    this.fss.colWithIds$('workout-type')
      .subscribe((typeList: DropDown[]) => {
        this.typeList = typeList.sort((v1, v2) => {
          return this.orderDropDowns(v1, v2);
        });
        this.typeListChanged$.next([...this.typeList]);
      }, error => {
        console.error('Fetching Type List failed, please try again later', error);
        this.typeListChanged$.next(null);
      });
  }

  fetchEmphasisList() {
    this.fss.colWithIds$('workout-emphasis')
      .subscribe((emphasisList: DropDown[]) => {
        this.emphasisList = emphasisList.sort((v1, v2) => {
          return this.orderDropDowns(v1, v2);
        });
        this.emphasisListChanged$.next([...this.emphasisList]);
      }, error => {
        console.error('Fetching Emphasis List failed, please try again later', error);
        this.emphasisListChanged$.next(null);
      });
  }

  fetchMeasurementTypeList() {
    this.fss.colWithIds$('measurement-types')
      .subscribe((measurementTypeList: DropDown[]) => {
        this.measurementTypeList = measurementTypeList.sort((v1, v2) => {
          return this.orderDropDowns(v1, v2);
        });
        this.measurementTypeListChanged$.next([...this.measurementTypeList]);
      }, error => {
        console.error('Fetching Measurement Type List failed, please try again later', error);
        this.measurementTypeListChanged$.next(null);
      });
  }

  fetchMuscleGroupList() {
    this.fss.colWithIds$('muscle-groups')
      .subscribe((muscleGroupList: DropDown[]) => {
        this.muscleGroupList = muscleGroupList.sort((v1, v2) => {
          return this.orderDropDowns(v1, v2);
        });
        this.muscleGroupListChanged$.next([...this.muscleGroupList]);
      }, error => {
        console.error('Fetching Body Part List failed, please try again later', error);
        this.muscleGroupListChanged$.next(null);
      });
  }

  fetchMovementPatternList() {
    this.fss.colWithIds$('movement-patterns')
      .subscribe((movementPatternList: DropDown[]) => {
        this.movementPatternList = movementPatternList.sort((v1, v2) => {
          return this.orderDropDowns(v1, v2);
        });
        this.movementPatternListChanged$.next([...this.movementPatternList]);
      }, error => {
        console.error('Fetching Movement Pattern List failed, please try again later', error);
        this.movementPatternListChanged$.next(null);
      });
  }

  orderDropDowns(a: DropDown, b: DropDown) {
    if (a.name < b.name) { return -1; }
    if (a.name > b.name) { return 1; }
    return 0;
  }

}
