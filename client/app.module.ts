import {NgModule} from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule }  from '@angular/platform-browser';

import {SharedModule} from './components/shared/shared.module';
import {NavigationModule} from './components/navigation/navigation.module';
import {AppComponent} from './components/app.component';
import { routing } from "./routes";


@NgModule({
    imports: [BrowserModule, NavigationModule, SharedModule.forRoot(), routing],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }
