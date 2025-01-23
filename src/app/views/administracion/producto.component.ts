import {ConfirmationService, Footer, MessageService} from "primeng/api";
import {Toast} from "primeng/toast";
import {CONSTANTES} from "../../util/constantes";
import {Button} from "primeng/button";
import {Dialog} from "primeng/dialog";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {ViewclienteComponent} from "./viewcliente.component";
import {ConfirmDialog} from "primeng/confirmdialog";
import {AfterViewInit, Component, OnInit} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TableModule} from "primeng/table";
import {ProductoService} from "../../services/producto/producto.service";
import {CardBodyComponent, CardComponent} from "@coreui/angular";
import {NgForOf, NgIf} from "@angular/common";
import {Producto} from "../../models/class/producto";
import {Usuario} from "../../models/class/usuario";
import {UsuarioService} from "../../services/usuario/usuario.service";

@Component({
  templateUrl: 'producto.component.html',
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
export class ProductoComponent implements OnInit, AfterViewInit {

  listaProductos: any[] = [];
  ref: DynamicDialogRef | undefined;
  visible: boolean = false;
  producto: Producto = new Producto();
  imgQr: string = '';
  visibleVer: boolean = false;
  proveedor: Usuario = new Usuario();
  listaClientes: any[] = new Array<any>();
  idProveedor: String = "";
  selectedProveedor: any = null;
  selectedProveedorId: number | null = null;
  editarStock: boolean = false;
  totalRecords: any;
  loading: boolean = false;

  constructor(private _productoService: ProductoService,
              private messageService: MessageService,
              public dialogService: DialogService,
              private confirmationService: ConfirmationService,
              private _clienteService: UsuarioService
  ) {
  }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.getAllProductos(CONSTANTES.page, CONSTANTES.size);
    this.getAllProveedores();
  }

  getAllProductos(page:any, size:any) {
    this._productoService.getAllPoductosByUsuario(page, size, null).subscribe(res => {
      this.listaProductos = res.items;
      this.totalRecords = res.totalCount;
    }, error => {
      this.messageService.add({ severity: 'info', summary: 'Info', detail: error.error.message, life: 2500 });
    });
  }

  getAllProveedores() {
    this.loading = true;
    this._clienteService.getAllProveedores('0', '200', null).subscribe(res => {
      this.listaClientes = res.items;
      this.totalRecords = res.totalCount;
      this.loading = false;
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message, life: 2500 });
    });
  }

  onLazyLoad(event: any) {
    const page = event.first / event.rows;
    const size = event.rows;
    this.getAllProductos((page + 1) + "" , size);
  }

  showDialog(producto: any, tipo: any) {
    this.visible = true;
    if(tipo === 'NUEVO') {
      this.editarStock = false;
      this.getAllProveedores();
      this.selectedProveedor = null;
      this.producto = new Producto();
    } else {
      this.editarStock = true;
      this.producto = producto;
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
        this._productoService.deleteProducto(customer).subscribe(res=>{
          this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Registro eliminado' });
          this.getAllProductos(CONSTANTES.page, CONSTANTES.size);
        }, error => {
          this.messageService.add({ severity: 'error', summary: 'Rejected', detail: error.error.message, life: 2500 });
          this.getAllProductos(CONSTANTES.page, CONSTANTES.size);
        });
      },
      reject: () => {
      },
    });
  }

  verProducto(producto: any) {
    this.visibleVer = true;
    this._productoService.getProductoQr(producto.idProducto).subscribe(res => {
      this.producto = res.value;
      this.imgQr = `data:image/png;base64,${this.producto.qrCodeImage}`;
    });
  }

  descargarImagen() {
    const base64Image = this.imgQr;
    const link = document.createElement('a');
    link.href = base64Image;
    link.download = 'qrCode.png';
    link.click();
  }

  onProveedorChange(event: any) {
    this.selectedProveedor = this.listaClientes.find(
      (cliente) => cliente.idUsuario === Number(this.selectedProveedorId)
    );
  }

  save() {
    if (this.selectedProveedor == null) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe seleccionar un proveedor para continuar", life: 2500 });
    } else if (this.producto.nombreProducto.trim() == '' || this.producto.nombreProducto == undefined) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe ingresar el nombre del producto", life: 2500 });
    } else if (this.producto.descripcion.trim() == '' || this.producto.descripcion == undefined) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe ingresar la descripcion del producto", life: 2500 });
    } else { // @ts-ignore
      if (this.producto.nombreCategoria.trim() == '' || this.producto.nombreCategoria == undefined) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe ingresar la categoria del producto", life: 2500 });
          } else if (Number(this.producto.precio) <= 0 || this.producto.precio == undefined) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Revise el precio", life: 2500 });
          } else if (Number(this.producto.stock) <= 0 || this.producto.stock == undefined || this.producto.stock == '') {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Revise la cantidad del producto", life: 2500 });
          } else {
            this.producto.idProveedor = this.selectedProveedorId?.toString();
            this.producto.stock = this.producto.stock.toString();

            if (this.producto.idProducto == undefined) {
              var productoDto = {
                "precio": this.producto.precio + "",
                "stock": this.producto.stock.toString(),
                "categoriaId": "0",
                "descripcion": this.producto.descripcion,
                "idProducto": undefined,
                "idProveedor": this.selectedProveedorId?.toString(),
                "nombreCategoria": this.producto.nombreCategoria,
                "nombreProducto": this.producto.nombreProducto,
                "qrCodeImage": "",

              };
              this._productoService.saveProducto(productoDto).subscribe(res => {
                this.visible = false;
                this.messageService.add({ severity: 'info', summary: 'Info', detail: "Producto registrado", life: 2500 });
                this.getAllProductos(CONSTANTES.page, CONSTANTES.size);
              }, error => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: "Hubo un problema al registrar el producto" + error.error.message, life: 2500 });
                this.getAllProductos(CONSTANTES.page, CONSTANTES.size);
              });
            } else {
              var productoDtoEdit = {
                "precio": this.producto.precio + "",
                "stock": this.producto.stock.toString(),
                "categoriaId": "0",
                "descripcion": this.producto.descripcion,
                "idProducto": this.producto.idProducto.toString(),
                "idProveedor": this.selectedProveedorId?.toString(),
                "nombreCategoria": this.producto.nombreCategoria,
                "nombreProducto": this.producto.nombreProducto,
                "qrCodeImage": "",

              };

              this._productoService.updateProducto(productoDtoEdit).subscribe(res => {
                if (res.message == "Registro Actualizado") {
                  this.visible = false;
                  this.messageService.add({ severity: 'info', summary: 'Info', detail: "Producto actualizado", life: 2500 });
                  this.getAllProductos(CONSTANTES.page, CONSTANTES.size);
                } else {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: "Hubo un problema al registrar el producto", life: 2500 });
                }
              });

            }

      }
    }
  }

}
