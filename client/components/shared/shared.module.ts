import {NgModule, ModuleWithProviders} from '@angular/core';

import { CommonModule }        from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule }         from '@angular/forms';

import {ButtonModule, ContextMenuModule, InputTextModule, OverlayPanelModule, ToolbarModule, TooltipModule, TreeModule} from "primeng/primeng";

import {ApplicationController} from './applicationcontroller';
import {DataService} from './data.service';
import {EmptyComponent} from './empty.component';
import {FolderChooserComponent} from './components/folderchooser.component';


@NgModule({
  imports: [CommonModule, FormsModule, HttpModule, ButtonModule, ContextMenuModule, InputTextModule, OverlayPanelModule, ToolbarModule, TooltipModule, TreeModule],
  declarations: [EmptyComponent, FolderChooserComponent],
  exports: [CommonModule, FormsModule, HttpModule, EmptyComponent, FolderChooserComponent]
})
export class SharedModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [ApplicationController, DataService]
    };
  }
}
