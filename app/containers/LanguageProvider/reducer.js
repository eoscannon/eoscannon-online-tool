/*
 *
 * LanguageProvider reducer
 *
 */

import { fromJS } from "immutable";

import { CHANGE_LOCALE, CHANGE_NETWORK } from "./constants";
import { DEFAULT_LOCALE } from "../../i18n";

export const initialState = fromJS({
    locale: DEFAULT_LOCALE,
    netWork: "main"
});

function languageProviderReducer (state = initialState, action) {
    switch (action.type) {
    case CHANGE_LOCALE:
        return state.set("locale", action.locale);
    case CHANGE_NETWORK:
        return state.set("netWork", action.locale);
    default:
        return state;
    }
}

export default languageProviderReducer;
