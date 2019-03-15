/* tslint:disable:no-bitwise */
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, AfterViewInit, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy, Inject } from '@angular/core';
import { NgxNeoScrollBlockService } from './utilities/ngx-neo-scrollblock.service';
import { BodyScrollOptions, SCROLL_CONFIG } from './utilities/interfaces';

@Component({
  templateUrl: './ngx-neo-modal.component.html',
  styleUrls: ['./ngx-neo-modal.component.scss']
})

export class NgxNeoModalComponent implements AfterViewInit, OnDestroy {
  // Default config
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

  @ViewChild('buttons') btn: any;
  @ViewChild('myInput') input: any;
  @ViewChild('myModal') modal: ElementRef;

  constructor(public activeModal: NgbActiveModal, public changeRef: ChangeDetectorRef,
    @Inject(SCROLL_CONFIG) private scrolconfig: BodyScrollOptions,
    private neoScroll: NgxNeoScrollBlockService) {
  }



  ngAfterViewInit() {
    setTimeout(() => this.activeFocus(), 0);
    this.neoScroll.disableBodyScroll(this.modal.nativeElement, this.scrolconfig);
  }

  ngOnDestroy() {
    this.neoScroll.enableBodyScroll(this.modal.nativeElement);
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

  public informResult(res: string) {
    const button: AlertButton = AlertButton[res];
    const respuesta: AlertResult = new AlertResult(button, this.config.input.value);

    this.activeModal.close(respuesta);
    this.activeModal.dismiss(respuesta);
  }

  public setFocus() {
    this.activeFocus(false);
  }


}



export class AlertResult {

  constructor(public ButtonResponse: AlertButton, public messageInput: string) {
  }
}

export enum AlertButton {
  None = 0,
  Accept = 1 << 0,
  Cancel = 1 << 1,
  Yes = 1 << 2,
  No = 1 << 3,
  Retry = 1 << 4
}
