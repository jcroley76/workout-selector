import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AvailableWorkout } from '../../shared/models/available-workout.model';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { AvailableWorkoutService } from '../available-workout.service';
import { DeleteDialogComponent } from '../../shared/delete-dialog/delete-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-available-workouts',
  templateUrl: './available-workouts.component.html',
  styleUrls: ['./available-workouts.component.css']
})
export class AvailableWorkoutsComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['source', 'title', 'emphasis', 'record', 'duration', 'actions'];
  dataSource = new MatTableDataSource<AvailableWorkout>();
  private awChangedSubscription: Subscription;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private availableWorkoutService: AvailableWorkoutService,
              private dialog: MatDialog,
              private router: Router) { }

  ngOnInit() {
    this.awChangedSubscription = this.availableWorkoutService.availableWorkoutsChanged$.subscribe(
      (availableWorkouts: AvailableWorkout[]) => {
        console.log('availableWorkouts', availableWorkouts);
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
    this.router.navigate(['/admin/available-workout-add-edit', aw.id]);
  }

  onDeleteItem(aw: AvailableWorkout) {
    // Open Warning dialog then delete item
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.data = {
      title: aw.title,
      description: aw.description
    };

    const dialogRef = this.dialog.open(DeleteDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        if (data === 'delete') {
          this.availableWorkoutService.deleteAvailableWorkout(aw);
        }
      }
    );
  }
}
