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
  isAuth = false;
  isAdmin = false;
  isTrainer = false;
  authSubscription: Subscription;

  constructor(private authService: AuthService) { }

  userName: String;

  ngOnInit() {
    this.authSubscription = this.authService.loggedInUser$.subscribe(user => {
      this.userName = user.displayName;
      this.isAuth = this.authService.isAuth(user);
      this.isAdmin = this.authService.isAdmin(user);
      this.isTrainer = this.authService.isTrainer(user);
    });
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }

}
