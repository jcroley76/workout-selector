import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy
} from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit, OnDestroy {
  @Output() closeSidenav = new EventEmitter<void>();
  isAuth = false;
  isAdmin = false;
  isTrainer = false;
  authSubscription: Subscription;
  loggedInUserSubscription: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authSubscription = this.authService.authChanged$.subscribe(authStatus => {
      this.isAuth = authStatus;
    });

    this.loggedInUserSubscription = this.authService.loggedInUser$.subscribe(user => {
      // console.log('header user', user);
      this.isAdmin = this.authService.isAdmin(user);
      this.isTrainer = this.authService.isTrainer(user);
    });
  }

  onClose() {
    this.closeSidenav.emit();
  }

  onLogout() {
    this.onClose();
    this.isAuth = false;
    this.isAdmin = false;
    this.isTrainer = false;
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
    this.loggedInUserSubscription.unsubscribe();
  }
}
