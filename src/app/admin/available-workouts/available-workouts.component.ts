import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AvailableWorkout } from '../../shared/models/available-workout.model';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { AvailableWorkoutService } from '../available-workout.service';
import { DeleteDialogComponent } from '../../shared/delete-dialog/delete-dialog.component';

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
              private dialog: MatDialog) { }

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
    // console.log('list onEditItem', aw);
    /** TODO: Fix following error
     * Throws Error:
     * There are no form controls registered with this group yet.  If you're using ngModel,
     * you may want to check next tick (e.g. use setTimeout).
    **/
    this.availableWorkoutService.availableWorkoutToEdit.next(aw);
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

    // this.dialog.open(DeleteDialogComponent, dialogConfig);
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
