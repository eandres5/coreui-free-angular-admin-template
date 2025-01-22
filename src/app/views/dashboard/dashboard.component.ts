import {DOCUMENT, NgForOf, NgStyle} from '@angular/common';
import { Component, DestroyRef, effect, inject, OnInit, Renderer2, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChartOptions } from 'chart.js';
import {
  ButtonDirective,
  ColComponent,
  DropdownComponent,
  DropdownToggleDirective,
  RowComponent,
  TemplateIdDirective,
  WidgetStatAComponent
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { DashboardChartsData, IChartProps } from './dashboard-charts-data';
import {ComprobanteService} from "../../services/comprobante/comprobante.service";
import {ProductoService} from "../../services/producto/producto.service";
import {Dialog} from "primeng/dialog";


@Component({
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.scss'],
  imports: [RowComponent, ReactiveFormsModule, TemplateIdDirective, WidgetStatAComponent, NgForOf, Dialog]
})
export class DashboardComponent implements OnInit {

  readonly #destroyRef: DestroyRef = inject(DestroyRef);
  readonly #document: Document = inject(DOCUMENT);
  readonly #renderer: Renderer2 = inject(Renderer2);
  readonly #chartsData: DashboardChartsData = inject(DashboardChartsData);
  listaVentas: any[] = new Array<any>();
  listaDevolucion: any[]= new Array<any>();
  listaCompras: any[]= new Array<any>();
  listaProducto: any[]= new Array<any>();
  bajoStock: boolean = false;
  visible: boolean = false;

  public mainChart: IChartProps = { type: 'line' };
  public mainChartRef: WritableSignal<any> = signal(undefined);
  #mainChartRefEffect = effect(() => {
    if (this.mainChartRef()) {
      this.setChartStyles();
    }
  });
  public chart: Array<IChartProps> = [];
  public trafficRadioGroup = new FormGroup({
    trafficRadio: new FormControl('Month')
  });

  constructor(private _comprobantes: ComprobanteService,
              private _productoService: ProductoService) {
  }

  ngOnInit(): void {
    this.initCharts();
    this.updateChartOnColorModeChange();

    this._productoService.getBajoStock().subscribe(res => {
      if(res.length > 0) {
        this.visible = true;
        // this.notificacionProductoSinStock();
        this.listaProducto = res;
      }
    });

    this._comprobantes.getResumenVentas().subscribe(res=> {
      this.listaVentas = res;
      console.log(res);

    });

    this._comprobantes.getResumenComprobantes('DEVOLUCION').subscribe(res=> {
      this.listaDevolucion = res;
      console.log(res);
    });

    this._comprobantes.getResumenCompras().subscribe(res=> {
      this.listaCompras = res;
      console.log(res);
    });

  }

  initCharts(): void {
    this.mainChart = this.#chartsData.mainChart;
  }

  setTrafficPeriod(value: string): void {
    this.trafficRadioGroup.setValue({ trafficRadio: value });
    this.#chartsData.initMainChart(value);
    this.initCharts();
  }

  handleChartRef($chartRef: any) {
    if ($chartRef) {
      this.mainChartRef.set($chartRef);
    }
  }

  updateChartOnColorModeChange() {
    const unListen = this.#renderer.listen(this.#document.documentElement, 'ColorSchemeChange', () => {
      this.setChartStyles();
    });

    this.#destroyRef.onDestroy(() => {
      unListen();
    });
  }

  setChartStyles() {
    if (this.mainChartRef()) {
      setTimeout(() => {
        const options: ChartOptions = { ...this.mainChart.options };
        const scales = this.#chartsData.getScales();
        this.mainChartRef().options.scales = { ...options.scales, ...scales };
        this.mainChartRef().update();
      });
    }
  }
}
