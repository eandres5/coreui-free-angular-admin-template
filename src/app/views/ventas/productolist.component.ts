import { AfterViewInit, Component, OnInit} from '@angular/core';
import {ProductoService} from "../../services/producto/producto.service";
import {CONSTANTES} from "../../util/constantes";
import {Button} from "primeng/button";
import {TableModule} from "primeng/table";
import {DynamicDialogRef} from "primeng/dynamicdialog";

@Component({
  templateUrl: 'productolist.component.html',
  imports: [
    Button,
    TableModule
  ]
})
export class ProductolistComponent implements OnInit, AfterViewInit {

  listaProductos!: any[];

  constructor(
    private _productoService: ProductoService,
    private ref: DynamicDialogRef
  ) {
  }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.getAllProductos(CONSTANTES.page, CONSTANTES.size);
  }

  getAllProductos(page: number, size: number){
    this._productoService.getAllPoductosClientes(page, size, null).subscribe(res=>{
      this.listaProductos = res.items;
    });
  }

  selectProduct(product: any) {
    this.ref.close(product);
  }

  closeDialog(data: any) {
    this.ref.close(data);
  }
}
