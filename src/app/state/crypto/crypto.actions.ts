import { createAction, props } from '@ngrx/store';
import { Crypto } from '../../models/crypto';
import { FilterCriteria } from '../../models/filterCryteria';

export const actionsList = {
    loadCryptos: "[Crypto] Load Cryptos",
    loadCryptosSuccess: "[Crypto] Load Cryptos Success",
    upsertMany: "[Crypto] Update Many",

    clearFilters: "[Crypto] Clear Filters",
    updateFilters: "[Crypto] Update Filters",
};

export const loadCryptos = createAction(actionsList.loadCryptos);

export const loadCryptosSuccess = createAction(
    actionsList.loadCryptosSuccess,
    props<{ cryptos: Crypto[] }>()
);

export const upsertMany = createAction(
    actionsList.upsertMany,
    props<{ updates: Crypto[] }>()
);


export const updateFilters = createAction(
    actionsList.updateFilters,
    props<{ filters: FilterCriteria }>()
);

export const clearFilters = createAction(
    actionsList.clearFilters
);
