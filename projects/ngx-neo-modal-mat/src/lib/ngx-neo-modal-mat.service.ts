import { Injectable } from '@angular/core';
import { NgxNeoModalMatComponent, AlertResult, AlertButton } from './ngx-neo-modal-mat.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class NgxNeoModalMatService {
  template: any;

  public originalAlert: any;

  constructor(public dialog: MatDialog, private translate: TranslateService) {
    this.originalAlert = window.alert;
    window.alert = async (msg) => {
      await this.alert(msg);
    };
  }

  private async openModal(config: any): Promise<any> {

    const dialogRef = this.dialog.open(NgxNeoModalMatComponent, {
      data: { config: config }
    });

    return dialogRef.afterClosed().toPromise();

  }


  /**
  * Show message. Can be use as window.alert
  */
  public async alert(msg: string, autofocus = false): Promise<void> {

    const config = {
      title: {
        visibility: false
      },
      message: msg,
      button: {
        cancel: {
          visibility: false
        },
        accept: {
          autofocus: autofocus,
        }
      }
    };
    await this.openModal(config);
  }

  /**
   *
   * Show succsessfull  message
   */
  public async success(msg: string, autofocus = true): Promise<AlertResult> {
    const title = await this.translate.get('SUCCESSTITLE').toPromise();
    const config = {
      title: {
        text: title
      },
      message: msg,
      type: 'success',
      button: {
        cancel: {
          visibility: false
        },
        accept: {
          autofocus: autofocus,
        }
      }
    };
    return this.openModal(config);
  }

  /**
  *
  * Warning message
  */
  public async warning(msg: string, autofocus = false): Promise<AlertResult> {
    const title = await this.translate.get('WARNTITLE').toPromise();
    const config = {
      title: {
        text: title
      },
      message: msg,
      type: 'warning',
      button: {
        cancel: {
          visibility: false
        },
        accept: {
          autofocus: autofocus,
        }
      }
    };

    return this.openModal(config);
  }

  /**
 *
 * Error message
 */
  public async error(msg: string, autofocus = true): Promise<AlertResult> {
    const title = await this.translate.get('ERRORTITLE').toPromise();
    const config = {
      title: {
        text: title
      },
      message: msg,
      type: 'error',
      button: {
        cancel: {
          visibility: false
        },
        accept: {
          autofocus: autofocus,
        }
      }
    };
    return this.openModal(config);
  }

  /**
   *
   * Information message
   */
  public async info(msg: string, autofocus = true): Promise<AlertResult> {
    const title = await this.translate.get('INFOTITLE').toPromise();
    const config = {
      title: {
        text: title
      },
      message: msg,
      type: 'info',
      button: {
        cancel: {
          visibility: false
        },
        accept: {
          autofocus: autofocus,
        }
      }
    };
    return this.openModal(config);
  }

  /**
   *
   * Show decission modal with question and two options for accept or reject.
   */
  // tslint:disable-next-line:max-line-length
  public async decision(questionMsg: string, successMsg?: string, cancelMsg?: string, autofocus = AlertButton.Cancel): Promise<AlertResult> {
    const buttonAcceptFocus = autofocus === AlertButton.Accept;
    const buttonCancelFocus = autofocus === AlertButton.Cancel;

    const title = await this.translate.get('DECISIONTITLE').toPromise();
    const config = {
      title: {
        text: title
      },
      message: questionMsg,
      type: 'question',
      button: {
        cancel: {
          autofocus: buttonCancelFocus
        },
        accept: {
          autofocus: buttonAcceptFocus
        }
      }
    };

    return this.openModal(config)
      .then((value) => {
        if (value.ButtonResponse === AlertButton.Accept) {
          if (successMsg && successMsg !== '') {
            this.success(successMsg);
          }
        } else {
          if (cancelMsg) {
            this.info(cancelMsg);
          }
        }
        return Promise.resolve(value);
      });

  }

  /**
   *
   * Input text message
   */
  // tslint:disable-next-line:max-line-length
  public async input(title: string, placeholder: string, successMsg?: string, autofocus = true, buttonAutofocus: AlertButton = AlertButton.Accept): Promise<AlertResult> {
    const buttonAcceptFocus = buttonAutofocus === AlertButton.Accept;
    const buttonCancelFocus = buttonAutofocus === AlertButton.Cancel;

    const config = {
      title: {
        text: title
      },
      message: '',
      input: {
        placeholder,
        visibility: true,
        autofocus: autofocus
      },
      button: {
        accepct: {
          autofocus: buttonAcceptFocus
        },
        cancel: {
          autofocus: buttonCancelFocus
        }
      }
    };

    return this.openModal(config)
      .then((value) => {
        if (value.ButtonResponse === AlertButton.Accept) {
          if (successMsg) {
            this.success(successMsg);
          }
        }
        return Promise.resolve(value);
      });



  }

  // tslint:disable:no-bitwise
  public async yesNoCancel(title: string, message: string, buttonFocus: AlertButton): Promise<AlertResult> {

    return this.custom(title, message, (AlertButton.Yes | AlertButton.No | AlertButton.Cancel), buttonFocus);
  }

  private async custom(title: string, message: string, buttons: AlertButton, buttonFocus: AlertButton): Promise<AlertResult> {
    const buttonAccept: boolean = (buttons & AlertButton.Accept) > 0;
    const buttonYes: boolean = (buttons & AlertButton.Yes) > 0;
    const buttonCancel: boolean = (buttons & AlertButton.Cancel) > 0;
    const buttonNo: boolean = (buttons & AlertButton.No) > 0;
    const buttonRetry: boolean = (buttons & AlertButton.Retry) > 0;

    const buttonAcceptFocus: boolean = buttonFocus === AlertButton.Accept;
    const buttonYesFocus: boolean = buttonFocus === AlertButton.Yes;
    const buttonCancelFocus: boolean = buttonFocus === AlertButton.Cancel;
    const buttonNoFocus: boolean = buttonFocus === AlertButton.No;
    const buttonRetryFocus: boolean = buttonFocus === AlertButton.Retry;

    const config = {
      title: {
        text: title
      },
      message,
      button: {
        yes: {
          visibility: buttonYes,
          autofocus: buttonYesFocus
        },
        no: {
          visibility: buttonNo,
          autofocus: buttonNoFocus
        },
        retry: {
          visibility: buttonRetry,
          autofocus: buttonRetryFocus
        },
        cancel: {
          visibility: buttonCancel,
          autofocus: buttonCancelFocus
        },
        accept: {
          visibility: buttonAccept,
          autofocus: buttonAcceptFocus
        }
      }
    };


    return this.openModal(config);
  }



  private isObject(item): boolean {
    return (item && typeof item === 'object' && !Array.isArray(item));
  }

  // this will lead to infinite recursion on circular references
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


}
