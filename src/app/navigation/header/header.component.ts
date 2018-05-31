import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../auth/auth.service';

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
      // console.log('header user', user);
      if (user) {
        this.userName = user.displayName ? user.displayName : '';
        this.isAdmin = this.authService.isAdmin(user);
        this.isTrainer = this.authService.isTrainer(user);
      } else {
        this.userName = '';
        this.isAdmin = false;
        this.isTrainer = false;
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
