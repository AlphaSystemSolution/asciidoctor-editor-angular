/**
 * Created by sali on 8/19/2016.
 */

import {NgModule} from '@angular/core';

import {ButtonModule, DialogModule, DropdownModule, InputTextModule, TooltipModule} from "primeng/primeng";

import {SharedModule} from '../shared/shared.module';
import {NewDocumentDialog} from './newdocument.dialog.component';

@NgModule({
    imports: [SharedModule, ButtonModule, DialogModule, DropdownModule, InputTextModule, TooltipModule],
    declarations: [NewDocumentDialog],
    exports: [NewDocumentDialog]
})
export class DialogsModule { }