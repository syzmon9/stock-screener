import { createFeatureSelector, createSelector } from "@ngrx/store";
import { State } from "./application.reducer";

export const selectApplicationState = createFeatureSelector<State>('applicationState');

export const selectIsMobileMode = createSelector(
    selectApplicationState,
    (state: State) => state.isMobileMode
)
