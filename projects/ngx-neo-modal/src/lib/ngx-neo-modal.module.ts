import { NgxNeoModalService } from './ngx-neo-modal.service';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { NgxNeoModalComponent } from './ngx-neo-modal.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxNeoScrollBlockService } from './utilities/ngx-neo-scrollblock.service';
import { BodyScrollOptions, SCROLL_CONFIG } from './utilities/interfaces';

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
  static forRoot(config?: BodyScrollOptions): ModuleWithProviders {

    return {
      ngModule: NgxNeoModalModule,
      providers: [
        NgxNeoModalService,
        NgxNeoScrollBlockService,
        { provide: SCROLL_CONFIG, useValue: config }
      ]
    };
  }
}
