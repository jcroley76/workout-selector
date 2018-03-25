import { Injectable } from '@angular/core';
import { AuthData } from './auth-data.model';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { AvailableWorkoutService } from '../admin/available-workout.service';
import { User } from './user.model';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { UIService } from '../shared/ui.service';

@Injectable()
export class AuthService {
  loggedInUser$: Observable<User>;
  private isAuthenticatedUser = false;

  constructor(private router: Router,
              private afAuth: AngularFireAuth,
              private afs: AngularFirestore,
              private availableWorkoutService: AvailableWorkoutService,
              private uiService: UIService) {
    //// Get auth data, then get firestore user document || null
    this.loggedInUser$ = this.afAuth.authState
      .switchMap(user => {
        if (user) {
          // user logged in
          this.isAuthenticatedUser = true;
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          // user not logged in
          return Observable.of(null);
        }
      });
  }

  // initAuthListener() {
  //   console.log('initAuthListener loggedInUser$', this.loggedInUser$);
  //   if (this.loggedInUser$ === Observable.of(null)) {
  //     this.router.navigate(['/login']);
  //   } else {
  //     this.availableWorkoutService.cancelSubscriptions();
  //     this.router.navigate(['/training']);
  //   }
  // }

  registerUser(authData: AuthData) {
    this.afAuth.auth.createUserWithEmailAndPassword(
      authData.email,
      authData.password)
      .then(credential => {
        console.log(credential);
        this.updateUserData(credential);
        this.uiService.loadingStateChanged.next(false);
        this.router.navigate(['/training']);
      })
      .catch(error => {
        console.log('Error with registration', error);
        this.uiService.loadingStateChanged.next(false);
        this.uiService.showSnackbar(error.message, null, 3000);
      });
  }

  login(authData: AuthData) {
    console.log('email, password', authData.email, authData.password);
    this.afAuth.auth.signInWithEmailAndPassword(
      authData.email,
      authData.password)
      .then(credential => {
        console.log(credential);
        this.updateUserData(credential);
        this.uiService.loadingStateChanged.next(false);
        this.router.navigate(['/training']);
      })
      .catch(error => {
        console.log('Error with login', error);
        this.uiService.loadingStateChanged.next(false);
        this.uiService.showSnackbar(error.message, null, 3000);
      });
  }

  logout() {
    this.afAuth.auth.signOut();
    this.router.navigate(['/login']);
  }

  //// Keep user object updated with auth object
  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      roles: {
        subscriber: true
      }
    };
    return userRef.set(data, { merge: true });
  }

  ///// Role-based Authorization //////

  isAuthenticated(): boolean {
    return this.isAuthenticatedUser;
  }

  isAuth(user: User): boolean {
    const allowed = ['admin', 'trainer', 'subscriber'];
    return this.checkAuthorization(user, allowed);
  }

  isTrainer(user: User): boolean {
    const allowed = ['admin', 'trainer'];
    return this.checkAuthorization(user, allowed);
  }

  isAdmin(user: User): boolean {
    const allowed = ['admin'];
    return this.checkAuthorization(user, allowed);
  }

  // determines if user has matching role
  private checkAuthorization(user: User, allowedRoles: string[]): boolean {
    if (!user) { return false; }
    for (const role of allowedRoles) {
      if ( user.roles[role] ) {
        return true;
      }
    }
    return false;
  }
}
