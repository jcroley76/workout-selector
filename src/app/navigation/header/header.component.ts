import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '../../auth/auth.service';
import { User } from '../../auth/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() sidenavToggle = new EventEmitter<void>();
  userName = '';
  isAuth = false;
  isAdmin = false;
  isTrainer = false;
  authSubscription: Subscription;
  loggedInUserSubscription: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authSubscription = this.authService.authChanged$.subscribe(authStatus => {
      this.isAuth = authStatus;
    });

    this.loggedInUserSubscription = this.authService.loggedInUser$.subscribe(user => {
      if (user) {
        console.log('header user', user);
        this.userName = user.displayName ? user.displayName : '';
        this.isAdmin = this.authService.isAdmin(user);
        this.isTrainer = this.authService.isTrainer(user);
        console.log('header isSubscriber', this.isAuth);
        console.log('header isAdmin', this.isAdmin);
        console.log('header isTrainer', this.isTrainer);
      }
    });
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  onLogout() {
    this.userName = '';
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
