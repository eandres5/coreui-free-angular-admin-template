import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {TableModule} from "primeng/table";
import {ComprobanteService} from "../../services/comprobante/comprobante.service";
import {CONSTANTES} from "../../util/constantes";
import {Dialog} from "primeng/dialog";
import {Comprobante} from "../../models/class/comprobante";
import {DetalleComprobante} from "../../models/class/detalleComprobante";
import {FormsModule} from "@angular/forms";
import {UsuarioService} from "../../services/usuario/usuario.service";
import {NgIf} from "@angular/common";
import {Toast} from "primeng/toast";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {Footer, MessageService} from "primeng/api";
import {ProductolistComponent} from "./productolist.component";
import {DetalleProducto} from "../../models/class/DetalleProducto";
import {DetallecomprobanteService} from "../../services/DetalleComprobante/detallecomprobante.service";
import {PdfService} from "../../services/pdf.service";
import {ViewcomprobanteComponent} from "./viewcomprobante.component";
import {CardBodyComponent, CardComponent} from "@coreui/angular";
import {PdfVentaService} from "../../services/pdfVenta.service";


@Component({
  templateUrl: 'ventas.component.html',
    imports: [ButtonModule, TableModule, Dialog, FormsModule, NgIf, Toast, ButtonModule, CardBodyComponent, CardComponent]
})
export class VentasComponent implements OnInit, AfterViewInit {

  customers!: any[];
  listaVentas!: any[];
  visible: boolean = false;
  comprobante: Comprobante = new Comprobante();
  listaProductos: DetalleComprobante[] = new Array<DetalleComprobante>();
  identificacionProveedor: string = '';
  nombreProveedor: string = '';
  direccionProveedor: string = '';
  habilitarProveedor: boolean = false;
  nuevoPro: boolean = false;
  idProveedor: number = 0;
  detalle: DetalleComprobante = new DetalleComprobante();
  ref: DynamicDialogRef | undefined;
  dataListProductos!: any[];
  detalleProducto: DetalleProducto = new DetalleProducto();
  totalRecords: any;
  loading: boolean = false;
  selectedSize: any = undefined;
  selectedFile: File | null = null;

  showDialog() {
    this.visible = true;
    this.comprobante = new Comprobante();
    this.identificacionProveedor = '';
    this.nombreProveedor = '';
    this.direccionProveedor = '';
    this.habilitarProveedor = false;
    this.listaProductos = new Array<DetalleComprobante>();
    this.nuevoPro = false;
  }

  constructor(private _ventaService: ComprobanteService,
              private _proveedorService: UsuarioService,
              public _comprobanteService: ComprobanteService,
              public dialogService: DialogService,
              public messageService: MessageService,
              private _detalleComprobante: DetallecomprobanteService,
              // public pdfService: PdfService,
              public pdfService: PdfVentaService

  ) {

  }

  ngOnInit() {
    this.listaVentas = [];
    this.getAllVentas(CONSTANTES.page, CONSTANTES.size);
  }

  ngAfterViewInit(): void {
  }

  getAllVentas(page: any, size: any) {
    this._ventaService.getAllVentas(page, size, null).subscribe(res => {
        this.listaVentas = res.items
        this.totalRecords = res.totalCount;
    });
  }

  nuevo() {
    this.comprobante = new Comprobante();
  }

  onLazyLoad(event: any) {
    const page = event.first / event.rows;
    const size = event.rows;
    this.getAllVentas((page + 1) + "", size + "");
  }

  buscarProducto() {

  }

  getProveedor() {
    this._proveedorService.geUsuarioProveedor(this.identificacionProveedor).subscribe(res => {
      this.comprobante.idUsuarioCliente = res.idUsuario + "";
      this.idProveedor = res.idUsuario;
      this.nombreProveedor = res.nombres;
      this.direccionProveedor = res.direccion;
      this.habilitarProveedor = true;
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Cliente no encontrado', life: 2500 });
    });
  }

  onTipoComprobante(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    if(selectedValue == "...") {
      this.comprobante.numeroComprobante = '';
    } else {
      this._comprobanteService.getUltimoNumeroComprobante(selectedValue, "VENTA").subscribe(res => {
        if(res) {
          this.comprobante.numeroComprobante = res;
        }
      })
    }
  }

  agregar() {

    if (this.detalle.nombreProducto == '' || !this.detalle.nombreProducto) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Nombre del producto es requerido', life: 2500 });
    } else if (this.detalle.descripcion == '' || !this.detalle.descripcion) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Descripcion es requerida', life: 2500 });
    } else if (this.detalle.cantidad == '' || this.detalle.cantidad < '0') {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Cantidad es requerida', life: 2500 });
    } else if (this.detalle.precioUnitario == '' || this.detalle.precioUnitario < '0') {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Precio es requerido', life: 2500 });
    } else if (this.listaProductos.some(producto => producto.nombreProducto === this.detalle.nombreProducto)) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El producto ya está agregado en la lista', life: 2500 });
    } else if (this.comprobante.iva === '' || Number(this.comprobante.iva) < 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El valor de IVA es requerido', life: 2500 });
    } else if (Number(this.detalle.cantidad) > Number(this.detalle.stock)) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El stock no es suficiente', life: 2500 });
    } else {
      this.nuevoPro = false;
      const cantidad = parseFloat(this.detalle.cantidad);
      const precioUnitario = parseFloat(this.detalle.precioUnitario.replace(',', '.'));
      const subtotalProducto = precioUnitario * cantidad;
      this.comprobante.subtotal = (parseFloat(this.comprobante.subtotal) + subtotalProducto).toString();
      const iva = parseFloat(this.comprobante.iva) / 100;
      this.comprobante.total = (parseFloat(this.comprobante.subtotal) * (1 + iva)).toFixed(2);

      this.listaProductos.push(this.detalle);
      this.detalle = new DetalleComprobante();
      this.nuevoPro = false;
    }

  }

  save() {
    if (this.comprobante.numeroComprobante == '' || this.comprobante.numeroComprobante == undefined) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El número de compra es requerido', life: 2500 });
    } else if (this.comprobante.tipoComprobante == '' || this.comprobante.tipoComprobante == "...") {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El tipo de comprabante es requerido', life: 2500 });
    } else if (this.comprobante.iva === '' || Number(this.comprobante.iva) < 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El iva es requerido', life: 2500 });
    } else if (this.comprobante.total == '' || this.comprobante.total == undefined) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El total de compra es requerido', life: 2500 });
    } else if (this.listaProductos.length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La compra debe tener al menos 1 detalle para continuar', life: 2500 });
    } else if (this.comprobante.tipoPago == "" || this.comprobante.tipoPago == "..." ) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El tipo de pago es requerido', life: 2500 });
    } else if (this.comprobante.tipoPago == 'TRANSFERENCIA' && this.selectedFile == null) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe ingresar el comprobante en formato PDF', life: 3000 });
    } else {
      this.comprobante.DetalleComprobantes = this.listaProductos;
      this.comprobante.total = this.comprobante.total + "";
      let lista = this.comprobante.DetalleComprobantes;

      for (let index = 0; index < lista.length; index++) {
        lista[index].precioUnitario = lista[index].precioUnitario + "";
        lista[index].cantidad = lista[index].cantidad + "";

      }
      this.comprobante.DetalleComprobantes = lista;
      const fecha = new Date();
      this.comprobante.fechaEmision = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}-${fecha.getDate().toString().padStart(2, '0')}`;
      this.comprobante.tipoTransaccion = 'VENTA';
      this.comprobante.iva = this.comprobante.iva + "";
      this.comprobante.numeroComprobante = this.comprobante.numeroComprobante + "";
      this.comprobante.idUsuarioComerciante = '2'

      this._ventaService.saveComprobante(this.comprobante).subscribe(res => {
        this.visible = false;
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Venta Registrada', life: 2500 });
        this.getAllVentas(CONSTANTES.page, CONSTANTES.size);
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message, life: 2500 });
        this.getAllVentas(CONSTANTES.page, CONSTANTES.size);
      });
    }
  }

  eliminarProducto(detalle: any) {
    const index = this.listaProductos.indexOf(detalle);
    if (index >= 0) {
      this.listaProductos.splice(index, 1);
      this.recalcularTotales();
    }
  }

  private recalcularTotales() {
    let subtotal = 0;
    this.listaProductos.forEach(producto => {
      const cantidad = parseFloat(producto.cantidad);
      const precioUnitario = parseFloat(producto.precioUnitario.replace(',', '.'));
      subtotal += cantidad * precioUnitario;
    });
    this.comprobante.subtotal = subtotal.toString();
    const iva = parseFloat(this.comprobante.iva) / 100;
    this.comprobante.total = (subtotal * (1 + iva)).toFixed(2);
  }

  show() {
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
        this.detalle.stock = data.stock;
      }
    });

    this.ref.onMaximize.subscribe((value) => {
      this.messageService.add({ severity: 'info', summary: 'Maximized', detail: `maximized: ${value.maximized}` });
    });
  }

  ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
  }


  descargarPdf(element: any) {
    this._ventaService.getComprobante(element.idComprobante, "VENTA").subscribe(res => {
      this.comprobante = res;
      this.detalleProducto.idComprobante = element.idComprobante;
      this._detalleComprobante.getDetalleProducto(this.detalleProducto).subscribe(res => {
        if (res) {
          this.listaProductos = res;
          this.pdfService.generarPdf(this.comprobante, this.listaProductos);
        }
      });
    });
  }

  ver(customer: any) {
    customer.tipoTransaccion = 'VENTA';
    this.ref = this.dialogService.open(ViewcomprobanteComponent, {
      header: 'Informacion Venta',
      width: '80%',
      modal: true,
      contentStyle: { overflow: 'auto' },
      closable: true,
      templates: {
        footer: Footer
      },
      data: customer
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.comprobante.fileBase64 = reader.result?.toString() || "";
      };
      reader.readAsDataURL(file); // Convierte el archivo a Base64
    } else {
      alert('Por favor, seleccione un archivo PDF válido.');
      this.selectedFile = null;
    }
  }

}
