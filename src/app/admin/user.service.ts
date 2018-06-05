import {AngularFirestore} from 'angularfire2/firestore';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs';

import {User} from '../auth/user.model';
import {UIService} from '../shared/ui.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {FirestoreService} from '../shared/firestore.service';

@Injectable()
export class UserService {
  usersChanged$ = new Subject<User[]>();
  userToEdit$ = new Subject<User>();
  private users: User[] = [];
  private fbSubs: Subscription[] = [];

  constructor(private fss: FirestoreService,
              private spinner: NgxSpinnerService,
              private db: AngularFirestore,
              private uiService: UIService) {
  }

  fetchUsers() {
    this.spinner.show();
    this.fss.colWithIds$('users')
      .subscribe((users: User[]) => {
        this.spinner.hide();
        this.users = users;
        this.usersChanged$.next([...this.users]);
      }, error => {
        this.spinner.hide();
        console.error('Fetching Users failed, please try again later', error);
        this.usersChanged$.next(null);
      });
  }

  fetchUser(id: string) {
    this.fss.doc$('users/' + id)
      .subscribe((us: User) => {
        this.userToEdit$.next(us);
      });
    return this.userToEdit$;
  }

  deleteUser(user: User) {
    this.spinner.show();
    const docRef = this.fss.doc('users/' + user.uid);
    return this.fss.delete(docRef).then(val => this.spinner.hide());
  }

  saveUser(user: User) {
    console.log('saveUser', user);
    if (user.uid) {
      const docRef = this.fss.doc('users/' + user.uid);
      return this.fss.upsert(docRef, user).then(data => {
        console.log('saveUser upsert', data);
        return user.uid;
      });
    } else {
      const colRef = this.fss.col('users');
      return this.fss.add(colRef, user).then(data => {
        console.log('saveUser add', data);
        return data.id;
      });
    }
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }
}
