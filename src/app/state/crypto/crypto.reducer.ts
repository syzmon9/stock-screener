import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Crypto } from '../../models/crypto';
import * as CryptoActions from '../crypto/crypto.actions';
import { FilterCriteria } from '../../models/filterCryteria';

export interface State extends EntityState<Crypto> {
    filters: FilterCriteria;
};

export const adapter: EntityAdapter<Crypto> = createEntityAdapter<Crypto>({
    selectId: (e) => e.symbol
});

export const initialState: State = adapter.getInitialState({
    filters: {
        minVolume: undefined,
        maxVolume: undefined,
        minChange: undefined,
        maxChange: undefined,
        minPrice: undefined,
        maxPrice: undefined
    }
});

export const cryptoReducer = createReducer(
    initialState,

    on(CryptoActions.loadCryptosSuccess, (state, { cryptos }) => {
        return adapter.addMany(cryptos, state);
    }),

    on(CryptoActions.upsertMany, (state, { updates }) => {
        return adapter.upsertMany(updates, state);
    }),
    on(CryptoActions.updateFilters, (state, { filters }) => ({
        ...state,
        filters: { ...state.filters, ...filters }
    })),
    on(CryptoActions.clearFilters, (state) => ({
        ...state,
        filters: {}
    }))
);

const {
    selectAll
  } = adapter.getSelectors();

export const selectAllCryptos = selectAll;
