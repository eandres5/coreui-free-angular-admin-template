import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DetalleProducto } from 'src/app/models/class/DetalleProducto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DetallecomprobanteService {

  baseUrl = environment.endPoint;

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  getDetalleProducto(detalleProductoDto: DetalleProducto){
    return this.http.post<any>( this.baseUrl + '/api/DetalleComprobante/getDetalleProducto', JSON.stringify(detalleProductoDto), { headers: this.httpHeaders });
  }
}
