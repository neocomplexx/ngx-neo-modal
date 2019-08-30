import { Component, OnInit, Inject, AfterViewInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'lib-ngx-neo-modal-mat',
  templateUrl: './ngx-neo-modal-mat.component.html',
  styleUrls: ['./ngx-neo-modal-mat.component.scss']
})
export class NgxNeoModalMatComponent implements OnInit, AfterViewInit {

  @ViewChild('buttons') btn: any;
  @ViewChild('myInput') input: any;


  public config = {
    title: {
      visibility: true,
      text: 'This is a title'
    },
    message: 'This is a message',
    type: null,
    input: {
      visibility: false,
      placeholder: 'Ingrese su texto aquí',
      value: null,
      autofocus: false,
      id: 'neoInput'
    },
    button: {
      yes: {
        visibility: false,
        autofocus: false,
        text: 'Si',
        id: 'neoBtnSi'
      },
      no: {
        visibility: false,
        autofocus: false,
        text: 'No',
        id: 'neoBtnNo'
      },
      retry: {
        visibility: false,
        autofocus: false,
        text: 'Reintentar',
        id: 'neoBtnRetry'
      },
      cancel: {
        visibility: true,
        autofocus: false,
        text: 'Cancelar',
        id: 'neoBtnCancel'
      },
      accept: {
        visibility: true,
        autofocus: true,
        text: 'Aceptar',
        id: 'neoBtnAccept'
      },
    }
  };


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public activeModal: MatDialogRef<NgxNeoModalMatComponent>) {
    this.mergeDeep(this.config, data.config);
  }

  ngOnInit() {
  }


  private isObject(item): boolean {
    return (item && typeof item === 'object' && !Array.isArray(item));
  }

  private mergeDeep(target, ...sources): any {
    if (!sources.length) { return target; }
    const source = sources.shift();

    if (this.isObject(target) && this.isObject(source)) {
      for (const key in source) {
        if (this.isObject(source[key])) {
          if (!target[key]) { Object.assign(target, { [key]: {} }); }
          this.mergeDeep(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }

    return this.mergeDeep(target, ...sources);
  }

  private activeFocus(inputModal = true) {
    const foc: string = this.getButtonFocus();
    const inputFocus = this.getInputFocus();

    // Find element in DOM and focus.
    if (inputFocus && inputModal && (!foc || foc === 'neoBtnAccept')) {
      this.input.nativeElement.focus();
    } else if (foc) {
      const button = this.btn.nativeElement.children.namedItem(foc);
      if (button) { button.focus(); }
    }
  }

  private getButtonFocus(): string {
    const button = Object.keys(this.config.button)
      .find(key => this.config.button[key].visibility && this.config.button[key].autofocus);
    if (button) {
      return this.config.button[button].id;
    } else {
      return null;
    }

  }

  private getInputFocus(): string {
    if (this.config.input.visibility && this.config.input.autofocus) {
      return this.config.input.id;
    } else {
      return null;
    }
  }




  ngAfterViewInit() {
    setTimeout(() => this.activeFocus(), 0);
  }


  public informResult(res: string) {
    const button: AlertButton = AlertButton[res];
    const respuesta: AlertResult = new AlertResult(button, this.config.input.value);

    this.activeModal.close(respuesta);
  }

  public setFocus() {
    this.activeFocus(false);
  }

}

export class AlertResult {

  constructor(public ButtonResponse: AlertButton, public messageInput: string) {
  }
}

// tslint:disable:no-bitwise
export enum AlertButton {
  None = 0,
  Accept = 1 << 0,
  Cancel = 1 << 1,
  Yes = 1 << 2,
  No = 1 << 3,
  Retry = 1 << 4
}

