import { createAction, props } from "@ngrx/store";

export const actionsList = {
    setScreen: "[Application State] Set screen"
};


export const setScreen = createAction(
    actionsList.setScreen,
    props<{ windowWidth: number }>()
);
