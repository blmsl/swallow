import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserInfo } from 'firebase';

export const Error_No_Input = 'No Data Entry';
export const Error_No_Email = 'No Email Entry';
export const Error_No_Password = 'No Password Entry';
export const Error_Login_First = 'No Logged User';

export interface UserModel {
  contact?: string;
  email?: string;
  gender?: 'M' | 'F';
  name?: string;
  password?: string;
  username?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  redirectUrl: string;
  constructor(public afAuth: AngularFireAuth, public db: AngularFirestore) {}

  check(user: UserModel) {
    if (user === void 0) {
      console.log(`No user information`);
      throw this.error(Error_No_Input, 'Please enter valid information');
    }
    if (user === void 0 || !user.email || typeof user.email !== 'string') {
      console.log(`Invalid Email`);
      throw this.error(Error_No_Email, 'Please enter valid email');
    }
    if (user === void 0 || !user.password || typeof user.password !== 'string') {
      console.log(`Invalid Password`);
      throw this.error(Error_No_Password, 'Please enter valid password');
    }
  }

  get collectUserInfo() {
    return this.db.collection('user-collection');
  }

  docUserInfo(id: string) {
    return this.collectUserInfo.doc(id);
  }

  error(code, message) {
    return { code: code, message: message };
  }

  async login(user: UserModel): Promise<UserInfo> {
    this.check(user);

    const credential = await this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);

    return credential.user;
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  async register(user: UserModel): Promise<UserInfo> {
    this.check(user);

    const response: firebase.auth.UserCredential = await this.afAuth.auth.createUserWithEmailAndPassword(
      user.email,
      user.password
    );

    const userInfo = Object.assign({}, user);

    delete userInfo.password;

    await this.docUserInfo(response.user.uid).set(userInfo);

    return response.user;
  }

  async update(user: UserModel): Promise<UserModel> {
    if (!this.afAuth.auth.currentUser) {
      throw this.error(Error_Login_First, 'User must login first');
    }

    await this.docUserInfo(this.afAuth.auth.currentUser.uid).update(user);

    return <any>this.docUserInfo(this.afAuth.auth.currentUser.uid)
      .ref.get()
      .then(response => {
        if (response.exists) {
          return response.data();
        } else {
          return null;
        }
      });
  }
}
