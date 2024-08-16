import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ApiService } from '../../services/api.service';
import { actionsList, loadCryptosSuccess, upsertMany } from './crypto.actions';
import { map, switchMap, catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { Crypto } from '../../models/crypto';
import { WebsocketApiService } from '../../services/websocket-api.service';

@Injectable()
export class CryptoEffects {

    loadCryptos$ = createEffect(() => this.actions$.pipe(
        ofType(actionsList.loadCryptos),
        switchMap(() => this.apiService.getUSDTOnlyPairs()
        .pipe(
            map((cryptos) => loadCryptosSuccess({ cryptos })),
            catchError(() => EMPTY)
        ))
    ));

    loadCryptosSuccess$ = createEffect(() => this.actions$.pipe(
        ofType(actionsList.loadCryptosSuccess),
        switchMap(() => this.webSocketApiService.getPriceUpdates()
        .pipe(
            map((updates: Crypto[]) => {
                return upsertMany({ updates })
            })
        ))
    ))

    constructor(
        private actions$: Actions,
        private apiService: ApiService,
        private webSocketApiService: WebsocketApiService,
    ) {}
}
