import { fillIn, triggerKeyEvent } from '@ember/test-helpers';

export async function selectTime(selector, text) {
  await fillIn(selector + ' .ember-power-select-search-input', text);
  await triggerKeyEvent(
    selector + ' .ember-power-select-search-input',
    'keydown',
    'Enter'
  );
}
