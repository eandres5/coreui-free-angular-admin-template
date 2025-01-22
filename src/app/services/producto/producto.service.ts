import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Producto } from 'src/app/models/class/producto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  baseUrl = environment.endPoint;

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  getAllPoductos(page: any, size: any, search: any){
    return this.http.get<any>( this.baseUrl + '/api/Proveedor/getLista/' + page + '/' + size + "/" + search);
  }

  getAllPoductosByUsuario(page: any, size: any, search: any){
    return this.http.get<any>( this.baseUrl + '/api/Producto/getProductoUsuario/' + page + '/' + size + "/" + search);
  }

  getAllPoductosProveedor(page: any, size: any, identificacion: any, search: any){
    return this.http.get<any>( this.baseUrl + '/api/Producto/getProductoProveedor/' + page + '/' + size + "/" + identificacion + "/" + search);
  }

  getAllPoductosClientes(page: any, size: any, search: any){
    return this.http.get<any>( this.baseUrl + '/api/Producto/getProductoClientes/' + page + '/' + size + "/" + search);
  }

  getProductoQr(idProducto: any){
    return this.http.get<any>( this.baseUrl + '/api/Producto/getProductoQr/' + idProducto );
  }

  saveProducto(productoDto: any){
    return this.http.post<any>( this.baseUrl + '/api/Producto/save', JSON.stringify(productoDto), { headers: this.httpHeaders }).pipe(
      catchError(e => {
        console.error(e.error.error);
        return throwError(e);
      })
    );;
  }

  updateProducto(productoDto: any){
    return this.http.put<any>( this.baseUrl + '/api/Producto/updateProducto', JSON.stringify(productoDto), { headers: this.httpHeaders }).pipe(
      catchError(e => {
        console.error(e.error.error);
        return throwError(e);
      })
    );
  }

  deleteProducto(productoDto: Producto){
    return this.http.post<any>( this.baseUrl + '/api/Producto/deleteProducto', JSON.stringify(productoDto), { headers: this.httpHeaders }).pipe(
      catchError(e => {
        console.error(e.error.error);
        return throwError(e);
      })
    );
  }

  getBajoStock(){
    return this.http.get<any>( this.baseUrl + '/api/Producto/getBajoStock');
  }

}
