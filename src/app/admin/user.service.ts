import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs';

import { User } from '../auth/user.model';
import { UIService } from '../shared/ui.service';

@Injectable()
export class UserService {
  usersChanged = new Subject<User[]>();
  userToEdit = new Subject<User>();
  private users: User[] = [];
  private fbSubs: Subscription[] = [];

  constructor(private db: AngularFirestore, private uiService: UIService) {
  }

  fetchUsers() {
    this.uiService.loadingStateChanged$.next(true);
    this.fbSubs.push(this.db
      .collection('users')
      .snapshotChanges()
      .map(docArray => {
        // throw(new Error());
        return docArray.map(doc => {
          return {
            uid: doc.payload.doc.id,
            displayName: doc.payload.doc.data().displayName,
            email: doc.payload.doc.data().email,
            roles: doc.payload.doc.data().roles
          };
        });
      })
      .subscribe((users: User[]) => {
        this.uiService.loadingStateChanged$.next(false);
        this.users = users;
        this.usersChanged.next([...this.users]);
      }, error => {
        this.uiService.loadingStateChanged$.next(false);
        this.uiService.showSnackbar('Fetching Users failed, please try again later', null, 3000);
        this.usersChanged.next(null);
      }));
  }

  fetchUser(id: string) {
    this.fbSubs.push(this.db
      .collection('users')
      .doc(id)
      .valueChanges()
      .subscribe((us: User) => {
        this.userToEdit.next(us);
      })
    );
    return this.userToEdit;
  }

  deleteUser(user: User) {
    this.deleteFromDatabase(user);
  }

  updateDataToDatabase(id: string, user: User) {
    const usRef = this.db.collection('users').doc(id);
    console.log('usRef: ', usRef);
    usRef.update(user)
      .then(function() {
        console.log('User successfully updated!');
      })
      .catch(function(error) {
        // The document probably doesn't exist.
        console.error('Error updating User: ', error);
      });
  }

  deleteFromDatabase(user: User) {
    this.db.collection('users')
      .doc(user.uid)
      .delete()
      .then(function() {
        console.log('User successfully deleted!');
      }).catch(function(error) {
      console.error('Error removing User: ', error);
    });
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }
}
