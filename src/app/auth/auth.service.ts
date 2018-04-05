import { Injectable } from '@angular/core';
import { AuthData } from './auth-data.model';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { User } from './user.model';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { UIService } from '../shared/ui.service';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AuthService {
  private isAuthenticated = false;
  authChanged$ = new Subject<boolean>();
  loggedInUser$ = new Observable<User>();

  constructor(private router: Router,
              private afAuth: AngularFireAuth,
              private afs: AngularFirestore,
              private uiService: UIService) {
    //// Get auth data, then get firestore user document || null
    this.loggedInUser$ = this.afAuth.authState
      .switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return Observable.of(null);
        }
      });
  }

  initAuthListener() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        this.authChanged$.next(true);
        this.router.navigate(['/training']);
      } else {
        this.authChanged$.next(false);
        this.router.navigate(['/login']);
      }
    });
  }

  registerUser(authData: AuthData) {
    this.afAuth.auth.createUserWithEmailAndPassword(
      authData.email,
      authData.password)
      .then(credential => {
        console.log('registerUser', credential);
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
        console.log('login credential', credential);
        // this.getUserData();
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
    this.loggedInUser$ = Observable.of(null);
    this.router.navigate(['/login']);
  }

  isAuth() {
    return this.isAuthenticated;
  }

  //// Keep user object updated with auth object
  private updateUserData(user) {
    // Sets user data to firestore on login
    console.log('updateUserData', user);
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      roles: {
        subscriber: true
      }
    };
    console.log('userRef.set', userRef.set(data, { merge: true }));
    return userRef.set(data, { merge: true });
  }

  ///// Role-based Authorization //////

  isSubscriber(user: User): boolean {
    // console.log('isSubscriber user', user);
    const allowed = ['subscriber'];
    return this.checkAuthorization(user, allowed);
  }

  isTrainer(user: User): boolean {
    const allowed = ['trainer'];
    return this.checkAuthorization(user, allowed);
  }

  isAdmin(user: User): boolean {
    const allowed = ['admin'];
    return this.checkAuthorization(user, allowed);
  }

  // determines if user has matching role
  // TODO: This is always returning true
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
