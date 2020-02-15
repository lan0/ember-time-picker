import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { clickTrigger, typeInSearch, selectChoose } from 'ember-power-select/test-support/helpers';

module('Integration | Component | power-time-picker', function(hooks) {
  setupRenderingTest(hooks);

  test('it highlights selected time on open', async function(assert) {
    await render(hbs`
      <PowerTimePicker @selected="06:30" @onChange={{fn (mut time)}} as |time|>
        {{time}}
      </PowerTimePicker>
    `);

    await clickTrigger();

    assert.equal(
      document.querySelector('.ember-power-select-option[aria-current=true]').textContent.trim(),
      '06:30',
      'it should highlight selected option by default'
    );
    // scrolltop > 0 because 06:30 gets centered
    assert.ok(
      document.querySelector('.ember-power-select-options').scrollTop > 0,
      'it should center highlighted option'
    );
  });

  test('it can set minute steps', async function(assert) {
    await render(hbs`
      <PowerTimePicker @steps=15 @selected="12:00" @onChange={{fn (mut time)}} as |time|>
        {{time}}
      </PowerTimePicker>
    `);

    await clickTrigger();

    const options = document.querySelectorAll('.ember-power-select-option');
    assert.equal(options[0].textContent.trim(), '06:00');
    assert.equal(options[1].textContent.trim(), '06:15');
    assert.equal(options[options.length-1].textContent.trim(), '22:00');
    assert.equal(options.length, 65);
  });

  test('it can set min and max time', async function(assert) {
    await render(hbs`
      <PowerTimePicker @minTime="12:00" @maxTime="13:00" @selected="12:00" @onChange={{fn (mut time)}} as |time|>
        {{time}}
      </PowerTimePicker>
    `);

    await clickTrigger();

    const options = document.querySelectorAll('.ember-power-select-option');
    assert.equal(options[0].textContent.trim(), '12:00');
    assert.equal(options[options.length-1].textContent.trim(), '13:00');
    assert.equal(options.length, 13);
  });

  test('it sends an action on selection', async function(assert) {
    assert.expect(1);

    this.change = time => assert.equal(time, '14:00');

    await render(hbs`
      <PowerTimePicker @selected="12:00" @onChange={{this.change}} as |time|>
        {{time}}
      </PowerTimePicker>
    `);

    await selectChoose('', '14:00');
  });

  test('it adds selected as option', async function(assert) {
    await render(hbs`
      <PowerTimePicker @selected="05:00" @steps=15 @onChange={{fn (mut time)}} as |time|>
        {{time}}
      </PowerTimePicker>
    `);

    await clickTrigger();

    const options = document.querySelectorAll('.ember-power-select-option');
    assert.equal(document.querySelector('.ember-power-select-trigger').textContent.trim(), '05:00');
    assert.equal(options.length, 66);
  });

  test('it does not duplicate selected item', async function(assert) {
    await render(hbs`
      <PowerTimePicker @selected="06:00" @steps=15 @onChange={{fn (mut time)}} as |time|>
        {{time}}
      </PowerTimePicker>
    `);

    await clickTrigger();

    const options = document.querySelectorAll('.ember-power-select-option');
    assert.equal(options[0].textContent.trim(), '06:00');
    assert.equal(options[1].textContent.trim(), '06:15');
    assert.equal(options.length, 65);
  });

  test('it highlights time on search', async function(assert) {
    await render(hbs`
      <PowerTimePicker @selected="06:00" @steps=15 @onChange={{fn (mut time)}} as |time|>
        {{time}}
      </PowerTimePicker>
    `);

    await clickTrigger();
    await typeInSearch('', '12');

    assert.equal(
      document.querySelector('.ember-power-select-option[aria-current=true]').textContent.trim(),
      '12:00'
    );
  });

  test('it supports search with colons omitted', async function(assert) {
    await render(hbs`
      <PowerTimePicker @selected="06:00" @steps=15 @onChange={{fn (mut time)}} as |time|>
        {{time}}
      </PowerTimePicker>
    `);

    await clickTrigger();
    await typeInSearch('', '1215');

    assert.equal(
      document.querySelector('.ember-power-select-option[aria-current=true]').textContent.trim(),
      '12:15'
    );
  });

  test('it highlights nearest match', async function(assert) {
    await render(hbs`
      <PowerTimePicker @selected="06:00" @steps=15 @onChange={{fn (mut time)}} as |time|>
        {{time}}
      </PowerTimePicker>
    `);

    await clickTrigger();
    await typeInSearch('', '1337');

    assert.equal(
      document.querySelector('.ember-power-select-option[aria-current=true]').textContent.trim(),
      '13:30'
    );
  });

  test('it allows leading 0 to be omitted', async function(assert) {
    await render(hbs`
      <PowerTimePicker @selected="06:00" @steps=15 @onChange={{fn (mut time)}} as |time|>
        {{time}}
      </PowerTimePicker>
    `);

    await clickTrigger();
    await typeInSearch('', '815');

    assert.equal(
      document.querySelector('.ember-power-select-option[aria-current=true]').textContent.trim(),
      '08:15'
    );
  });

  test('it allows last number to be omitted', async function(assert) {
    await render(hbs`
      <PowerTimePicker @selected="06:00" @steps=15 @onChange={{fn (mut time)}} as |time|>
        {{time}}
      </PowerTimePicker>
    `);

    await clickTrigger();

    await typeInSearch('', '104');
    assert.equal(
      document.querySelector('.ember-power-select-option[aria-current=true]').textContent.trim(),
      '10:45'
    );
  });
});
