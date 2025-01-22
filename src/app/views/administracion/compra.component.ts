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
import {CardBodyComponent, CardComponent} from "@coreui/angular";
import {DetalleCompra} from "../../models/class/detalleCompra";
import {Compra} from "../../models/class/compra";
import {NgForOf, NgIf} from "@angular/common";
import {CompraService} from "../../services/compra/compra.service";
import { formatDate } from '@angular/common';
import {ProductolistComponent} from "../ventas/productolist.component";

@Component({
  templateUrl: 'compra.component.html',
  imports: [
    ReactiveFormsModule,
    TableModule,
    FormsModule,
    Toast,
    Button,
    Dialog,
    ConfirmDialog,
    CardBodyComponent,
    CardComponent,
    NgIf,
    NgForOf
  ]
})
export class CompraComponent implements OnInit, AfterViewInit {

  listaClientes: any[] = new Array<any>();
  newProveedor: UsuarioProveedor = new UsuarioProveedor();
  ref: DynamicDialogRef | undefined;

  search: String = "";
  visible: boolean = false;

  compra: Compra = new Compra();
  listaProductos: any[] = new Array<any>();
  identificacionProveedor: string = '';
  nombreProveedor: string = '';
  direccionProveedor: string = '';
  habilitarProveedor: boolean = false;
  nuevoPro: boolean = false;
  idProveedor: number = 0;
  detalle: DetalleCompra = new DetalleCompra();
  listaCompras: any[]  = new Array<any>();
  selectedProveedor: any = null;
  selectedProveedorId: number | null = null;

  constructor(private messageService: MessageService,
              private _comprovanteService: ComprobanteService,
              private _clienteService: UsuarioService,
              public dialogService: DialogService,
              private confirmationService: ConfirmationService,
              private _compraService: CompraService
  ) {

  }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.getAllProveedores();
    this.getAllCompras(CONSTANTES.page, CONSTANTES.size);
  }

  getAllCompras(page:any, size:any){
    this._compraService.getAllCompras(page, size, null).subscribe(
      res => {
        this.listaCompras = res.items.map((item: Compra) => ({
          ...item,
          fechaCompra: this.formatDate(item.fechaCompra)
        }));
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message, life: 2500 });
      }
    );
  }

  getAllProveedores() {
    this._clienteService.getAllProveedores('0', '200', null).subscribe(res => {
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
      header: 'Informacion Cliente',
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

  onLazyLoad(event: any) {
    const page = event.first / event.rows;
    const size = event.rows;
    // this.getAllVentas(page, size);
  }

  save(){
    if (this.selectedProveedor == null) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe seleccionar un proveedor", life: 2500 });
    }else if (Number(this.compra.numeroCompra) <= 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "El numero de compra es requerido", life: 2500 });
    } else if (this.compra.tipoComprobante == '') {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "El tipo de comprabante es requerido", life: 2500 });
    } else if (Number(this.compra.iva) < 0 || this.compra.iva == '') {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "El IVA es requerido", life: 2500 });
    } else if (this.compra.totalCompra == '' || this.compra.totalCompra == undefined) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "El total de compra es requerido", life: 2500 });
    } else if (this.compra.fechaCompra == '' || this.compra.fechaCompra == undefined) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "La fecha de compra es requerida", life: 2500 });
    } else if (this.listaProductos.length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "La compra debe tener al menos 1 detalle para continuar", life: 2500 });
    } else {
      this.compra.detalleCompras = this.listaProductos;
      this.compra.totalCompra = this.compra.totalCompra + "";
      let lista = this.compra.detalleCompras;

      for (let index = 0; index < lista.length; index++) {
        lista[index].precioUnitario = lista[index].precioUnitario + "";
        lista[index].cantidadInicial = lista[index].cantidadInicial + "";

      }
      this.compra.idUsuarioProveedor = this.selectedProveedor.idUsuario + "";
      this.compra.idUsuarioComerciante = '2';
      this.compra.iva = this.compra.iva + "";
      this.compra.detalleCompras = lista;

      console.log(this.selectedProveedor);
      this._compraService.saveCompra(this.compra).subscribe(resp=> {
        this.visible = false;
        this.messageService.add({ severity: 'info', summary: 'Info', detail: "Registro guardado", life: 2500 });
        this.getAllCompras(CONSTANTES.page, CONSTANTES.size);
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Error al registrar la compra", life: 2500 });
        this.getAllCompras(CONSTANTES.page, CONSTANTES.size);
      });
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
        // this._clienteService.deleteUsuario(customer).subscribe(res=>{
        //   this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Registro eliminado' });
        //   this.getAllProveedores(CONSTANTES.page, CONSTANTES.size);
        // }, error => {
        //   this.messageService.add({ severity: 'error', summary: 'Rejected', detail: error.error.message, life: 2500 });
        //   this.getAllProveedores(CONSTANTES.page, CONSTANTES.size);
        // });
      },
      reject: () => {
      },
    });

  }

  buscarProducto() {
    // const dialogRef = this._dialog.open(DialogProductoCompraComponent, {
    //   width: 'auto',
    //   // panelClass: 'over-flow-y-auto',
    //   disableClose: true,
    //   data: this.identificacionProveedor
    // });
    // dialogRef.afterClosed().subscribe(res => {
    //   if (res) {
    //     this.nuevoPro = true;
    //     this.detalle.idProducto = res.idProducto;
    //     this.detalle.nombreProducto = res.nombreProducto;
    //     this.detalle.descripcion = res.descripcion;
    //     this.detalle.stock = '0';
    //     this.detalle.precioUnitario = res.precio;
    //   }
    // });

    this.ref = this.dialogService.open(ProductolistComponent, {
      header: 'Lista Productos',
      width: '50vw',
      modal: true,
      contentStyle: { overflow: 'auto' },
      closable: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
      templates: {
        footer: Footer
      }
    });

    this.ref.onClose.subscribe((data: any) => {
      if (data) {
        this.nuevoPro = true;
        this.detalle.idProducto = data.idProducto;
        this.detalle.nombreProducto = data.nombreProducto;
        this.detalle.descripcion = data.descripcion;
        this.detalle.precioUnitario = data.precio;
      }
    });

    this.ref.onMaximize.subscribe((value) => {
      this.messageService.add({ severity: 'info', summary: 'Maximized', detail: `maximized: ${value.maximized}` });
    });

  }

  nuevoProducto() {
    this.detalle = new DetalleCompra();
    this.nuevoPro = true;
  }

  agregar() {

    if (this.detalle.nombreProducto == '' || !this.detalle.nombreProducto) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Nombre del producto es requerido", life: 2500 });
    } else if (this.detalle.descripcion == '' || !this.detalle.descripcion) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Descripcion es requerida", life: 2500 });
    } else if (this.detalle.cantidadInicial == '' || this.detalle.cantidadInicial < '0') {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Cantidad es requerida", life: 2500 });
    } else if (this.detalle.precioUnitario == '' || this.detalle.precioUnitario < '0') {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Precio es requerido", life: 2500 });
    } else {
      this.nuevoPro = false;
      this.listaProductos.push(this.detalle);
      // this.dataListProductos = new MatTableDataSource(this.listaProductos);
      this.detalle = new DetalleCompra();
      this.nuevoPro = false;
    }

  }

  eliminarProducto(detalle: DetalleCompra) {
    const index = this.listaProductos.indexOf(detalle);
    if (index >= 0) {
      this.listaProductos.splice(index, 1);
    }
  }

  private formatDate(fecha: string): string {
    const date = new Date(fecha);
    return formatDate(date, 'yyyy-MM-dd', 'en-US');
  }

  onProveedorChange(event: any) {
    this.selectedProveedor = this.listaClientes.find(
      (cliente) => cliente.idUsuario === Number(this.selectedProveedorId)
    );
    if (this.selectedProveedor != null) {
      this.habilitarProveedor = true;
    } else {
      this.habilitarProveedor = false;
      this.nuevoPro = false;
    }
  }
}
