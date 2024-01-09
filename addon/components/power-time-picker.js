import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import moment from 'moment';
import roundTime from '../utils/round-time';
import { indexOfOption } from 'ember-power-select/utils/group-utils';
import { scheduler } from 'ember-raf-scheduler';

export default class PowerTimePicker extends Component {
  @tracked steps = this.args.steps ?? 5;
  @tracked triggerComponent = this.args.triggerComponent ?? 'power-time-picker/trigger';
  @tracked optionsComponent = this.args.optionsComponent ?? 'power-time-picker/options';

  get minTime() {
    return this.args.minTime ?? '06:00';
  }

  get maxTime() {
    return this.args.maxTime ?? '22:00';
  }

  get options() {
    let options = [];
    let now = moment(this.minTime, 'HH:mm');
    let end = moment(this.maxTime, 'HH:mm');
    for (now; now.isSameOrBefore(end); now.add(Math.max(this.steps || 0, 1), 'minutes')) {
      options.push(now.format('HH:mm'));
    }
    if (this.args.selected && ! options.includes(this.args.selected)) {
      options.push(this.args.selected);
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

    let optionHeight = 28;
    let optionOffset = index * optionHeight;
    // ensure element gets centered in options list
    scheduler.schedule('affect', () => {
      optionsList.scrollTop = Math.max(optionOffset -
        optionsList.getBoundingClientRect().height/2 +
        optionHeight/2);
    });
  }

  @action
  scrollToTime(term, select) {
    if (term.length === 3) {
      if (term.substr(0, 1) === '0' || term.substr(0, 1) === '1' || term.substr(0, 1) === '2') {
        term = term.padEnd(4, '0');
      } else {
        term = term.padStart(4, '0');
      }
    }
    let searchString = roundTime(term, this.steps);
    select.actions.scrollTo(searchString);
    select.actions.highlight(searchString);
  }
}
