import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Compra } from 'src/app/models/class/compra';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  baseUrl = environment.endPoint;

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  getAllCompras(page: string, size: string, search: any){
    return this.http.get<any>( this.baseUrl + '/api/Compra/getLista/' + page + '/' + size + "/" + search);
  }

  saveCompra(compraDto: any){
    return this.http.post<any>(this.baseUrl + '/api/Compra/save', compraDto, { headers: this.httpHeaders });
  }

}
