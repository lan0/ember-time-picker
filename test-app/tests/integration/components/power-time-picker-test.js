import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, triggerKeyEvent, fillIn, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { selectTime } from '@lan0/ember-power-time-picker/test-support/helpers';

module('Integration | Component | power-time-picker', function (hooks) {
  setupRenderingTest(hooks);

  test('it highlights selected time on open', async function (assert) {
    await render(hbs`
      <PowerTimePicker @selected="06:30" @onChange={{fn (mut this.time)}} as |time|>
        {{time}}
      </PowerTimePicker>
    `);

    await click('.ember-power-select-search-input');

    assert
      .dom('.ember-power-select-option[aria-current=true]')
      .hasText('06:30', 'it should highlight selected option by default');
    // scrolltop > 0 because 06:30 gets centered
    assert.ok(
      document.querySelector('.ember-power-select-options').scrollTop > 0,
      'it should center highlighted option',
    );
  });

  test('it can set minute steps', async function (assert) {
    await render(hbs`
      <PowerTimePicker @steps={{15}} @selected="12:00" @onChange={{fn (mut this.time)}} as |time|>
        {{time}}
      </PowerTimePicker>
    `);

    await click('.ember-power-select-search-input');

    const options = document.querySelectorAll('.ember-power-select-option');
    assert.dom(options[0]).hasText('11:15');
    assert.dom(options[1]).hasText('11:30');
    assert.dom(options[options.length - 1]).hasText('13:30');
    assert.strictEqual(options.length, 10);
  });

  test('it allows invalid minute steps', async function (assert) {
    await render(hbs`
      <PowerTimePicker @steps={{null}} @onChange={{fn (mut this.time)}} as |time|>
        {{time}}
      </PowerTimePicker>
    `);

    await click('.ember-power-select-search-input');

    // should not crash
    const options = document.querySelectorAll('.ember-power-select-option');
    assert.dom(options[0]).hasText('06:00');
  });

  test('it can set min and max time', async function (assert) {
    await render(hbs`
      <PowerTimePicker @minTime="12:00" @maxTime="13:00" @selected="12:00" @onChange={{fn (mut this.time)}} as |time|>
        {{time}}
      </PowerTimePicker>
    `);

    await click('.ember-power-select-search-input');

    const options = document.querySelectorAll('.ember-power-select-option');
    assert.dom(options[0]).hasText('12:00');
    assert.dom(options[options.length - 1]).hasText('12:35');
    assert.strictEqual(options.length, 8);
  });

  test('it sends an action on selection', async function (assert) {
    this.change = (time) => assert.strictEqual(time, '14:00');

    await render(hbs`
      <PowerTimePicker @selected="12:00" @onChange={{this.change}} as |time|>
        {{time}}
      </PowerTimePicker>
    `);

    await selectTime('', '14:00');
  });

  test('it adds selected as option', async function (assert) {
    await render(hbs`
      <PowerTimePicker @selected="05:00" @steps={{15}} @onChange={{fn (mut this.time)}} as |time|>
        {{time}}
      </PowerTimePicker>
    `);

    await click('.ember-power-select-search-input');

    assert.dom('.ember-power-select-trigger input').hasValue('05:00');
  });

  test('it does not duplicate selected item', async function (assert) {
    await render(hbs`
      <PowerTimePicker @selected="06:00" @steps={{15}} @onChange={{fn (mut this.time)}} as |time|>
        {{time}}
      </PowerTimePicker>
    `);

    await click('.ember-power-select-search-input');

    const options = document.querySelectorAll('.ember-power-select-option');
    assert.dom(options[0]).hasText('06:00');
    assert.dom(options[1]).hasText('06:15');
    assert.dom(options[2]).hasText('06:30');
  });

  test('it highlights time on search', async function (assert) {
    await render(hbs`
      <PowerTimePicker @selected="06:00" @steps={{15}} @onChange={{fn (mut this.time)}} as |time|>
        {{time}}
      </PowerTimePicker>
    `);

    await fillIn('.ember-power-select-search-input', '12');

    assert
      .dom('.ember-power-select-option[aria-current=true]')
      .hasText('12:00');
  });

  test('it supports search with colons omitted', async function (assert) {
    await render(hbs`
      <PowerTimePicker @selected="06:00" @steps={{15}} @onChange={{fn (mut this.time)}} as |time|>
        {{time}}
      </PowerTimePicker>
    `);

    await fillIn('.ember-power-select-search-input', '1215');

    assert
      .dom('.ember-power-select-option[aria-current=true]')
      .hasText('12:15');
  });

  test('it highlights nearest match', async function (assert) {
    await render(hbs`
      <PowerTimePicker @selected="06:00" @steps={{15}} @onChange={{fn (mut this.time)}} as |time|>
        {{time}}
      </PowerTimePicker>
    `);

    await fillIn('.ember-power-select-search-input', '1337');

    assert
      .dom('.ember-power-select-option[aria-current=true]')
      .hasText('13:30');
  });

  test('it allows leading 0 to be omitted', async function (assert) {
    await render(hbs`
      <PowerTimePicker @selected="06:00" @steps={{15}} @onChange={{fn (mut this.time)}} as |time|>
        {{time}}
      </PowerTimePicker>
    `);

    await fillIn('.ember-power-select-search-input', '815');

    assert
      .dom('.ember-power-select-option[aria-current=true]')
      .hasText('08:15');
  });

  test('it allows last number to be omitted', async function (assert) {
    await render(hbs`
      <PowerTimePicker @selected="06:00" @steps={{15}} @onChange={{fn (mut this.time)}} as |time|>
        {{time}}
      </PowerTimePicker>
    `);

    await fillIn('.ember-power-select-search-input', '104');
    assert
      .dom('.ember-power-select-option[aria-current=true]')
      .hasText('10:45');
  });

  test('it allows leading zero in fuzzy search', async function (assert) {
    await render(hbs`
      <PowerTimePicker @selected="06:00" @steps={{15}} @onChange={{fn (mut this.time)}} as |time|>
        {{time}}
      </PowerTimePicker>
    `);

    await fillIn('.ember-power-select-search-input', '073');
    assert
      .dom('.ember-power-select-option[aria-current=true]')
      .hasText('07:30');
  });

  test('it fills out search input with selected value', async function (assert) {
    await render(hbs`
      <PowerTimePicker @selected={{this.time}} @steps={{15}} @onChange={{fn (mut this.time)}} as |time|>
        {{time}}
      </PowerTimePicker>
    `);

    await selectTime('', '14:00');
    assert.notOk(
      document.querySelector('.ember-power-select-dropdown'),
      'the component is closed',
    );
    assert
      .dom('.ember-power-select-search-input')
      .hasValue('14:00', 'the input contains the selected option');
  });

  test('it resets search value on close', async function (assert) {
    await render(hbs`
      <PowerTimePicker @selected={{this.time}} @steps={{15}} @onChange={{fn (mut this.time)}} as |time|>
        {{time}}
      </PowerTimePicker>
    `);

    await fillIn('.ember-power-select-search-input', '14:00');
    await triggerKeyEvent(
      '.ember-power-select-search-input',
      'keydown',
      'Escape',
    );
    assert.notOk(
      document.querySelector('.ember-power-select-dropdown'),
      'the component is closed',
    );
    assert
      .dom('.ember-power-select-search-input')
      .hasValue('', 'the search gets reset');
  });

  test('it resets search input value on select', async function (assert) {
    await render(hbs`
      <PowerTimePicker @selected={{this.time}} @steps={{15}} @onChange={{fn (mut this.time)}} as |time|>
        {{time}}
      </PowerTimePicker>
    `);

    await fillIn('.ember-power-select-search-input', '1400');
    await click('.ember-power-select-option');
    assert
      .dom('.ember-power-select-search-input')
      .hasValue('13:15', 'the input gets set to selected value');
  });

  test('picker updates if min/max value has been updated externally', async function (assert) {
    this.minTime = '10:00';
    this.maxTime = '12:00';
    await render(hbs`
      <PowerTimePicker @minTime={{this.minTime}} @steps={{30}} @maxTime={{this.maxTime}} @selected="11:00" @onChange={{fn (mut this.time)}} as |time|>
        {{time}}
      </PowerTimePicker>
    `);

    await click('.ember-power-select-search-input');

    let options = document.querySelectorAll('.ember-power-select-option');

    assert.dom(options[0]).hasText('10:00');
    assert.dom(options[options.length - 1]).hasText('12:00');

    await click('.ember-power-select-search-input');

    this.set('minTime', '11:00');
    this.set('maxTime', '13:00');

    await click('.ember-power-select-search-input');

    options = document.querySelectorAll('.ember-power-select-option');
    assert.dom(options[0]).hasText('11:00');
    assert.dom(options[options.length - 1]).hasText('13:00');
  });
});
