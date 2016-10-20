import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { auth0Config } from './auth.config';
import Auth0Lock from 'auth0-lock';

@Injectable()
export class AuthService {

  // Store profile object in auth class
  userProfile: Auth0UserProfile;
  displayName: string;

  // Auth0Lock
  lock: Auth0LockStatic;

  constructor() {
    this.lock = new Auth0Lock(auth0Config.clientId, auth0Config.domain, {});

    // Set userProfile attribute if already saved profile
    this.userProfile = JSON.parse(localStorage.getItem('profile'));
    this.displayName = undefined;

    this.lock.on('authenticated', (authResult: any) => {
      localStorage.setItem('id_token', authResult.idToken);

      // Fetch profile information
      this.lock.getProfile(authResult.idToken, (error, profile) => {
        if (error) {
          // Handle errorp
          alert(error);
          return;
        }

        profile.user_metadata = profile.user_metadata || {};
        localStorage.setItem('profile', JSON.stringify(profile));
        this.userProfile = profile;
        this.displayName = this.userProfile.name;
      });
    });
  }

  public login() {
    // Call the show method to display the widget.
    this.lock.show();
  };

  public authenticated() {
    // Check if there's an unexpired JWT
    // It searches for an item in localStorage with key == 'id_token'
    return tokenNotExpired();
  };

  public logout() {
    // Remove token and profile from localStorage
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
    this.userProfile = undefined;
    this.displayName = undefined;
  };
}
