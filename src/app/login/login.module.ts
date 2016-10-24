import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './login.component';
import { SignUpComponent } from './signup.component';

@NgModule({
  imports: [SharedModule],
  declarations: [LoginComponent, SignUpComponent],
  exports: [LoginComponent, SignUpComponent]
})
export class LoginModule { }
