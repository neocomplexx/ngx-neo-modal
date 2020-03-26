import { NgxNeoModalService, AlertButton, AlertResult } from 'ngx-neo-modal';
// import { NgxNeoModalMatService, AlertButton, AlertResult } from 'ngx-neo-modal-mat';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public modalResult: any;

  constructor(
    private neoModalService: NgxNeoModalService
    // private neoModalService: NgxNeoModalMatService
    ) { this.modalResult = new Object(); }

  public async alertModal() {
    await window.alert('This is an alert.');
  }

  public async  yesNoModal() {
    const result: AlertResult = await this.neoModalService.yesNoCancel('title msg', 'message', AlertButton.Cancel);
    if (result.ButtonResponse === AlertButton.Yes) {
      this.modalResult.button = 'Yes';
    } else if (result.ButtonResponse === AlertButton.Cancel) {
      this.modalResult.button = 'Cancel';
    } else if (result.ButtonResponse === AlertButton.No) {
      this.modalResult.button = 'No';
    }
  }

  public async decision() {
    const result = await this.neoModalService.decision('question msg', 'success msg', 'cancel msg', AlertButton.Accept);
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
