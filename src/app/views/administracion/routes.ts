import { Routes } from '@angular/router';
import {CompraComponent} from "./compra.component";

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'administracion'
    },
    children: [
      {
        path: '',
        redirectTo: 'administracion',
        pathMatch: 'full'
      },
      {
        path: 'compra',
        loadComponent: () => import('./compra.component').then(m => m.CompraComponent),
        data: {
          title: 'compra'
        }
      },
      {
        path: 'cliente',
        loadComponent: () => import('./cliente.component').then(m => m.ClienteComponent),
        data: {
          title: 'cliente'
        }
      },
      {
        path: 'proveedor',
        loadComponent: () => import('./proveedor.component').then(m => m.ProveedorComponent),
        data: {
          title: 'proveedor'
        }
      },
      {
        path: 'producto',
        loadComponent: () => import('./producto.component').then(m => m.ProductoComponent),
        data: {
          title: 'producto'
        }
      }
    ]
  }
];

