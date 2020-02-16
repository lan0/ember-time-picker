import { click, fillIn } from '@ember/test-helpers';

export async function selectTime(selector, text) {
  await fillIn(selector + ' .ember-power-select-search-input', text);
  await click('.ember-power-select-option[aria-current=true]');
}