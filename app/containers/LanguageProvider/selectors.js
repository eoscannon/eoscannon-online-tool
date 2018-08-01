import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the languageToggle state domain
 */
const selectLanguage = state => state.get('language', initialState);
//const selectnetWork = state => state.get('netWork', initialState);

/**
 * Select the language locale
 */

const makeSelectLocale = () =>
  createSelector(selectLanguage, languageState => languageState.get('locale'));

const makeSelectNetwork = () =>
  createSelector(selectLanguage, netWorkState => netWorkState.get('netWork'));

export { selectLanguage, makeSelectLocale, makeSelectNetwork };
