/**
 * Created by sali on 8/20/2016.
 */

export interface User {
  _id?: any;
  userName?: string;
  email?: string;
  password?: string;
  active?: boolean;
}

export class NewUser implements User {
  constructor(public userName?: string, public email?: string, public password?: string,
    public active?: boolean) { }
}

export class DisplayableUser implements User {
  constructor(public _id?: string, public userName?: string, public email?: string,
    public active?: boolean) { }
}

export interface Folder {
  _id?: any;
  name?: string;
  parentPath?: string;
  path?: string;
}

export class NewFolder implements Folder {
  constructor(public name?: string, public path?: string, public parentPath?: string) { }
}

export interface AuthConfiguration {
  clientId: string;
  domain: string;
}

export interface LoginForm {
  userName: string;
  password: string;
}

export interface SignUpForm {
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  password: string;
}

export enum ResponseCode {
  SUCCESS, SYSTEM_ERROR, UNKNOWN_ERROR
}
