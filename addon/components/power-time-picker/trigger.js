import Component from '@ember/component';
import { run } from '@ember/runloop';
import templateLayout from '../../templates/components/power-time-picker/trigger';
import { layout, tagName } from "@ember-decorators/component";
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default @tagName('') @layout(templateLayout) class extends Component {
  @tracked
  text = '';

  didReceiveAttrs() {
    super.didReceiveAttrs(...arguments);
    let oldSelect = this.get('oldSelect');
    let newSelect = this.set('oldSelect', this.get('select'));

    if (! oldSelect) {
      return this.text = this.getSelectedAsText();
    }

    /*
     * We need to update the input field with value of the selected option whenever we're closing
     * the select box.
     */
    if (oldSelect.isOpen && !newSelect.isOpen) {
      let input = document.querySelector(`#ember-power-time-picker-input-${newSelect.uniqueId}`);
      let newText = this.getSelectedAsText();
      if (input.value !== newText) {
        input.value = newText;
      }
      this.text = newText;
    }

    if (newSelect.lastSearchedText !== oldSelect.lastSearchedText) {
      run.schedule('actions', null, newSelect.actions.open);
    }

    if (oldSelect.selected !== newSelect.selected) {
      this.text = this.getSelectedAsText();
    }
  }

  getSelectedAsText() {
    return this.get('select.selected') || '';
  }

  @action
  _handleMousedown(e) {
    if (! this.select.isOpen) {
      run.schedule('actions', null, this.select.actions.open);
    }
    e.target.select();
    e.preventDefault();
    e.stopPropagation();
  }

  @action
  _handleBlur() {
    this.select.actions.select(this.get('select.highlighted') || '');
  }

  @action
  _handleKeyDown(e) {
    const highlighted = this.select.highlighted;
    if (e.keyCode === 9 && this.select.searchText.length && highlighted && this.select.selected !== highlighted) { // TAB
      this.select.actions.select(highlighted);
    }
  }
}
