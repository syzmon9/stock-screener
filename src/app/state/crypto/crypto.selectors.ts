import { createFeatureSelector, createSelector } from "@ngrx/store";
import * as CryptoReducer from './crypto.reducer';
import * as fromApplication from '../application/application.reducer';
import * as ApplicationSelectors from '../application/application.selectors';
import { ColDef } from "ag-grid-community";

export interface AppState {
    crypto: CryptoReducer.State,
    applicationState: fromApplication.State
}

export const selectCryptoState = createFeatureSelector<CryptoReducer.State>('cryptos');

export const selectAllCryptos = createSelector(
    selectCryptoState,
    CryptoReducer.selectAllCryptos
)

export const selectFilters = createSelector(
    selectCryptoState,
    (state: CryptoReducer.State) => state.filters
)

export const selectFilteredCryptos = createSelector(
    selectAllCryptos,
    selectFilters,
    (cryptos, filters) => {
        return cryptos.filter(crypto => {
            return (
                crypto.volume >= (filters.minVolume || 0) &&
                crypto.volume <= (filters.maxVolume || Infinity) &&
                crypto.priceChangePercent >= (filters.minChange || -100) &&
                crypto.priceChangePercent <= (filters.maxChange || 100) &&
                crypto.lastPrice >= (filters.minPrice || 0) &&
                crypto.lastPrice <= (filters.maxPrice || Infinity)
              );
        });
    }
)

export const selectColumnDefinitions = createSelector(
    ApplicationSelectors.selectIsMobileMode,
    (isMobileMode) => {
        return [
            {
                headerName: 'Symbol',
                field: 'symbol',
                sortable: true,
                enableCellChangeFlash: true,
                pinned: isMobileMode,
                width: isMobileMode ? 105 : 200
            },
            {
                headerName: 'Last Price',
                field: 'lastPrice',
                sortable: true,
                enableCellChangeFlash: true
            },
            {
                headerName: 'Price Change %',
                field: 'priceChangePercent',
                sortable: true,
                enableCellChangeFlash: true
            },
            {
                headerName: 'Volume (USDT)',
                field: 'volume',
                sortable: true,
                enableCellChangeFlash: true
            },
        ] as ColDef[];
    }
)

export const selectDefaultColumnDefinition = createSelector(
    () => ({
        flex: 1,
        minWidth: 100,
        resizable: true,
        filter: false
    })
)
