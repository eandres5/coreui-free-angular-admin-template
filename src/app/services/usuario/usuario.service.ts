import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Usuario } from 'src/app/models/class/usuario';
import { UsuarioProveedor } from 'src/app/models/class/usuarioProveedor';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  baseUrl = environment.endPoint;
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  getAllProveedores(page: string, size: string, search: any){
    return this.http.get<any>( this.baseUrl + '/api/Usuario/getProveedores/' + page + '/' + size + "/" + search);
  }

  getAllClientes(page: string, size: string, search: any){
    return this.http.get<any>( this.baseUrl + '/api/Usuario/getClientes/' + page + '/' + size + "/" + search);
  }

  getAllUsuarios(page: any, size: any, search: any){
    const params = new HttpParams().set('page', page).set('size', size).set('search', search);
    return this.http.get<any>( this.baseUrl + '/api/Usuario/getLista/' + page + '/' + size + "/" + search);
  }

  saveUsuarioProveedor(usuarioDto: UsuarioProveedor){
    return this.http.post<any>( this.baseUrl + '/api/Usuario/save', usuarioDto, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        console.error(e.error.error);
        return throwError(e);
      })
    );
  }

  updateUsuarioProveedor(usuarioDto: UsuarioProveedor){
    return this.http.put<any>( this.baseUrl + '/api/Usuario/updateProveedor', usuarioDto, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        console.error(e.error.error);
        return throwError(e);
      })
    );
  }

  geUsuarioProveedor(identificacion: string){
    return this.http.get<any>( this.baseUrl + '/api/Usuario/getUsuarioProveedor/' + identificacion);
  }

  deleteUsuario(usuarioDto: any){
    return this.http.post<any>( this.baseUrl + '/api/Usuario/deleteUsuario', usuarioDto, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        console.error(e.error.error);
        return throwError(e);
      })
    );
  }

  recoveryPassword(correo: string) {
    var correoDto = {"correo": correo};
    return this.http.post<any>( this.baseUrl + '/api/Usuario/recoveryPassword', correoDto, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        console.error(e.error.error);
        return throwError(e);
      })
    );
  }

  restablecerPassword(recuperarPassword: any) {
    return this.http.post<any>( this.baseUrl + '/api/Usuario/restablecerPassword', recuperarPassword, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        console.error(e.error.error);
        return throwError(e);
      })
    );
  }

}
