import { Routes } from '@angular/router';
import {VentasComponent} from "./ventas.component";

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'ventas'
    },
    children: [
      {
        path: '',
        redirectTo: 'ventas',
        pathMatch: 'full'
      },
      {
        path: 'ventas',
        loadComponent: () => import('./ventas.component').then(m => m.VentasComponent),
        data: {
          title: 'ventas'
        }
      },
      {
        path: 'devolucion',
        loadComponent: () => import('./devolucion.component').then(m => m.DevolucionComponent),
        data: {
          title: 'devolucion'
        }
      }
    ]
  }
];

