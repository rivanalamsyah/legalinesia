import { ApplicationConfig, ErrorHandler, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions, TitleStrategy } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { LUCIDE_ICONS, LucideIconProvider, icons } from 'lucide-angular';

import { routes } from '../../app.routes';
import { CustomTitleStrategy } from '../services/title-strategy';
import { GlobalErrorHandler } from '../error-handler/global-error-handler';
import { errorInterceptor } from '../interceptors/error.interceptor';
import { provideFirebase } from '../firebase/firebase.app';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideHttpClient(withInterceptors([errorInterceptor])),
    provideAnimations(),
    provideFirebase(),
    { provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider(icons) },
    { provide: TitleStrategy, useClass: CustomTitleStrategy },
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
};

