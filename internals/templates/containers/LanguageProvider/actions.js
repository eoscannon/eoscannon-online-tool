/*
 *
 * LanguageProvider actions
 *
 */

import { CHANGE_LOCALE, CHANGE_Network } from './constants';

export function changeLocale(languageLocale) {
  return {
    type: CHANGE_LOCALE,
    locale: languageLocale,
  };
}

export function changeNetwork(languageLocale) {
  return {
    type: CHANGE_Network,
    locale: languageLocale,
  };
}
