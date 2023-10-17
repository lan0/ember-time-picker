import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { selectTime } from '@lan0/ember-power-time-picker/test-support/helpers';

module('Acceptance | smoke', function(hooks) {
  setupApplicationTest(hooks);

  test('it works in application', async function(assert) {
    await visit('/');

    await selectTime('', '12:00');

    assert.equal(document.querySelector('.ember-power-select-trigger input').value, '12:00');
  });
});
