import Component from '@ember/component';
import { action, computed } from '@ember/object';
import moment from 'moment';
import roundTime from '../utils/round-time';
import { indexOfOption } from 'ember-power-select/utils/group-utils';
import templateLayout from '../templates/components/power-time-picker';
import { layout, tagName } from "@ember-decorators/component";
import { scheduler } from 'ember-raf-scheduler';

export default @tagName('') @layout(templateLayout) class PowerTimePicker extends Component {
  selected;
  steps = 5;
  minTime = '06:00';
  maxTime = '22:00';
  triggerComponent = 'power-time-picker/trigger';
  optionsComponent = 'power-time-picker/options';

  @computed('minTime', 'maxTime', 'steps', 'selected')
  get options() {
    let options = [];
    let now = moment(this.minTime, 'HH:mm');
    let end = moment(this.maxTime, 'HH:mm');
    for (now; now.isSameOrBefore(end); now.add(Math.max(this.steps || 0, 1), 'minutes')) {
      options.push(now.format('HH:mm'));
    }
    if (this.selected && ! options.includes(this.selected)) {
      options.push(this.selected);
    }
    return options.sort();
  }

  // from power-select.js
  scrollTo(option, select) {
    let optionsList = document.getElementById(`ember-power-select-options-${select.uniqueId}`);
    if (!optionsList) {
      return;
    }
    let index = indexOfOption(select.results, option);
    if (index === -1) {
      return;
    }
    let optionElement = optionsList.querySelectorAll('[data-option-index]').item(index);
    let optionHeight = 28;
    let optionOffset = index * optionHeight;
    if (optionElement) {
      optionOffset = optionElement.offsetTop;
      optionHeight = optionElement.getBoundingClientRect().height;
    }
    // ensure element gets centered in options list
    scheduler.schedule('affect', () => {
      optionsList.scrollTop = optionOffset -
        optionsList.getBoundingClientRect().height/2 +
        optionHeight/2;
    });
  }

  @action
  scrollToTime(term, select) {
    if (term.length === 3) {
      if (term.substr(0, 1) !== '1' && term.substr(0, 1) !== '2') {
        term = term.padStart(4, '0');
      } else {
        term = term.padEnd(4, '0');
      }
    }
    let searchString = roundTime(term, this.steps);
    select.actions.scrollTo(searchString);
    select.actions.highlight(searchString);
  }
}
