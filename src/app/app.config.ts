import { ApplicationConfig, provideZoneChangeDetection, isDevMode, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { provideState, provideStore } from '@ngrx/store';
import { cryptoReducer } from './state/crypto/crypto.reducer';
import { provideEffects } from '@ngrx/effects';
import { CryptoEffects } from './state/crypto/crypto.effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { applicationStateReducer } from './state/application/application.reducer';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideAnimationsAsync(),
        provideHttpClient(),

        provideEffects(CryptoEffects),
        provideStore(),
        provideState({
            name: 'cryptos',
            reducer: cryptoReducer
        }),
        provideState({
            name: 'applicationState',
            reducer: applicationStateReducer
        }),
        provideStoreDevtools({ maxAge: 100, logOnly: false }),
    ]
};
