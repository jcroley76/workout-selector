import { Component, OnInit } from '@angular/core';
import { AvailableWorkoutService } from '../../admin/available-workout.service';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-recommend-workout',
  templateUrl: './recommend-workout.component.html',
  styleUrls: ['./recommend-workout.component.css']
})
export class RecommendWorkoutComponent implements OnInit {
  searchTerm: string;
  availableWorkouts;

  constructor(private availableWorkoutsService: AvailableWorkoutService) { }

  ngOnInit() {
    Observable.combineLatest(this.availableWorkoutsService.startObs$, this.availableWorkoutsService.endObs$)
      .subscribe((value) => {
          console.log('value', value);
          this.availableWorkoutsService.searchAvailableWorkouts(value[0], value[1])
            .subscribe((availableWorkouts) => {
              console.log('availableWorkouts', availableWorkouts);
              this.availableWorkouts = availableWorkouts;
            });
      });
  }

  search($event) {
    const q = $event.target.value;
    if (q !== '') {
      this.availableWorkoutsService.startAt$.next(q);
      this.availableWorkoutsService.endAt$.next(q + '\uf8ff');
    }
  }

}
