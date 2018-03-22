import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { AuthData } from './auth-data.model';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { AvailableWorkoutService } from '../admin/available-workout.service';


@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated: boolean;

  constructor(private router: Router,
              private afAuth: AngularFireAuth,
              private availableWorkoutService: AvailableWorkoutService) {}

  initAuthListener() {
      this.afAuth.authState.subscribe(user => {
        if (user) {
          this.isAuthenticated = true;
          this.authChange.next(true);
          this.router.navigate(['/training']);
        } else {
          this.availableWorkoutService.cancelSubscriptions();
          this.authChange.next(false);
          this.router.navigate(['/login']);
          this.isAuthenticated = false;
        }
      });
  }

  registerUser(authData: AuthData) {
    this.afAuth.auth.createUserWithEmailAndPassword(
      authData.email,
      authData.password)
      .then(result => {
        console.log(result);
      })
      .catch(error => {
        console.log(error);
      });
  }

  login(authData: AuthData) {
    console.log('email, password', authData.email, authData.password);
    this.afAuth.auth.signInWithEmailAndPassword(
      authData.email,
      authData.password)
      .then(result => {
        console.log(result);
      })
      .catch(error => {
        console.log(error);
      });
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  isAuth() {
    return this.isAuthenticated;
  }
}
