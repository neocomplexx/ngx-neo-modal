import { BrowserModule } from '@angular/platform-browser';
import { NgxNeoModalMatModule } from 'ngx-neo-modal-mat';
import { NgxNeoModalModule } from 'ngx-neo-modal';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    NgxNeoModalMatModule,
    NgxNeoModalModule.forRoot(),
    NgbModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
