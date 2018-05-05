import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Equipment} from '../shared/models/equipment.model';
import {Subscription} from 'rxjs/Subscription';
import {AngularFirestore} from 'angularfire2/firestore';
import {UIService} from '../shared/ui.service';

@Injectable()
export class EquipmentService {
  equipmentList: Equipment[] = [];
  equipmentListChanged$ = new Subject<Equipment[]>();

  private fbSubs: Subscription[] = [];

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
            abbr: doc.payload.doc.data().abbr
          };
        });
      })
      .subscribe((equipmentList: Equipment[]) => {
        this.uiService.loadingStateChanged$.next(false);
        this.equipmentList = equipmentList;
        this.equipmentListChanged$.next([...this.equipmentList]);
      }, error => {
        this.uiService.loadingStateChanged$.next(false);
        this.uiService.showSnackbar('Fetching Equipment List failed, please try again later', null, 3000);
        this.equipmentListChanged$.next(null);
      }));
  }
}
