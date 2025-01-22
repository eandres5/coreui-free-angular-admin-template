import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Proveedor } from 'src/app/models/class/proveedor';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  baseUrl = environment.endPoint;

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  getAllProveedores(page:any, size: any, search: any){
    return this.http.get<any>( this.baseUrl + '/api/Proveedor/getLista/' + page + '/' + size + "/" + search);
  }

  getProveedor(proveedorId: number){
    return this.http.get<any>( this.baseUrl + '/api/Proveedor/getProveedor/' + proveedorId);
  }

  saveProveedor(proveedor: Proveedor){
    return this.http.post<any>( this.baseUrl + '/api/Proveedor/save', proveedor, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        console.error(e.error.error);
        return throwError(e);
      })
    );
  }

  updateProveedor(proveedor: Proveedor){
    return this.http.post<any>( this.baseUrl + '/api/Proveedor/update', proveedor, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        console.error(e.error.error);
        return throwError(e);
      })
    );
  }
}
