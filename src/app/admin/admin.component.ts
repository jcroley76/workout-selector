import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AvailableWorkout } from '../shared/models/available-workout.model';
import { AvailableWorkoutService } from './available-workout.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  selectedIndex: number = 0;
  editSubscription: Subscription;

  constructor(private availableWorkoutService: AvailableWorkoutService) { }

  ngOnInit() {
    this.editSubscription = this.availableWorkoutService.startedEditing
      .subscribe(
        (aw: AvailableWorkout) => {
          console.log('admin comp: change selectedIndex');
          this.selectedIndex = 1;
        }
      );
  }

  onAddAvailableWorkout() {
    // TODO: This is a hack. Figure out a better way
    const aw = {
      title: null,
      description: null,
      sources: null,
      equipment: null,
      type: null,
      emphasis: null,
      record: null
    };
    console.log('addAvailableWorkout clicked', aw);
    this.availableWorkoutService.startedEditing.next(aw);
  }

  selectedIndexChange(val) {
    this.selectedIndex = val;
  }

}
