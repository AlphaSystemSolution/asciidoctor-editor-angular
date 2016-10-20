import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule }   from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import {
  ButtonModule,
  ContextMenuModule,
  DialogModule,
  FieldsetModule,
  InputTextModule,
  OverlayPanelModule,
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
    RouterModule,
    ButtonModule,
    ContextMenuModule,
    DialogModule,
    FieldsetModule,
    InputTextModule,
    OverlayPanelModule,
    TabViewModule,
    ToolbarModule,
    TooltipModule,
    TreeModule],
  declarations: [],
  exports: [
    CommonModule,
    FormsModule,
    HttpModule,
    RouterModule,
    ButtonModule,
    FieldsetModule,
    TabViewModule,
    ToolbarModule]
})
export class SharedModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [DataService, AuthService]
    };
  }
}
