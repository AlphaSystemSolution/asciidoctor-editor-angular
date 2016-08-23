/**
 * Created by sali on 8/20/2016.
 */

export interface User {
    _id?: any;
    userName: string;
    email: string;
    password?: string;
    active: boolean;
}

export class NewUser implements User {
    constructor(public userName?, public email?, public password?, public active?) { }
}

export class DisplayableUser implements User {
    constructor(public _id?, public userName?, public email?, public active?) { }
}

export interface Folder {
    _id?: any;
    name: string;
    parentPath: string;
    path: string;
}

export class NewFolder implements Folder {
    constructor(public name?, public path?, public parentPath?) { }
}