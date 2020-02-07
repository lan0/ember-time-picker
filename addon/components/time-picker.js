import Component from '@glimmer/component';
import moment from 'moment';
import roundTime from '../utils/round-time';
import { indexOfOption } from 'ember-power-select/utils/group-utils';

export default class TimePickerComponent extends Component {
  get steps() {
    return this.args.steps || 5;
  }

  get minTime() {
    return this.args.minTime || '06:00';
  }

  get maxTime() {
    return this.args.maxTime || '22:00';
  }

  get options() {
    let options = [];
    let now = moment(this.minTime, 'HH:mm');
    let end = moment(this.maxTime, 'HH:mm');
    for (now; now.isSameOrBefore(end); now.add(this.steps, 'minutes')) {
      options.push(now.format('HH:mm'));
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
    if (!optionElement) {
      return;
    }
    // ensure element gets centered in options list
    let optionTopScroll = optionElement.offsetTop - optionsList.offsetTop;
    optionsList.scrollTop = optionTopScroll -
      optionsList.getBoundingClientRect().height/2 +
      optionElement.getBoundingClientRect().height/2;
  }

  scrollToTime(term, select) {
    let searchString = roundTime(term);
    select.actions.highlight(searchString);
    select.actions.scrollTo(searchString);
  }
}
