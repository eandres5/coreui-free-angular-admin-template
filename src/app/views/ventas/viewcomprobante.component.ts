import { AfterViewInit, Component, HostBinding, Inject, Input, OnInit, Renderer2, forwardRef } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Button} from "primeng/button";
import {TableModule} from "primeng/table";
import {DetalleComprobante} from "../../models/class/detalleComprobante";
import {DetalleProducto} from "../../models/class/DetalleProducto";
import {ComprobanteService} from "../../services/comprobante/comprobante.service";
import {DetallecomprobanteService} from "../../services/DetalleComprobante/detallecomprobante.service";
import {Comprobante} from "../../models/class/comprobante";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";

@Component({
  templateUrl: 'viewcomprobante.component.html',
  imports: [
    FormsModule,
    TableModule
  ]
})
export class ViewcomprobanteComponent implements OnInit, AfterViewInit {

  listaProductos: DetalleComprobante[] = new Array<DetalleComprobante>();

  ngAfterViewInit(): void {
  }

  comprobante: Comprobante = new Comprobante();
  detalleProducto: DetalleProducto = new DetalleProducto();
  dataReceived: any;
  visible: boolean = false;

  constructor(private _comprobanteService: ComprobanteService,
              private _detalleComprobante: DetallecomprobanteService,
              public ref: DynamicDialogRef,
              public config: DynamicDialogConfig) {
    this.comprobante = new Comprobante();
    this.detalleProducto = new DetalleProducto();
    this.listaProductos = [];
    this.comprobante.idUsuarioComerciante = '2';
    this.comprobante.subtotal = '0';
    this.comprobante.total = '0';
  }

  ngOnInit(): void {

    this.dataReceived = this.config.data;
    this._comprobanteService.getComprobante(this.dataReceived.idComprobante, this.dataReceived.tipoTransaccion).subscribe(res=>{
      this.comprobante = res;
    });

    this.detalleProducto.idComprobante = this.dataReceived.idComprobante;
    this._detalleComprobante.getDetalleProducto(this.detalleProducto).subscribe(res=> {
      if(res) {
        this.listaProductos = res;
      }
    });
  }

  onLazyLoad(event: any) {
    const page = event.first / event.rows;
    const size = event.rows;
    // this.getAllVentas(page, size);
  }
}

