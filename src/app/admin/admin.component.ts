import {Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AvailableWorkout } from '../shared/models/available-workout.model';
import { AvailableWorkoutService } from './available-workout.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {
  selectedIndex: number = 0;
  editSubscription: Subscription;

  constructor(private availableWorkoutService: AvailableWorkoutService) { }

  ngOnInit() {
    this.editSubscription = this.availableWorkoutService.availableWorkoutToEdit
      .subscribe(
        (aw: AvailableWorkout) => {
          // console.log('admin comp: change selectedIndex aw', aw);
          this.selectedIndex = aw ? 1 : 0;
        }
      );
  }

  ngOnDestroy() {
    if (this.editSubscription) {
      this.editSubscription.unsubscribe();
    }
  }

  onAddAvailableWorkout() {
    // TODO: This is a hack. Figure out a better way
    // TODO: It may be best to take add-edit out of tabs
    const aw: AvailableWorkout = {
      id: null,
      title: null,
      description: null,
      sources: null,
      equipment: null,
      type: null,
      emphasis: null,
      record: null
    };
    // console.log('saveAvailableWorkout clicked', aw);
    this.availableWorkoutService.availableWorkoutToEdit.next(aw);
  }

  selectedIndexChange(val) {
    this.selectedIndex = val;
  }

}
