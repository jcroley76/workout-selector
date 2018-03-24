export interface Roles {
  user: boolean;
  trainer?: boolean;
  admin?:  boolean;
}

export class User {
  userId:   string;
  email:    string;
  photoURL: string;
  roles:    Roles;

  constructor(authData) {
    this.userId   = authData.userId;
    this.email    = authData.email;
    this.photoURL = authData.photoURL;
    this.roles    = { user: true };
  }
}

