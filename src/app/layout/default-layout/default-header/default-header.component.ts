import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import {Router, RouterLink} from '@angular/router';

import {
  AvatarComponent,
  BadgeComponent,
  BreadcrumbRouterComponent,
  ColorModeService,
  ContainerComponent,
  DropdownComponent,
  DropdownDividerDirective,
  DropdownHeaderDirective,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
  HeaderComponent,
  HeaderNavComponent,
  HeaderTogglerDirective,
  NavLinkDirective,
  SidebarToggleDirective
} from '@coreui/angular';

import { IconDirective } from '@coreui/icons-angular';
import {Button} from "primeng/button";
import {ConfirmDialog} from "primeng/confirmdialog";
import {Dialog} from "primeng/dialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Toast} from "primeng/toast";
import {LoginService} from "../../../services/login/login.service";
import {UsuarioService} from "../../../services/usuario/usuario.service";
import {Usuario} from "../../../models/class/usuario";
import {UsuarioProveedor} from "../../../models/class/usuarioProveedor";
import {MessageService} from "primeng/api";
import {CONSTANTES} from "../../../util/constantes";

@Component({
    selector: 'app-default-header',
    templateUrl: './default-header.component.html',
  imports: [ContainerComponent, HeaderTogglerDirective, SidebarToggleDirective, IconDirective, HeaderNavComponent, NavLinkDirective, RouterLink, NgTemplateOutlet, BreadcrumbRouterComponent, DropdownComponent, DropdownToggleDirective, AvatarComponent, DropdownMenuDirective, DropdownHeaderDirective, DropdownItemDirective, BadgeComponent, DropdownDividerDirective, Button, ConfirmDialog, Dialog, ReactiveFormsModule, Toast, FormsModule]
})
export class DefaultHeaderComponent extends HeaderComponent {

  readonly #colorModeService = inject(ColorModeService);
  readonly colorMode = this.#colorModeService.colorMode;
  visible: boolean = false;

  readonly colorModes = [
    { name: 'light', text: 'Light', icon: 'cilSun' },
    { name: 'dark', text: 'Dark', icon: 'cilMoon' },
    { name: 'auto', text: 'Auto', icon: 'cilContrast' }
  ];

  identificacion: string = '';
  usuario: UsuarioProveedor = new UsuarioProveedor();

  readonly icons = computed(() => {
    const currentMode = this.colorMode();
    return this.colorModes.find(mode => mode.name === currentMode)?.icon ?? 'cilSun';
  });

  constructor(public loginService: LoginService, private _proveedorService: UsuarioService, private messageService: MessageService,
              private _clienteService: UsuarioService, private router: Router) {
    super();
    this.identificacion = this.loginService.valuesPayload.nameid;
    this.getProveedor();
  }

  getProveedor() {
    this._proveedorService.geUsuarioProveedor(this.identificacion).subscribe(res => {
      this.usuario = res;
    });
  }

  sidebarId = input('sidebar1');

  abrirConfiguracion() {
    this.visible = true;
  }

  save() {
    if (this.usuario.identificacion == '' || this.usuario.identificacion == undefined) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe ingresar una identificación valida", life: 2500 });
    } else if (this.usuario.password == '' || this.usuario.password == undefined) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Si desea cambiar la constraseña debe ingresar una nueva", life: 3500 });
    } else {

      this._clienteService.updateUsuarioProveedor(this.usuario).subscribe(res => {
        this.visible = false;
        this.router.navigate(['/login']);
        this.messageService.add({ severity: 'info', summary: 'Info', detail: "Cliente Actualizado", life: 2500 });
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message, life: 2500 });
      });
    }
  }
}
