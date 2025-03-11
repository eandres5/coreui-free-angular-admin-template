import {DOCUMENT, NgForOf} from '@angular/common';
import { Component, DestroyRef, effect, inject, OnInit, Renderer2, signal, WritableSignal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartOptions } from 'chart.js';
import {
  RowComponent,
  TemplateIdDirective,
  WidgetStatAComponent
} from '@coreui/angular';
import { DashboardChartsData, IChartProps } from './dashboard-charts-data';
import {ComprobanteService} from "../../services/comprobante/comprobante.service";
import {ProductoService} from "../../services/producto/producto.service";
import {Dialog} from "primeng/dialog";
import {Chart, registerables}  from "chart.js";
Chart.register(...registerables)

@Component({
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.scss'],
  imports: [RowComponent, ReactiveFormsModule, TemplateIdDirective, WidgetStatAComponent, NgForOf, Dialog]
})
export class DashboardComponent implements OnInit {

  listaProducto: any[]= new Array<any>();
  listaGraficoVentas: any[]= new Array<any>();
  listaGraficoDevolucion: any[]= new Array<any>();

  visible: boolean = false;
  chart: any;
  comprobanteChart: any;

  constructor(private _comprobantes: ComprobanteService,
              private _productoService: ProductoService) {
  }

  ngOnInit(): void {
    // this.chart = new Chart('MyChart', this.config);

    this._productoService.getBajoStock().subscribe(res => {
      if (res.length > 0) {
        this.visible = true;
        // this.notificacionProductoSinStock();
        this.listaProducto = res;
      }
    });

    this._comprobantes.getReporteGraficoCompras().subscribe(res => {
      this.createChartCompras(res);
    });

    this._comprobantes.getReporteGrafico('VENTA').subscribe(res => {
      this.listaGraficoVentas = res;
      this._comprobantes.getReporteGrafico('DEVOLUCION').subscribe(res => {
        this.listaGraficoDevolucion = res;
        this.asignarGrafico(this.listaGraficoVentas, this.listaGraficoDevolucion);
      });
    });

  }

  asignarGrafico(listVentasGrafico: any[], listDevolucionGraico: any[]): void {

    const labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    // Inicializar datos en 0 por defecto
    const ventasData = new Array(12).fill(0);
    const devolucionesData = new Array(12).fill(0);

    // Asignar valores obtenidos de la API a los meses correspondientes
    listVentasGrafico.forEach(v => {
      ventasData[v.mes - 1] = v.totalVentas; // Restamos 1 porque los meses van de 1 a 12
    });

    listDevolucionGraico.forEach(v => {
      devolucionesData[v.mes - 1] = v.totalVentas;
    });

    // Configuración del gráfico con dos datasets
    this.chart = new Chart('MyChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Ventas Mensuales',
            data: ventasData,
            backgroundColor: 'rgba(54, 162, 235, 0.5)', // Azul
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          },
          {
            label: 'Devoluciones Mensuales',
            data: devolucionesData,
            backgroundColor: 'rgba(255, 99, 132, 0.5)', // Rojo
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  createChartCompras(listaCompras: any[]): void {
    const labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    // Inicializar datos en 0 para los 12 meses
    const comprasData = new Array(12).fill(0);

    // Asignar valores obtenidos de la API a los meses correspondientes
    listaCompras.forEach(c => {
      comprasData[c.mes - 1] = c.totalVentas; // Restamos 1 porque los meses van de 1 a 12
    });

    // Crear gráfico de barras
    this.comprobanteChart = new Chart('ComprobanteChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Compras Mensuales',
            data: comprasData,
            backgroundColor: 'rgba(75, 192, 192, 0.5)', // Verde agua
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

}
