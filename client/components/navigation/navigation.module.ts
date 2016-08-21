/**
 * Created by sali on 8/19/2016.
 */

import {NgModule} from '@angular/core';

import {MenubarModule} from "primeng/primeng";

import {SharedModule} from '../shared/shared.module';
import {DialogsModule} from '../dialogs/dialog.module';
import {MenubarComponent} from './menubar.component';

@NgModule({
    imports: [SharedModule, MenubarModule, DialogsModule],
    declarations: [MenubarComponent],
    exports: [MenubarComponent]
})
export class NavigationModule { }