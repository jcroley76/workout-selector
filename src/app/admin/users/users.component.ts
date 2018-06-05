import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { User } from '../../auth/user.model';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { DeleteDialogComponent } from '../../shared/delete-dialog/delete-dialog.component';
import { UserService } from '../user.service';
import { UserEditComponent } from '../user-edit/user-edit.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['displayName', 'email', 'roles', 'actions'];
  dataSource = new MatTableDataSource<User>();
  private usChangedSubscription: Subscription;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private userService: UserService,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.usChangedSubscription = this.userService.usersChanged$.subscribe(
      (users: User[]) => {
        console.log('users', users);
        this.dataSource.data = users;
      }
    );
    this.userService.fetchUsers();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy() {
    if (this.usChangedSubscription) {
      this.usChangedSubscription.unsubscribe();
    }
  }

  onEditItem(us: User) {
    console.log('list onEditItem', us);
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.data = { user: us };

    const dialogRef = this.dialog.open(UserEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        console.log('data', data);
        if (data.action === 'save') {
          this.userService.saveUser(data.user);
        }
      }
    );
  }

  onDeleteItem(us: User) {
    // Open Warning dialog then delete item
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.data = {
      title: us.displayName,
      description: us.email
    };

    const dialogRef = this.dialog.open(DeleteDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        if (data === 'delete') {
          this.userService.deleteUser(us);
        }
      }
    );
  }
}
