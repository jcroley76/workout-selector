import { Injectable } from '@angular/core';
import { DropDown } from './models/dropdown.model';
import { Subject } from 'rxjs/Subject';
import { AngularFirestore } from 'angularfire2/firestore';
import { UIService } from './ui.service';
import { Subscription } from 'rxjs/Subscription';
import { Equipment } from './models/equipment.model';

@Injectable()
export class DropdownService {
  private fbSubs: Subscription[] = [];

  equipmentItem: Equipment;
  equipmentItemChanged = new Subject<Equipment>();

  equipmentList: DropDown[] = [];
  equipmentListChanged = new Subject<DropDown[]>();

  sourceList: DropDown[] = [];
  sourceListChanged = new Subject<DropDown[]>();

  typeList: DropDown[] = [];
  typeListChanged = new Subject<DropDown[]>();

  emphasisList: DropDown[] = [];
  emphasisListChanged = new Subject<DropDown[]>();

  measurementTypeList: DropDown[] = [];
  measurementTypeListChanged = new Subject<DropDown[]>();

  muscleGroupList: DropDown[] = [];
  muscleGroupListChanged = new Subject<DropDown[]>();

  movementPatternList: DropDown[] = [];
  movementPatternListChanged = new Subject<DropDown[]>();

  constructor(private db: AngularFirestore, private uiService: UIService) {
  }

  fetchEquipmentList() {
    this.uiService.loadingStateChanged$.next(true);
    this.fbSubs.push(this.db
      .collection('equipment')
      .snapshotChanges()
      .map(docArray => {
        // throw(new Error());
        return docArray.map(doc => {
          return {
            name: doc.payload.doc.data().name,
            value: doc.payload.doc.data().name
          };
        });
      })
      .subscribe((equipmentList: DropDown[]) => {
        this.uiService.loadingStateChanged$.next(false);
        this.equipmentList = equipmentList;
        this.equipmentListChanged.next([...this.equipmentList]);
      }, error => {
        this.uiService.loadingStateChanged$.next(false);
        this.uiService.showSnackbar('Fetching Equipment List failed, please try again later', null, 3000);
        this.equipmentListChanged.next(null);
      }));
  }

  // TODO: Move this to Equipment Service
  fetchEquipmentItemByName(name: string) {
    this.fbSubs.push(this.db
      .collection('equipment',
        ref => ref.where('name', '==', name))
      .valueChanges()
      .subscribe(equipment => {
        console.log('fetchEquipmentItemByName', equipment);
        console.log('equipment[\'abbr\']', equipment[0]['abbr']);
        console.log('equipment[\'name\']', equipment[0]['name']);
        this.equipmentItem = {
          abbr: equipment[0]['abbr'] ? equipment[0]['abbr'] : '',
          name: equipment[0]['name'] ? equipment[0]['name'] : ''
        };
        console.log('this.equipmentItem', this.equipmentItem);
        this.equipmentItemChanged.next(this.equipmentItem);
      }, error => {
        this.equipmentItemChanged.next(null);
      }));

    return this.equipmentItem;
  }

  fetchSourceList() {
    this.uiService.loadingStateChanged$.next(true);
    this.fbSubs.push(this.db
      .collection('workout-source')
      .snapshotChanges()
      .map(docArray => {
        // throw(new Error());
        return docArray.map(doc => {
          return {
            name: doc.payload.doc.data().name,
            value: doc.payload.doc.data().name
          };
        });
      })
      .subscribe((sourceList: DropDown[]) => {
        this.uiService.loadingStateChanged$.next(false);
        this.sourceList = sourceList;
        this.sourceListChanged.next([...this.sourceList]);
      }, error => {
        this.uiService.loadingStateChanged$.next(false);
        this.uiService.showSnackbar('Fetching Source List failed, please try again later', null, 3000);
        this.sourceListChanged.next(null);
      }));
  }

  fetchTypeList() {
    this.uiService.loadingStateChanged$.next(true);
    this.fbSubs.push(this.db
      .collection('workout-type')
      .snapshotChanges()
      .map(docArray => {
        // throw(new Error());
        return docArray.map(doc => {
          return {
            name: doc.payload.doc.data().name,
            value: doc.payload.doc.data().name
          };
        });
      })
      .subscribe((typeList: DropDown[]) => {
        this.uiService.loadingStateChanged$.next(false);
        this.typeList = typeList;
        this.typeListChanged.next([...this.typeList]);
      }, error => {
        this.uiService.loadingStateChanged$.next(false);
        this.uiService.showSnackbar('Fetching Type List failed, please try again later', null, 3000);
        this.typeListChanged.next(null);
      }));
  }

  fetchEmphasisList() {
    this.uiService.loadingStateChanged$.next(true);
    this.fbSubs.push(this.db
      .collection('workout-emphasis')
      .snapshotChanges()
      .map(docArray => {
        // throw(new Error());
        return docArray.map(doc => {
          return {
            name: doc.payload.doc.data().name,
            value: doc.payload.doc.data().name
          };
        });
      })
      .subscribe((emphasisList: DropDown[]) => {
        this.uiService.loadingStateChanged$.next(false);
        this.emphasisList = emphasisList;
        this.emphasisListChanged.next([...this.emphasisList]);
      }, error => {
        this.uiService.loadingStateChanged$.next(false);
        this.uiService.showSnackbar('Fetching Emphasis List failed, please try again later', null, 3000);
        this.emphasisListChanged.next(null);
      }));
  }

  fetchMeasurementTypeList() {
    this.uiService.loadingStateChanged$.next(true);
    this.fbSubs.push(this.db
      .collection('measurement-types')
      .snapshotChanges()
      .map(docArray => {
        // throw(new Error());
        return docArray.map(doc => {
          return {
            name: doc.payload.doc.data().name,
            value: doc.payload.doc.data().name
          };
        });
      })
      .subscribe((measurementTypeList: DropDown[]) => {
        this.uiService.loadingStateChanged$.next(false);
        this.measurementTypeList = measurementTypeList;
        this.measurementTypeListChanged.next([...this.measurementTypeList]);
      }, error => {
        this.uiService.loadingStateChanged$.next(false);
        this.uiService.showSnackbar('Fetching Measurement Type List failed, please try again later', null, 3000);
        this.measurementTypeListChanged.next(null);
      }));
  }

  fetchMuscleGroupList() {
    this.uiService.loadingStateChanged$.next(true);
    this.fbSubs.push(this.db
      .collection('muscle-groups')
      .snapshotChanges()
      .map(docArray => {
        // throw(new Error());
        return docArray.map(doc => {
          return {
            name: doc.payload.doc.data().name,
            value: doc.payload.doc.data().name
          };
        });
      })
      .subscribe((muscleGroupList: DropDown[]) => {
        this.uiService.loadingStateChanged$.next(false);
        this.muscleGroupList = muscleGroupList;
        this.muscleGroupListChanged.next([...this.muscleGroupList]);
      }, error => {
        this.uiService.loadingStateChanged$.next(false);
        this.uiService.showSnackbar('Fetching Body Part List failed, please try again later', null, 3000);
        this.muscleGroupListChanged.next(null);
      }));
  }

  fetchMovementPatternList() {
    this.uiService.loadingStateChanged$.next(true);
    this.fbSubs.push(this.db
      .collection('movement-patterns')
      .snapshotChanges()
      .map(docArray => {
        // throw(new Error());
        return docArray.map(doc => {
          return {
            name: doc.payload.doc.data().name,
            value: doc.payload.doc.data().name
          };
        });
      })
      .subscribe((movementPatternList: DropDown[]) => {
        this.uiService.loadingStateChanged$.next(false);
        this.movementPatternList = movementPatternList;
        this.movementPatternListChanged.next([...this.movementPatternList]);
      }, error => {
        this.uiService.loadingStateChanged$.next(false);
        this.uiService.showSnackbar('Fetching Movement Pattern List failed, please try again later', null, 3000);
        this.movementPatternListChanged.next(null);
      }));
  }

}
