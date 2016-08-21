/**
 * Created by sali on 8/3/2016.
 */
import {Component} from '@angular/core';

@Component({
    selector: 'editor-app',
    template: `<menu-bar></menu-bar>
               <div>
                    <router-outlet></router-outlet>
                </div>
               `
})
export class AppComponent {

}