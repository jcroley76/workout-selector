import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AvailableWorkout } from '../../shared/models/available-workout.model';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { AvailableWorkoutService } from '../available-workout.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-available-workouts',
  templateUrl: './available-workouts.component.html',
  styleUrls: ['./available-workouts.component.css']
})
export class AvailableWorkoutsComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['sources', 'title', 'emphasis', 'record', 'actions'];
  dataSource = new MatTableDataSource<AvailableWorkout>();
  private awChangedSubscription: Subscription;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private availableWorkoutService: AvailableWorkoutService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.awChangedSubscription = this.availableWorkoutService.availableWorkoutsChanged.subscribe(
      (availableWorkouts: AvailableWorkout[]) => {
        this.dataSource.data = availableWorkouts;
      }
    );
    this.availableWorkoutService.fetchAvailableWorkouts();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy() {
    if (this.awChangedSubscription) {
      this.awChangedSubscription.unsubscribe();
    }
  }

  onEditItem(aw: AvailableWorkout) {
    console.log('list onEditItem', aw);
    this.availableWorkoutService.startedEditing.next(aw);
  }

  onDeleteItem(aw: AvailableWorkout) {
    // TODO: Open modal to confirm delete
    // this.availableWorkoutService.deleteAvailableWorkout(aw);
  }
}
