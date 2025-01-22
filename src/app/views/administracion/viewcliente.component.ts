import { AfterViewInit, Component, OnInit } from '@angular/core';

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TableModule} from "primeng/table";
import {UsuarioProveedor} from "../../models/class/usuarioProveedor";
import {DynamicDialogConfig} from "primeng/dynamicdialog";

@Component({
  templateUrl: 'viewcliente.component.html',
  imports: [
    ReactiveFormsModule,
    TableModule,
    FormsModule]
})
export class ViewclienteComponent implements OnInit, AfterViewInit {

  newProveedor: UsuarioProveedor = new UsuarioProveedor();

  constructor(public config: DynamicDialogConfig) {}

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.newProveedor = this.config.data;
  }

}

