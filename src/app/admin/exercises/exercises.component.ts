import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Exercise } from '../../shared/models/exercise.model';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { ExerciseService } from '../exercise.service';
import { DeleteDialogComponent } from '../../shared/delete-dialog/delete-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.css']
})
export class ExercisesComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['name', 'movementPattern', 'muscleGroup', 'equipment', 'actions'];
  dataSource = new MatTableDataSource<Exercise>();
  private exChangedSubscription: Subscription;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private exerciseService: ExerciseService,
              private dialog: MatDialog,
              private router: Router) { }

  ngOnInit() {
    this.exChangedSubscription = this.exerciseService.exercisesChanged$.subscribe(
      (exercises: Exercise[]) => {
        console.log('exercises', exercises);
        this.dataSource.data = exercises;
      }
    );
    this.exerciseService.fetchExercises();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy() {
    if (this.exChangedSubscription) {
      this.exChangedSubscription.unsubscribe();
    }
  }

  onEditItem(ex: Exercise) {
    console.log('list onEditItem', ex);
    this.router.navigate(['/admin/exercise-add-edit', ex.id]);
  }

  onAddItem() {
    this.router.navigate(['/admin/exercise-add-edit']);
  }

  onDeleteItem(ex: Exercise) {
    // Open Warning dialog then delete item
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.data = {
      title: ex.name,
      description: ex.description
    };

    const dialogRef = this.dialog.open(DeleteDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        if (data === 'delete') {
          this.exerciseService.deleteExercise(ex);
        }
      }
    );
  }
}
