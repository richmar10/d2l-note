import 'd2l-inputs/d2l-input-text';
import 'd2l-icons/tier1-icons';
import 'd2l-button/d2l-button';
import 'd2l-button/d2l-button-icon';
/**
 * Import LitElement base class, html helper function,
 * and TypeScript decorators
 **/
import {
	customElement, html, LitElement, property
} from 'lit-element';

import { LocalizeMixin } from './mixins/localize-mixin';

/**
 * Use the customElement decorator to define your class as
 * a custom element. Registers <my-element> as an HTML tag.
 */
@customElement('d2l-note-edit')
export class D2LNoteEdit extends LocalizeMixin(LitElement) {

	/**
	 * Create an observed property. Triggers update on change.
	 */
	@property({ type: Boolean })
	new: boolean = false;

	@property({ type: String })
	value: string = '';

	__langResources = {
		'en': {
			'add': 'Add',
			'save': 'Save',
			'discard': 'Discard'
		}
	}

	getLanguage(langs: string[]) {
		for (let i = 0; i < langs.length; i++) {
			if (this.__langResources[langs[i]]) {
				return langs[i];
			}
		}
	}

	async getLangResources(lang: string) {
		const proto = this.constructor.prototype;
		this.checkLocalizationCache(proto);

		const namespace = `d2l-note-edit:${lang}`;

		if (proto.__localizationCache.requests[namespace]) {
			return proto.__localizationCache.requests[namespace];
		}

		const result = this.__langResources[lang];

		proto.__localizationCache.requests[namespace] = result;
		return result;
	}

	/**
	 * Implement `render` to define a template for your element.
	 */
	render() {
		/**
		 * Use JavaScript expressions to include property values in
		 * the element template.
		 */
		return html`
			<style>
				.d2l-note-edit-bottom {
					margin-top: 0.5rem;
					display: flex;
					flex-direction: row;
					justify-content: space-between;
				}

				.d2l-note-edit-bottom-left {
					display: flex;
					flex-direction: row;
				}

				.d2l-note-edit-settings {
					margin-left: 0.5rem;
					margin-right: 0.5rem;
				}
			</style>

			<div class="d2l-note-edit-description">
				<slot name="description"></slot>
			</div>
			<d2l-input-text value=${this.value} @change=${this._handleChange}></d2l-input-text>
			<div class="d2l-note-edit-bottom">
				<div class="d2l-note-edit-bottom-left">
					<d2l-button class="d2l-note-edit-button" @click=${this._handleEditClick} primary>${this.new ? this.localize('add') : this.localize('save')}</d2l-button>
					<div class="d2l-note-edit-settings">
						<slot name="settings"></slot>
					</div>
				</div>
				<d2l-button-icon class="d2l-note-edit-discard-button" @click=${this._handleClick} icon="d2l-tier1:delete" text="${this.localize('discard')}"></d2l-button-icon>
			</div>
		`;
	}

	_handleChange(e: Event) {
		this.value = e.target && (e.target as any).value;
	}

	_handleEditClick() {
		if (this.new) {
			this.dispatchEvent(new CustomEvent('d2l-note-edit-add', {
				bubbles: true,
				composed: true
			}));
		} else {
			this.dispatchEvent(new CustomEvent('d2l-note-edit-save', {
				bubbles: true,
				composed: true
			}));
		}
	}

	_handleClick() {
		this.dispatchEvent(new CustomEvent('d2l-note-edit-discard', {
			bubbles: true,
			composed: true
		}));
	}
}
