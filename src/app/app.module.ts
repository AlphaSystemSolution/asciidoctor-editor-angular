import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from './shared/shared.module';
import { NavbarModule } from './navigation/navbar.module';
import { LoginModule } from './login/login.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';
import { routing, appRoutingProviders } from './app.routes';

@NgModule({
  imports: [
    BrowserModule,
    LoginModule,
    NavbarModule,
    routing,
    SharedModule.forRoot()
  ],
  declarations: [
    AppComponent,
    HomeComponent
  ],
  providers: [appRoutingProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
