import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Crypto } from '../models/crypto';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    readonly LAST_24_HOURS_TIMESTAMP = '1440';

    constructor(private http: HttpClient) {}

    getUSDTOnlyPairs(): Observable<Crypto[]> {
        return this.http.get<any[]>(`https://api.binance.com/api/v3/ticker/24hr`)
      		.pipe(
				map(data =>
				    data.filter(ticker => ticker.symbol.endsWith('USDT'))
			)
      	);
    }

    getLastPriceHistory(symbol: string): Observable<any> {
        return this.http.get<any[]>(`https://api.binance.com/api/v3/klines`, {
            params: {
                symbol: symbol,
                interval: '1m',
                limit: this.LAST_24_HOURS_TIMESTAMP
            }
        }).pipe(
            map(response =>
                response.map((entry: any) => ({
                    time: entry[0],
                    price: parseFloat(entry[4])
                }))
            )
        );
    }
}
