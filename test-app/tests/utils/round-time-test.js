import roundTime from '@lan0/ember-power-time-picker/utils/round-time';
import { module, test } from 'qunit';

module('Unit | Utility | round-time', function () {
  test('it does nothing by default', function (assert) {
    assert.strictEqual(roundTime('12:03'), '12:03');
  });

  test('it rounds correctly to specified interval', function (assert) {
    assert.strictEqual(roundTime('10:11', 15), '10:15');

    assert.strictEqual(roundTime('10:42', 10), '10:40');

    assert.strictEqual(roundTime('10:37', 5), '10:35');
  });
});
