import { NgxNeoModalService } from './ngx-neo-modal.service';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { NgxNeoModalComponent } from './ngx-neo-modal.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    NgxNeoModalComponent,
  ],
  exports: [
    NgxNeoModalComponent,
  ],
  entryComponents: [NgxNeoModalComponent],
})
export class NgxNeoModalModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgxNeoModalModule,
      providers: [NgxNeoModalService]
    };
  }
}
