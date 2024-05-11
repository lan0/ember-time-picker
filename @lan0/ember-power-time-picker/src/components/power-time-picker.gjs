import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import moment from 'moment';
import roundTime from '../utils/round-time.js';
import { indexOfOption } from 'ember-power-select/utils/group-utils';
import { scheduler } from 'ember-raf-scheduler';
import { ensureSafeComponent } from '@embroider/util';
import PowerSelect from 'ember-power-select/components/power-select';
import PowerTimePickerTrigger from './power-time-picker/trigger.gjs';
import PowerTimePickerOptions from './power-time-picker/options.gjs';

export default class PowerTimePicker extends Component {
  @tracked steps = this.args.steps ?? 5;
  get triggerComponent() {
    return ensureSafeComponent(
      this.args.triggerComponent ?? PowerTimePickerTrigger,
      this,
    );
  }

  get optionsComponent() {
    return ensureSafeComponent(
      this.args.optionsComponent ?? PowerTimePickerOptions,
      this,
    );
  }

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
    for (
      now;
      now.isSameOrBefore(end);
      now.add(Math.max(this.steps || 0, 1), 'minutes')
    ) {
      options.push(now.format('HH:mm'));
    }
    if (this.args.selected && !options.includes(this.args.selected)) {
      options.push(this.args.selected);
    }
    return options.sort();
  }

  // from power-select.js
  scrollTo(option, select) {
    let optionsList = document.getElementById(
      `ember-power-select-options-${select.uniqueId}`,
    );
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
      optionsList.scrollTop = Math.max(
        optionOffset -
          optionsList.getBoundingClientRect().height / 2 +
          optionHeight / 2,
      );
    });
  }

  @action
  scrollToTime(term, select) {
    if (term.length === 3) {
      if (
        term.substr(0, 1) === '0' ||
        term.substr(0, 1) === '1' ||
        term.substr(0, 1) === '2'
      ) {
        term = term.padEnd(4, '0');
      } else {
        term = term.padStart(4, '0');
      }
    }
    let searchString = roundTime(term, this.steps);
    select.actions.scrollTo(searchString);
    select.actions.highlight(searchString);
  }

  <template>
    <PowerSelect
      @afterOptionsComponent={{@afterOptionsComponent}}
      @allowClear={{false}}
      @ariaDescribedBy={{@ariaDescribedBy}}
      @ariaInvalid={{@ariaInvalid}}
      @ariaLabel={{@ariaLabel}}
      @ariaLabelledBy={{@ariaLabelledBy}}
      @beforeOptionsComponent={{null}}
      @buildSelection={{@buildSelection}}
      @calculatePosition={{@calculatePosition}}
      @class={{@class}}
      @closeOnSelect={{@closeOnSelect}}
      @defaultHighlighted={{@defaultHighlighted}}
      @destination={{@destination}}
      @dir={{@dir}}
      @disabled={{@disabled}}
      @dropdownClass={{@dropdownClass}}
      @extra={{@extra}}
      @groupComponent={{@groupComponent}}
      @highlightOnHover={{@highlightOnHover}}
      @horizontalPosition={{@horizontalPosition}}
      @initiallyOpened={{@initiallyOpened}}
      @loadingMessage={{@loadingMessage}}
      @matchTriggerWidth={{@matchTriggerWidth}}
      @matcher={{@matcher}}
      @noMatchesMessage={{@noMatchesMessage}}
      @onBlur={{@onBlur}}
      @onChange={{@onChange}}
      @onClose={{@onClose}}
      @onFocus={{@onFocus}}
      @onInput={{@onInput}}
      @onKeydown={{@onKeydown}}
      @onOpen={{@onOpen}}
      @options={{this.options}}
      @optionsComponent={{this.optionsComponent}}
      @placeholder={{@placeholder}}
      @placeholderComponent={{@placeholderComponent}}
      @preventScroll={{@preventScroll}}
      @registerAPI={{@registerAPI}}
      @renderInPlace={{@renderInPlace}}
      @scrollTo={{this.scrollTo}}
      @search={{this.scrollToTime}}
      @searchEnabled={{true}}
      @searchField={{@searchField}}
      @searchMessage={{@searchMessage}}
      @searchMessageComponent={{@searchMessageComponent}}
      @searchPlaceholder={{@searchPlaceholder}}
      @selected={{@selected}}
      @selectedItemComponent={{@selectedItemComponent}}
      @tabindex="-1"
      @triggerClass={{@triggerClass}}
      @triggerComponent={{this.triggerComponent}}
      @triggerId={{@triggerId}}
      @triggerRole={{@triggerRole}}
      @typeAheadMatcher={{@typeAheadMatcher}}
      @verticalPosition={{@verticalPosition}}
      ...attributes
      as |option term|
    >
      {{yield option term}}
    </PowerSelect>
  </template>
}
