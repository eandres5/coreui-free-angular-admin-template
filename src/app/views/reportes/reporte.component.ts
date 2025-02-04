import { AfterViewInit, Component, OnInit } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TableModule} from "primeng/table";
import {ComprobanteService} from "../../services/comprobante/comprobante.service";
import {MessageService} from "primeng/api";
import pdfMake from "pdfmake/build/pdfmake";
import {Toast} from "primeng/toast";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import {NgForOf, NgIf} from "@angular/common";

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
    templateUrl: 'reporte.component.html',
  imports: [
    ReactiveFormsModule,
    TableModule,
    FormsModule,
    Toast,
    NgIf,
    NgForOf
  ]
})
export class ReporteComponent implements OnInit, AfterViewInit {

  fechaDesde: String = "";
  fechaHasta: String = "";
  tipoReporte: String = "";
  listaReporte: any[] = [];
  listaComprobantes: any[] = [];
  totalRecords: any;
  loading: boolean = false;
  verCompra: boolean = false;
  verReportes: boolean = false;

  constructor(private messageService: MessageService,
              private _comprovanteService: ComprobanteService
  ) {

  }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
  }

  generarReporte() {
    if (!this.fechaDesde || !this.fechaHasta || !this.tipoReporte || this.tipoReporte === '...') {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe ingresar todos los datos para continuar", life: 2500 });
      return;
    }

    if (this.fechaDesde > this.fechaHasta) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "La fecha desde no puede ser mayor a la fecha hasta", life: 2500 });
      return;
    }

    if (this.tipoReporte == "VENTA" || this.tipoReporte == "DEVOLUCION") {
      // @ts-ignore
      this._comprovanteService.getReporteComprobantes(this.fechaDesde, this.fechaHasta, this.tipoReporte).subscribe(res => {
        const tableBody = [
          // Encabezado de la tabla
          [
            { text: 'Número', style: 'tableHeader' },
            { text: 'Cliente', style: 'tableHeader' },
            { text: 'Fecha Registro', style: 'tableHeader' },
            { text: 'Tipo Pago', style: 'tableHeader' },
            { text: 'Productos', style: 'tableHeader' }, // Nueva columna para los detalles de productos
            { text: 'Subtotal', style: 'tableHeader' },
            { text: 'Total', style: 'tableHeader' }
          ],
          // Filas dinámicas basadas en el JSON recibido
          ...res.map((item: any) => [
            item.numeroComprobante,
            `${item.nombres} ${item.apellidos}`,
            new Date(item.fechaEmision).toLocaleDateString(), // Formatear la fecha
            item.tipoPago,
            item.nombresProductos
              .map((producto: string) => producto) // Mostrar lista de productos con cantidad y descripción
              .join(',\n'),
            `$${item.subtotal.toFixed(2)}`, // Formatear el subtotal
            `$${item.total.toFixed(2)}`,
          ])
        ];

        // Definir el contenido del PDF
        const documentDefinition = {
          content: [
            { text: this.tipoReporte, style: 'header', alignment: 'center' },
            { text: '\n' },
            { text: `Fecha Desde: ${this.fechaDesde}` },
            { text: `Fecha Hasta: ${this.fechaHasta}` },
            { text: '\n' },
            {
              table: {
                headerRows: 1,
                widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', '*'], // Ajuste de anchos
                body: tableBody
              }
            }
          ],
          styles: {
            header: {
              fontSize: 17,
              bold: true,
              margin: [0, 0, 0, 10]
            },
            tableHeader: {
              bold: true,
              fontSize: 12,
              color: 'black'
            }
          }
        };
        // @ts-ignore
        pdfMake.createPdf(documentDefinition).download('reporte.pdf');
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message, life: 2500 });

      });
    } else {
      // @ts-ignore
      this._comprovanteService.getReporteCompras(this.fechaDesde, this.fechaHasta).subscribe(res => {
        const tableBody = [
          // Cabecera de la tabla principal
          [
            { text: 'Número Compra', style: 'tableHeader' },
            { text: 'Proveedor', style: 'tableHeader' },
            { text: 'Fecha Compra', style: 'tableHeader' },
            { text: 'Total Productos', style: 'tableHeader' },
            { text: 'Total', style: 'tableHeader' }
          ],
          // Filas dinámicas basadas en el JSON recibido
          ...res.flatMap((item: any) => {
            const mainRow = [
              item.numeroComprobante,
              `${item.nombres} ${item.apellidos}`,
              new Date(item.fechaEmision).toLocaleDateString(), // Formatear la fecha
              item.items,
              `$${item.total.toFixed(2)}` // Formatear el total
            ];

            // Filas para los detalles de productos
            const productDetails = item.detallesProductos.map((detalle: any) => [
              { text: `Producto: ${detalle.nombreProducto} Descripción: ${detalle.descripcion} Cantidad: ${detalle.cantidad}`, colSpan: 5, alignment: 'left' },
              '', '', '', ''
            ]);

            return [mainRow, ...productDetails]; // Combinar fila principal con detalles
          })
        ];

        // Definir el contenido del PDF
        const documentDefinition = {
          content: [
            { text: this.tipoReporte, style: 'header', alignment: 'center' },
            { text: '\n' },
            { text: `Fecha Desde: ${this.fechaDesde}` },
            { text: `Fecha Hasta: ${this.fechaHasta}` },
            { text: '\n' },
            {
              table: {
                headerRows: 1,
                widths: ['auto', '*', 'auto', 'auto', 'auto'],
                body: tableBody
              }
            }
          ],
          styles: {
            header: {
              fontSize: 18,
              bold: true,
              margin: [0, 0, 0, 10]
            },
            tableHeader: {
              bold: true,
              fontSize: 12,
              color: 'black'
            }
          }
        };

        // Generar y descargar el PDF
        // @ts-ignore
        pdfMake.createPdf(documentDefinition).download('reporte.pdf');
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message, life: 2500 });
      });
    }
  }

  onLazyLoad(event: any) {
    const page = event.first / event.rows;
    const size = event.rows;
  }

  getTipoReporte() {

    if (!this.fechaDesde || !this.fechaHasta || !this.tipoReporte || this.tipoReporte === '...') {
      this.listaReporte = [];
      this.listaComprobantes = [];
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Debe ingresar todos los datos para continuar", life: 2500 });
      return;
    }

    if (this.fechaDesde > this.fechaHasta) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "La fecha desde no puede ser mayor a la fecha hasta", life: 2500 });
      return;
    }

    if (this.tipoReporte == "COMPRAS") {
      // @ts-ignore
      this._comprovanteService.getReporteCompras(this.fechaDesde, this.fechaHasta).subscribe(res => {
        this.verCompra = true;
        this.verReportes = false;
        if (res) {
          this.listaReporte = res;
        } else {
          this.listaReporte = [];
        }
      })
    } else {
      // @ts-ignore
      this._comprovanteService.getReporteComprobantes(this.fechaDesde, this.fechaHasta, this.tipoReporte).subscribe(res => {
        this.verReportes = true;
        this.verCompra = false;
        if (res) {
          this.listaComprobantes = res;
        } else {
          this.listaComprobantes = [];
        }
      })
    }
  }

}
