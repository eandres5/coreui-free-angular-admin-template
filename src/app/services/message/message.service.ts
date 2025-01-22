import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private toastr: ToastrService) { }
  /**
   * The function displays a success message using the Toastr library in TypeScript.
   * @param {string} mensaje - mensaje is a string parameter that represents the message to be
   * displayed in the success notification.
   */
  showSuccess(mensaje: string) {
    this.toastr.success('', mensaje);
  }

  showWarnning(mensaje: string) {
    this.toastr.warning('', mensaje);
  }

  showError(mensaje: string) {
    this.toastr.error('', mensaje);
  }

  showInfo(mensaje: string) {
    this.toastr.info('', mensaje);
  }
}
