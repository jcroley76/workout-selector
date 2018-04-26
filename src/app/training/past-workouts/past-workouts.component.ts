import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { RecordedWorkout } from '../../shared/models/recorded-workout.model';
import { MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { RecordedWorkoutService } from '../recorded-workout.service';
import { Router } from '@angular/router';
import { DeleteDialogComponent } from '../../shared/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-past-workouts',
  templateUrl: './past-workouts.component.html',
  styleUrls: ['./past-workouts.component.css']
})
export class PastWorkoutsComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['date', 'sources', 'title', 'emphasis', 'record', 'duration', 'actions'];
  dataSource = new MatTableDataSource<RecordedWorkout>();
  private rwChangedSubscription: Subscription;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private recordedWorkoutService: RecordedWorkoutService,
              private dialog: MatDialog,
              private router: Router) {
  }

  ngOnInit() {
    this.rwChangedSubscription = this.recordedWorkoutService.recordedWorkoutsChanged$.subscribe(
      (recordedWorkouts: RecordedWorkout[]) => {
        console.log('recordedWorkouts', recordedWorkouts);
        this.dataSource.data = recordedWorkouts;
      }
    );
    this.recordedWorkoutService.fetchRecordedWorkouts();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy() {
    if (this.rwChangedSubscription) {
      this.rwChangedSubscription.unsubscribe();
    }
  }

  onEditItem(rw: RecordedWorkout) {
    console.log('list onEditItem', rw);
    this.router.navigate(['/training/record-workout', {load: 'rw', id: rw.id}]);
  }

  onDeleteItem(rw: RecordedWorkout) {
    // Open Warning dialog then delete item
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.data = {
      title: rw.title,
      description: rw.description
    };

    const dialogRef = this.dialog.open(DeleteDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        if (data === 'delete') {
          this.recordedWorkoutService.deleteRecordedWorkout(rw);
        }
      }
    );
  }
}
