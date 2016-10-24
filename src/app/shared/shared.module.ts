import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule }   from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';

import {
  ButtonModule,
  ContextMenuModule,
  DialogModule,
  FieldsetModule,
  GrowlModule,
  InputTextModule,
  OverlayPanelModule,
  PanelModule,
  PasswordModule,
  TabViewModule,
  ToolbarModule,
  TooltipModule,
  TreeModule
} from 'primeng/primeng';

import { DataService } from './service/data.service';
import { AuthService } from './service/auth.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    ContextMenuModule,
    DialogModule,
    FieldsetModule,
    GrowlModule,
    InputTextModule,
    OverlayPanelModule,
    PanelModule,
    PasswordModule,
    TabViewModule,
    ToolbarModule,
    TooltipModule,
    TreeModule],
  declarations: [],
  exports: [
    CommonModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    FieldsetModule,
    GrowlModule,
    InputTextModule,
    PanelModule,
    PasswordModule,
    TabViewModule,
    ToolbarModule]
})
export class SharedModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [FormBuilder, DataService, AuthService]
    };
  }
}
