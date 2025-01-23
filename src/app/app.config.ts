import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withHashLocation,
  withInMemoryScrolling,
  withRouterConfig,
  withViewTransitions
} from '@angular/router';

import { DropdownModule, SidebarModule } from '@coreui/angular';
import { IconSetService } from '@coreui/icons-angular';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/lara';
import {HTTP_INTERCEPTORS, provideHttpClient} from "@angular/common/http";
import {provideToastr, ToastrModule} from "ngx-toastr";
import {DialogService} from "primeng/dynamicdialog";
import {ConfirmationService, MessageService} from "primeng/api";
import {HttprequestInterceptor} from "./interceptor/httprequest.interceptor";
import {NgxSpinnerModule} from "ngx-spinner";

export const appConfig: ApplicationConfig = {
  providers: [
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    provideRouter(routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload'
      }),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      }),
      withEnabledBlockingInitialNavigation(),
      withViewTransitions(),
      withHashLocation()
    ),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Lara
        // ,
        // options: {
        //   darkModeSelector: 'none'
        // }
      }
    }),
    DialogService,
    MessageService,
    ConfirmationService,
    provideHttpClient(),
    importProvidersFrom(SidebarModule, DropdownModule, NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' })
    ),
    IconSetService,
    provideAnimations(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttprequestInterceptor,
      multi: true
    }
  ]
};
