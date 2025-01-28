import { AfterViewInit, Component, OnInit } from '@angular/core';

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TableModule} from "primeng/table";
import {ComprobanteService} from "../../services/comprobante/comprobante.service";
import {ConfirmationService, Footer, MessageService} from "primeng/api";
import {Toast} from "primeng/toast";
import {UsuarioService} from "../../services/usuario/usuario.service";
import {CONSTANTES} from "../../util/constantes";
import {Button} from "primeng/button";
import {UsuarioProveedor} from "../../models/class/usuarioProveedor";
import {CedulaValidator} from "../../util/CedulaValidator";
import {Dialog} from "primeng/dialog";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {ViewclienteComponent} from "./viewcliente.component";
import {ConfirmDialog} from "primeng/confirmdialog";
import {RucValidator} from "../../util/RucValidator";
import {CardBodyComponent, CardComponent} from "@coreui/angular";

@Component({
  templateUrl: 'proveedor.component.html',
  imports: [
    ReactiveFormsModule,
    TableModule,
    FormsModule,
    Toast,
    Button,
    Dialog,
    ConfirmDialog,
    CardBodyComponent,
    CardComponent
  ]
})
export class ProveedorComponent implements OnInit, AfterViewInit {

  listaClientes: any[] = new Array<any>();
  newProveedor: UsuarioProveedor = new UsuarioProveedor();
  ref: DynamicDialogRef | undefined;

  search: String = "";
  visible: boolean = false;

  constructor(private messageService: MessageService,
              private _comprovanteService: ComprobanteService,
              private _clienteService: UsuarioService,
              public dialogService: DialogService,
              private confirmationService: ConfirmationService
  ) {

  }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.getAllProveedores(CONSTANTES.page, CONSTANTES.size);
  }

  getAllProveedores(page: any, size: any) {
    this._clienteService.getAllProveedores(page, size, null).subscribe(res => {
      this.listaClientes = res.items;
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message, life: 2500 });
    });
  }

  showDialog(usuario: any, tipo: any) {
    this.visible = true;
    if(tipo === 'NUEVO') {
      this.newProveedor = new UsuarioProveedor();
      this.newProveedor.idUsuario = 0;
    } else {
      this.newProveedor.idUsuario = usuario.idUsuario;
      this.newProveedor.nombres = usuario.nombres;
      this.newProveedor.apellidos = usuario.apellidos;
      this.newProveedor.identificacion = usuario.identificacion;
      this.newProveedor.mail = usuario.mail;
      this.newProveedor.telefono = usuario.telefono;
      this.newProveedor.direccion = usuario.direccion;
    }
  }

  ver(customer: any) {
    this.ref = this.dialogService.open(ViewclienteComponent, {
      header: 'Informacion Proveedor',
      width: '50%',
      modal: true,
      contentStyle: { overflow: 'auto' },
      closable: true,
      templates: {
        footer: Footer
      },
      data: customer
    });
  }

  descargarPdf(customer: any) {

  }

  onLazyLoad(event: any) {
    const page = event.first / event.rows;
    const size = event.rows;
    // this.getAllVentas(page, size);
  }

  save(){
    if(this.newProveedor.nombres == "" || this.newProveedor.nombres == undefined){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Los nombres son requeridos", life: 2500 });
    } else if(this.newProveedor.apellidos == "" || this.newProveedor.apellidos == undefined) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Los apellidos son requeridos", life: 2500 });
    } else if(this.newProveedor.identificacion == "" || this.newProveedor.identificacion == undefined) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "El número de identificacion es requerido", life: 2500 });
    } else if(this.newProveedor.mail === '' || !this.isValidEmail(this.newProveedor.mail)) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "El mail es requerido", life: 2500 });
    } else if(this.newProveedor.telefono == "" || this.newProveedor.telefono == undefined || this.newProveedor.telefono.length > 10) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Verifique el campo telefono por favor", life: 2500 });
    } else if (this.newProveedor.direccion == "" || this.newProveedor.direccion == undefined) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "La dirección es requerida", life: 2500 });
    } else if(!RucValidator.validarRuc(this.newProveedor.identificacion)){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Número de cedula no valido", life: 2500 });
    } else {
      this.newProveedor.nombreRol = "PROVEEDOR";

      if (this.newProveedor.idUsuario == 0) {
        this._clienteService.saveUsuarioProveedor(this.newProveedor).subscribe(res => {
          this.visible = false;
          this.messageService.add({ severity: 'info', summary: 'Info', detail: "Cliente registrado", life: 2500 });
          this.getAllProveedores(CONSTANTES.page, CONSTANTES.size);
        }, error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message, life: 2500 });
          this.getAllProveedores(CONSTANTES.page, CONSTANTES.size);
        });
      } else {
        this._clienteService.updateUsuarioProveedor(this.newProveedor).subscribe(res => {
          this.visible = false;
          this.messageService.add({ severity: 'info', summary: 'Info', detail: "Cliente Actualizado", life: 2500 });
          this.getAllProveedores(CONSTANTES.page, CONSTANTES.size);
        }, error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message, life: 2500 });
          this.getAllProveedores(CONSTANTES.page, CONSTANTES.size);
        });
      }

    }
  }

  eliminar(customer: any) {
    this.confirmationService.confirm({
      message: 'Esta seguro de eliminar este registro ?',
      header: 'Eliminar Registro',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Eliminar',
        severity: 'danger',
      },

      accept: () => {
        this._clienteService.deleteUsuario(customer).subscribe(res=>{
          this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Registro eliminado' });
          this.getAllProveedores(CONSTANTES.page, CONSTANTES.size);
        }, error => {
          this.messageService.add({ severity: 'error', summary: 'Rejected', detail: error.error.message, life: 2500 });
          this.getAllProveedores(CONSTANTES.page, CONSTANTES.size);
        });
      },
      reject: () => {
      },
    });

  }

  validarRuc(){
    if(!RucValidator.validarRuc(this.newProveedor.identificacion)){
      this.messageService.add({ severity: 'error', summary: 'Rejected', detail: "RUC no valido", life: 2500 });
    }
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

}

