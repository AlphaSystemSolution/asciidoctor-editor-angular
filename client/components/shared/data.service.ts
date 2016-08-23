/**
 * Created by sali on 8/22/2016.
 */

import { Injectable } from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DataService {

    static BASE_URL: string = "http://localhost:3000/data/";

    constructor(private http: Http) {
    }

    public authenticateUser(userName: string, password: string): Observable<Response> {
        let body = { "userName": userName, "password": password };
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(DataService.BASE_URL + "authenticate", body, options);
    }

    public findChildFolders(parentPath: string): Observable<Response> {
        let body = { "parentPath": parentPath };
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(DataService.BASE_URL + "folders", body, options);
    }

    public createFolder(userName: string, folderName: string, parentPath: string): Observable<Response> {
        let body = { "userName": userName, "parentPath": parentPath, "folderName": folderName };
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(DataService.BASE_URL + "createFolder", body, options);
    }
}