import { NgxNeoModalMatService, AlertButton, AlertResult } from 'ngx-neo-modal-mat';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public modalResult: any;

  constructor(private neoModalService: NgxNeoModalMatService) { this.modalResult = new Object(); }

  public async alertModal() {
    await window.alert('This is an alert.');
  }

  public async  yesNoModal() {
    const result: AlertResult = await this.neoModalService.decision('Are you soure?', 'Ok', 'NO OK', AlertButton.Accept);
    if (result.ButtonResponse === AlertButton.Accept) {
      this.modalResult.button = 'Accept';
    } else {
      this.modalResult.button = 'Cancel';
    }
  }


  public async inputModal() {
    const result = await this.neoModalService.input('Input modal', 'With autofocus', null, true, null);
    if (result.ButtonResponse === AlertButton.Accept) {
      this.modalResult.button = 'Accept';
      this.modalResult.message = result.messageInput;
    } else {
      this.modalResult.button = 'Cancel';
      this.modalResult.message = result.messageInput;
    }
  }

  public async inputModalCancel() {
    const result = await this.neoModalService.input('Input focus on cancel', 'With autofocus', null, true, AlertButton.Cancel);
    if (result.ButtonResponse === AlertButton.Accept) {
      this.modalResult.button = 'Accept';
      this.modalResult.message = result.messageInput;
    } else {
      this.modalResult.button = 'Cancel';
      this.modalResult.message = result.messageInput;
    }
  }
}
