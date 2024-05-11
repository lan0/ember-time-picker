import OptionsComponent from 'ember-power-select/components/power-select/options';
import { eq } from 'ember-truth-helpers';
import didInsert from '@ember/render-modifiers/modifiers/did-insert';
import willDestroy from '@ember/render-modifiers/modifiers/will-destroy';
import VerticalCollection from '@html-next/vertical-collection/components/vertical-collection/component';
import emberPowerSelectIsSelected from 'ember-power-select/helpers/ember-power-select-is-selected';

export default class PowerTimePickerOptions extends OptionsComponent {
  <template>
    {{! template-lint-disable require-context-role }}
    <ul role="listbox" {{didInsert this.addHandlers}} {{willDestroy this.removeHandlers}} ...attributes>
      {{#if @select.loading}}
        {{#if @loadingMessage}}
          <li class="ember-power-select-option ember-power-select-option--loading-message" role="option" aria-selected={{false}}>{{@loadingMessage}}</li>
        {{/if}}
      {{/if}}
      <VerticalCollection
        @items={{@options}}
        @estimateHeight="28px" as |opt index|>
        <li class="ember-power-select-option"
          id="{{@select.uniqueId}}-{{@groupIndex}}{{index}}"
          aria-selected="{{emberPowerSelectIsSelected opt @select.selected}}"
          aria-disabled={{if opt.disabled "true"}}
          aria-current="{{eq opt @select.highlighted}}"
          data-option-index="{{@groupIndex}}{{index}}"
          role="option">
          {{yield opt @select}}
        </li>
      </VerticalCollection>
    </ul>
  </template>
}
