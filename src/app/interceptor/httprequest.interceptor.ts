import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { BehaviorSubject, catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login/login.service';
import {SpinnerService} from "../services/spinner.service";

@Injectable({
  providedIn: 'root'
})
export class HttprequestInterceptor implements HttpInterceptor {

  private requests: HttpRequest<any>[] = [];
  constructor(private route: Router, private _spinner: SpinnerService, private _loginService: LoginService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Se muestra el spinner
    this._spinner.verSpinner();

    // Se agrega headers a las petiticiones
    const token: string = this._loginService.token;
    let request = req;
    if (token) {
      request = req.clone({
        setHeaders: {
          authorization: 'Bearer ' + token
        }
      });
    }

    this._spinner.verSpinner();
    return next.handle(request).pipe(finalize(() => {
      this.removeRequest(request);
      this._spinner.cerrarSpinner();
    }), catchError(error => {
      return throwError(error);
      // if (error instanceof HttpErrorResponse && error.status === 401) {
      //   //this.removeRequest(request);
      //   this.isRefreshing = false;
      //   if (!request.url.includes('/api/auth/refresJwt/')) {
      //     this._spinner.cerrarSpinner();
      //     return this.handle401Error(request, next);
      //   } else {
      //     this.removeRequest(request);
      //     sessionStorage.clear();
      //     localStorage.clear();
      //     this.route.navigateByUrl('/login');
      //     return throwError(error);
      //   }
      // } else if (error instanceof HttpErrorResponse && error.status === 403) {
      //   this.removeRequest(request);
      //   sessionStorage.clear();
      //   localStorage.clear();
      //   this.route.navigateByUrl('/login');
      //   return throwError(error);
      // } else {
      //   return throwError(error);
      // }
    }));
  }
  // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   const token: string = this._loginService.token;

  //   let request = req;
  //   if (token) {
  //     request = req.clone({
  //       setHeaders: {
  //         authorization: 'Bearer ' + token
  //       }
  //     });
  //   }
  //   this._spinner.verSpinner();
  //   return next.handle(request).pipe(finalize(() => {
  //     this.removeRequest(request);
  //     this._spinner.cerrarSpinner();
  //   }), catchError(error => {
  //     return throwError(error);
  //     // if (error instanceof HttpErrorResponse && error.status === 401) {
  //     //   //this.removeRequest(request);
  //     //   this.isRefreshing = false;
  //     //   if (!request.url.includes('/api/auth/refresJwt/')) {
  //     //     this._spinner.cerrarSpinner();
  //     //     return this.handle401Error(request, next);
  //     //   } else {
  //     //     this.removeRequest(request);
  //     //     sessionStorage.clear();
  //     //     localStorage.clear();
  //     //     this.route.navigateByUrl('/login');
  //     //     return throwError(error);
  //     //   }
  //     // } else if (error instanceof HttpErrorResponse && error.status === 403) {
  //     //   this.removeRequest(request);
  //     //   sessionStorage.clear();
  //     //   localStorage.clear();
  //     //   this.route.navigateByUrl('/login');
  //     //   return throwError(error);
  //     // } else {
  //     //   return throwError(error);
  //     // }
  //   }));
  // }

  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
  }

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      //this.refreshTokenSubject.next(null);
      // return this.loginService.refresh().pipe(
      //   switchMap((token: any) => {
      //     this.isRefreshing = false;
      //     //this.refreshTokenSubject.next(token.data);
      //     this.loginService.guardarToken(token.data);
      //     return next.handle(this.addToken(request, token.data));;
      //   }));

    }
  }
}
