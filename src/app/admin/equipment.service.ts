import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Equipment} from '../shared/models/equipment.model';
import {FirestoreService} from '../shared/firestore.service';

@Injectable()
export class EquipmentService {
  equipmentList: Equipment[] = [];
  equipmentListChanged$ = new Subject<Equipment[]>();

  constructor(private fss: FirestoreService) {
  }

  fetchEquipmentList() {
    this.fss.colWithIds$('equipment')
      .subscribe((equipmentList: Equipment[]) => {
        this.equipmentList = equipmentList.sort((v1, v2) => {
          return this.orderEquipmentList(v1, v2);
        });
        this.equipmentListChanged$.next([...this.equipmentList]);
      }, error => {
        console.error('Fetching Equipment List failed, please try again later');
        this.equipmentListChanged$.next(null);
      });
  }

  orderEquipmentList(a: Equipment, b: Equipment) {
    if (a.name < b.name) { return -1; }
    if (a.name > b.name) { return 1; }
    return 0;
  }
}
