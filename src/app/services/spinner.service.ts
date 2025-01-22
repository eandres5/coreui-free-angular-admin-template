import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  constructor(private _spinnerService: NgxSpinnerService) { }

  public verSpinner(){
    this._spinnerService.show();
  }
  
  public cerrarSpinner(){
    this._spinnerService.hide();
  }
}
