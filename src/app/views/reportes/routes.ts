import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'reportes'
    },
    children: [
      {
        path: '',
        redirectTo: 'reportes',
        pathMatch: 'full'
      },
      {
        path: 'reporte',
        loadComponent: () => import('./reporte.component').then(m => m.ReporteComponent),
        data: {
          title: 'reporte'
        }
      }
    ]
  }
];

