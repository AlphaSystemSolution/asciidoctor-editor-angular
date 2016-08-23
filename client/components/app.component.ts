/**
 * Created by sali on 8/3/2016.
 */
import {Component, OnInit} from '@angular/core';

import {DataService} from './shared/data.service';


@Component({
    selector: 'editor-app',
    template: `<menu-bar></menu-bar>
               <div>
                    <router-outlet></router-outlet>
                </div>
               `
})
export class AppComponent implements OnInit {

    constructor(private dataService: DataService) {

    }

    public ngOnInit() {
        // TODO: implement authentication and login
        this.dataService.authenticateUser("sali", "changeit")
            .map(response => response.json())
            .subscribe(
            data => {
                sessionStorage.setItem("profile", JSON.stringify(data));
                sessionStorage.setItem("userName", data.userName);
                sessionStorage.setItem("email", data.email);
            },
            err => {
                sessionStorage.removeItem("profile");
                sessionStorage.removeItem("userName");
                sessionStorage.removeItem("email");
            },
            () => { console.log("post complete") }
            );
    }
}