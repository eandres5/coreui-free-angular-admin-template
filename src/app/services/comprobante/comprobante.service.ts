import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Comprobante } from 'src/app/models/class/comprobante';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComprobanteService {

  baseUrl = environment.endPoint;

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  getAllCompras(page: string, size: string, search: string){
    return this.http.get<any>( this.baseUrl + '/api/Compra/getLista/' + page + '/' + size + "/" + search);
  }

  getCompra(id: string){
    return this.http.get<any>( this.baseUrl + '/api/Compra/getCompra/' + id);
  }

  getComprobante(id: string, tipoTransaccion: string){
    return this.http.get<any>( this.baseUrl + '/api/Comprobante/getComprobante/' + id + "/" + tipoTransaccion);
  }

  getAllVentas(page: any, size: any, search: any){
    return this.http.get<any>( this.baseUrl + '/api/Comprobante/getListaVentas/' + page + '/' + size + "/" + search);
  }

  getResumenComprobantes(tipoTransaccion: string){
    return this.http.get<any>( this.baseUrl + '/api/Comprobante/getResumenComprobantes/' + tipoTransaccion);
  }

  getResumenCompras(){
    return this.http.get<any>( this.baseUrl + '/api/Compra/getResumenCompras');
  }

  getAllDevolucion(page: string, size: string, search: any){
    return this.http.get<any>( this.baseUrl + '/api/Comprobante/getListaDevolucion/' + page + '/' + size + "/" + search);
  }

  saveComprobante(comprobanteDto: Comprobante){
    return this.http.post<any>( this.baseUrl + '/api/Comprobante/save', comprobanteDto, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        console.error(e.error.error);
        return throwError(e);
      })
    );
  }

  getReporteComprobantes(fechaInicio: string, fechaFin: string, transaccion: string){
    return this.http.get<any>( this.baseUrl + '/api/Comprobante/getReporteComprobantes/' + fechaInicio + "/" + fechaFin + "/" + transaccion);
  }

  getReporteCompras(fechaInicio: string, fechaFin: string){
    return this.http.get<any>( this.baseUrl + '/api/Comprobante/getReporteCompras/' + fechaInicio + "/" + fechaFin);
  }

  getResumenVentas(){
    return this.http.get<any>( this.baseUrl + '/api/Comprobante/getResumenVentas');
  }

  getUltimoNumeroComprobante(tipoComprobante: string){
    return this.http.get<any>( this.baseUrl + '/api/Comprobante/getUltimoComprobante/' + tipoComprobante);
  }
}
