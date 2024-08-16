import { Injectable, OnDestroy } from '@angular/core';
import { Observable, map, retry } from 'rxjs';
import { WebSocketSubjectConfig, webSocket } from 'rxjs/webSocket';
import { Crypto } from '../models/crypto';

@Injectable({
  providedIn: 'root'
})
export class WebsocketApiService implements OnDestroy {

    private webSocketSubject;
    readonly webSocketConfig = {
        url: 'wss://stream.binance.com:9443/ws/!ticker@arr',

    } as WebSocketSubjectConfig<any>

    constructor() {
        this.webSocketSubject = webSocket<any>('wss://stream.binance.com:9443/ws/!ticker@arr');
    }

    getPriceUpdates(): Observable<any> {
        return this.webSocketSubject.asObservable().pipe(
            retry({ count: 10, delay: 5000 }),
            map((data: any[]) =>{
                const usdtValues = data.filter((ticker: any) => ticker.s?.endsWith('USDT'));
                return usdtValues.map(value => ({
                    symbol: value.s,
                    lastPrice: value.c,
                    priceChangePercent: value.p,
                    volume: value.v
                } as Crypto))
            })
        );
    }

    ngOnDestroy() {
      this.webSocketSubject.unsubscribe();
    }
}
