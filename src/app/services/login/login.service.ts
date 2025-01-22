import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from "jwt-decode";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  baseUrl = environment.endPoint;

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private _http: HttpClient) { }

  login(usuario: any){
    return this._http.post<any>( this.baseUrl + '/api/Login/login', usuario, { headers: this.httpHeaders });
  }

  saveToken(token: string){
    localStorage.setItem('token', token);
  }

  get token(): string {
    // @ts-ignore
    return localStorage.getItem('token');
  }

  get valuesPayload(): any {
    const token = this.token;
    const values = jwtDecode(token);
    return values;
  }
}

