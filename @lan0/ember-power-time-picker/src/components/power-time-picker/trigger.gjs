import Component from '@glimmer/component';
import { schedule } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import didUpdate from '@ember/render-modifiers/modifiers/did-update';

export default class PowerTimePickerTrigger extends Component {
  @tracked text = '';
  @tracked oldSelect;

  @action
  selectDidUpdate(_element, [newSelect]) {
    let oldSelect = this.oldSelect;
    this.oldSelect = newSelect;

    if (!oldSelect) {
      return (this.text = this.getSelectedAsText());
    }

    /*
     * We need to update the input field with value of the selected option whenever we're closing
     * the select box.
     */
    if (oldSelect.isOpen && !newSelect.isOpen) {
      let input = document.querySelector(
        `#ember-power-time-picker-input-${newSelect.uniqueId}`,
      );
      let newText = this.getSelectedAsText();
      if (input.value !== newText) {
        input.value = newText;
      }
      this.text = newText;
    }

    if (newSelect.lastSearchedText !== oldSelect.lastSearchedText) {
      schedule('actions', null, newSelect.actions.open);
    }

    if (oldSelect.selected !== newSelect.selected) {
      this.text = this.getSelectedAsText();
    }
  }

  getSelectedAsText() {
    return this.args.select.selected || '';
  }

  @action
  _handleMousedown(e) {
    if (!this.args.select.isOpen) {
      schedule('actions', null, this.args.select.actions.open);
    }
    e.target.select();
    e.preventDefault();
    e.stopPropagation();
  }

  @action
  _handleFocus() {
    this.args.select.actions.open();
    const inputElement = document.querySelector(
      `#ember-power-time-picker-input-${this.args.select.uniqueId}`,
    );
    inputElement.select();
  }

  @action
  _handleBlur() {
    if (this.args.select.actions.isOpen) {
      this.args.select.actions.select(this.args.select.highlighted || '');
    }
  }

  @action
  _handleKeyDown(e) {
    const highlighted = this.args.select.highlighted;
    if (
      e.keyCode === 9 &&
      this.args.select.searchText.length &&
      highlighted &&
      this.args.select.selected !== highlighted
    ) {
      // TAB
      this.args.select.actions.select(highlighted);
    }
  }

  <template>
    {{! template-lint-disable no-pointer-down-event-binding }}
    <input type="text"
      value={{this.text}} id="ember-power-time-picker-input-{{@select.uniqueId}}"
      class="ember-power-time-picker-input ember-power-select-search-input"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      placeholder={{@placeholder}}
      oninput={{@onInput}}
      onfocus={{this._handleFocus}}
      onblur={{this._handleBlur}}
      disabled={{@select.disabled}}
      onmousedown={{this._handleMousedown}}
      onkeydown={{this._handleKeyDown}}
      {{didUpdate this.selectDidUpdate @select}}
    >
  </template>
}
