import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, Headers } from '@angular/http';
import { tokenNotExpired } from 'angular2-jwt';
import { AuthConfiguration, ResponseCode } from '../support/model';
import Auth0UserProfile from 'auth0-js';
import Auth0Error from 'auth0-js';
import Auth0Static from 'auth0-js';
import 'rxjs/add/operator/map';
let auth0Config: AuthConfiguration = require('-!json!./auth.config.json');

@Injectable()
export class AuthService {

  private static APP_URL = 'http://localhost:4000/';
  private static SIGN_UP_PATH = AuthService.APP_URL + 'signup/';

  // Store profile object in auth class
  userProfile: Auth0UserProfile;
  displayName: string;

  auth0: Auth0Static;

  constructor(private http: Http) {
    console.log('CONFIG: %s', JSON.stringify(auth0Config));
    this.auth0 = new Auth0({
      clientID: auth0Config.clientId,
      callbackURL: 'http://localhost:3000/',
      callbackOnLocationHash: true,
      domain: auth0Config.domain
    });

    // Set userProfile attribute if already saved profile
    this.userProfile = JSON.parse(localStorage.getItem('profile'));
    this.displayName = undefined;
  }

  public login(userName: string, password: string) {
    return this.auth0.login(
      {
        connection: 'Username-Password-Authentication',
        responseType: 'token',
        email: userName,
        password: password,
      },
      (err: Auth0Error, profile: Auth0UserProfile) => {
        if (err) {
          console.error('Error in login: %s', JSON.stringify(err));
          return { 'error': err };
        }
        console.log('Profle: %s', JSON.stringify(profile));
        profile.user_metadata = profile.user_metadata || {};
        localStorage.setItem('profile', JSON.stringify(profile));
        this.userProfile = profile;
        let userMetadata: any = this.userProfile.user_metadata;
        if (userMetadata) {
          this.displayName = userMetadata.fullName;
        }
        return { 'result': 'success' };
      });
  }

  public signup(userName: string, password: string, email: string, firstName: string,
    lastName: string): any {
    let body: any = {
      'userName': userName,
      'password': password,
      'email': email,
      'firstName': firstName,
      'lastName': lastName
    };
    let options: RequestOptionsArgs = {
      headers: new Headers({ 'Content-Type': 'application/json' })
    };
    try {
      return this.http.post(AuthService.SIGN_UP_PATH, body, options)
        .map(res => res.json())
        .subscribe(
        data => {
          console.log('Data in signup: %s', JSON.stringify(data));
          return { 'result': ResponseCode.SUCCESS };
        },
        error => {
          console.log('Error in signup: %s', JSON.stringify(error));
          let status: number = error.status;
          if (status === 0) {
            return { 'result': ResponseCode.SYSTEM_ERROR };
          } else {
            return { 'result': ResponseCode.UNKNOWN_ERROR };
          }
        }
        );
    } catch (error) {
      console.log('Caught Error in signup: %s', JSON.stringify(error));
      return { 'result': ResponseCode.SYSTEM_ERROR };
    }
  }

  public authenticated() {
    // Check if there's an unexpired JWT
    // It searches for an item in localStorage with key == 'id_token'
    return tokenNotExpired();
  }

  public logout() {
    // Remove token and profile from localStorage
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
    this.userProfile = undefined;
    this.displayName = undefined;
  }

}
