import { createReducer, on } from "@ngrx/store";
import * as ApplicationStateActions from './application.actions';

export interface State {
    isMobileMode: boolean;
};

const MOBILE_MAX_WIDTH = 850;

const initialState = {
    isMobileMode: false
}

export const applicationStateReducer = createReducer(
    initialState,

    on(ApplicationStateActions.setScreen, (state, { windowWidth }) => ({
        ...state,
        isMobileMode: windowWidth < MOBILE_MAX_WIDTH
    }))
);
