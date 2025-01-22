import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, CardComponent, CardBodyComponent, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import {Router} from "@angular/router";
import {Button} from "primeng/button";
import {ConfirmDialog} from "primeng/confirmdialog";
import {Dialog} from "primeng/dialog";
import {Toast} from "primeng/toast";
import {FormsModule} from "@angular/forms";
import {MessageService} from "primeng/api";
import {LoginService} from "../../../services/login/login.service";
import {UsuarioService} from "../../../services/usuario/usuario.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
  imports: [ContainerComponent, RowComponent, ColComponent, CardGroupComponent, CardComponent, CardBodyComponent, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle, Button, ConfirmDialog, Dialog, Toast, FormsModule]
})
export class LoginComponent {

  visible: boolean = false;
  correo: string = '';
  identificacion: string = '';
  password: string = '';

  constructor(private router: Router, public messageService: MessageService,
              private _loginService: LoginService,
              private usuarioService: UsuarioService) { }

  login () {

    var usuario = {
      "identificacion": this.identificacion,
      "password": this.password
    }

    this._loginService.login(usuario).subscribe((res: any)=>{
      this._loginService.saveToken(res.token);
      this.router.navigate(['/dashboard']);
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Identifiación o contraseña incorrectos", life: 2500 });
    });

  }

  showOlvidoPassword() {
    this.visible = true;

  }

  save () {
    if (this.correo == '' || this.correo == undefined) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe ingresar la dirección de correo electronico', life: 2500 });
    } else {
      this.usuarioService.recoveryPassword(this.correo).subscribe((res: any) => {
        if(res.message == "Mail enviado") {
          this.visible = false;
          this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Por favor revise su bandeja de correo o la bandeja de spam', life: 3500 });
        }
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message, life: 2500 });
      })

    }
  }
}
