import {NgModule, ModuleWithProviders} from '@angular/core';

import { CommonModule }        from '@angular/common';
import { FormsModule }         from '@angular/forms';

import {ApplicationController} from './applicationcontroller';
import {EmptyComponent} from './empty.component';


@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [EmptyComponent],
  exports: [CommonModule, FormsModule, EmptyComponent]
})
export class SharedModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [ApplicationController]
    };
  }
}
