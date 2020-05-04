import { NgModule, ModuleWithProviders } from '@angular/core';
import { NgxNeoModalMatComponent } from './ngx-neo-modal-mat.component';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [NgxNeoModalMatComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    TranslateModule.forChild({ extend: true })
  ],
  exports: [NgxNeoModalMatComponent],
  entryComponents: [NgxNeoModalMatComponent],
  providers: [
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { disableClose: true, hasBackdrop: true } }
  ]

})
export class NgxNeoModalMatModule {
}
