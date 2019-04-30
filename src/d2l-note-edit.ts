import 'd2l-inputs/d2l-input-textarea';
import 'd2l-icons/tier2-icons';
import 'd2l-button/d2l-button';
import 'd2l-button/d2l-button-icon';
import 'd2l-alert/d2l-alert';
/**
 * Import LitElement base class, html helper function,
 * and TypeScript decorators
 **/
import {
	customElement, html, LitElement, property
} from 'lit-element';

import { LocalizeMixin } from './mixins/localize-mixin';

/**
 * d2l-note-edit component created with lit-element
 *
 * # Usage
 * ```html
 * <d2l-note-edit
 *	 id="edit"
 *	 placeholder="Placeholder"
 *	 value="Initial note text"
 *	 expanded
 *	 addnotestring="Add"
 *	 savenotestring="Save"
 *	 discardnotestring="Discard"
 *>
 *	 <div slot="description">Description</div>
 *	 <div slot="settings">Settings slot</div>
 * </d2l-note-edit>
 * ```
 */
@customElement('d2l-note-edit')
export class D2LNoteEdit extends LocalizeMixin(LitElement) {

	/**
	 * Indicates this control creates a new item
	 */
	@property({ type: Boolean })
	new: boolean = false;

	/**
	 * Contents of note. Updates with change event on textarea
	 */
	@property({ type: String })
	value: string = '';

	/**
	 * Placeholder for textarea
	 */
	@property({ type: String })
	placeholder: string = '';

	/**
	 * Text for the 'Add' button. Defaults to langified 'Add'
	 */
	@property({ type: String })
	addnotestring?: string;

	/**
	 * Text for the 'Save' button. Defaults to langified 'Save'
	 */
	@property({ type: String })
	savenotestring?: string;

	/**
	 * Label for the 'Discard' button. Defaults to langified 'Discard'
	 */
	@property({ type: String })
	discardnotestring?: string;

	/**
	 * Indicates whether the component is in its expanded state. If true,
	 * The textarea is set to its maximum height, the controls are visible.
	 */
	@property({ type: Boolean, reflect: true })
	expanded = false;

	/**
	 * The error message to show if set. Shows a d2l-alert component and
	 * sets the color of the textarea to --d2l-alert-critical-color
	 */
	@property({ type: String })
	errormessage?: string;

	/**
	 * Fired when edit is finished
	 * @event
	 */
	static EVENT_FINISHED = 'd2l-note-edit-finished';

	/**
	 * Fired when Add button is tapped
	 * @event
	 */
	static EVENT_ADD = 'd2l-note-edit-add';

	/**
	 * Fired when Save button is tapped
	 * @event
	 */
	static EVENT_SAVE = 'd2l-note-edit-save';

	/**
	 * Fired when Discard button is tapped
	 * @event
	 */
	static EVENT_DISCARD = 'd2l-note-edit-discard';

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
				:host {
					display: block;
					line-height: 0;

					--d2l-note-edit-spacing: 12px;
					--d2l-note-edit-textarea-font-size: 1rem;
					--d2l-note-edit-textarea-line-height: 1.2rem;
					--d2l-note-edit-textarea-padding-vertical: 0.5rem;
					--d2l-note-edit-textarea-padding-horizontal: 0.75rem;
					--d2l-note-edit-transition-duration: 0.5s;

					--d2l-note-edit-base-textarea: {
						font-size: var(--d2l-note-edit-textarea-font-size);

						transition-property: height;
						transition-duration: var(--d2l-note-edit-transition-duration);
						transition-timing-function: ease;
					};

					--d2l-note-edit-common-textarea: {
						@apply --d2l-note-edit-base-textarea;
					}
				}
				.d2l-note-edit-controls {
					margin-top: var(--d2l-note-edit-spacing);
					display: flex;
					flex-direction: row;
					justify-content: space-between;

					transition-property: height, opacity, visibility;
					transition-duration: var(--d2l-note-edit-transition-duration), var(--d2l-note-edit-transition-duration);
					transition-timing-function: ease, ease;

					@apply --d2l-note-edit-controls;
				}

				:host(:not([focused])) .d2l-note-edit-controls,
				:host(:not([expanded])) .d2l-note-edit-controls {
					height: 0;
					opacity: 0;
					visibility: hidden;

					transition-delay: var(--d2l-note-edit-transition-duration), 0s, var(--d2l-note-edit-transition-duration);

					@apply --d2l-note-edit-controls-nofocus;
				}

				:host([focused]) .d2l-note-edit-controls,
				:host([expanded]) .d2l-note-edit-controls {
					/* d2l-button line-height + padding + border */
					height: calc(2rem + 2px);
					opacity: 1;
					visibility: visible;

					transition-delay: 0s, var(--d2l-note-edit-transition-duration), var(--d2l-note-edit-transition-duration);

					@apply --d2l-note-edit-controls-focus;
				}

				.d2l-note-edit-bottom-left {
					display: flex;
					flex-direction: row;

					@apply --d2l-note-edit-bottom-left;
				}

				.d2l-note-edit-settings {
					margin-left: 0.5rem;
					margin-right: 0.5rem;

					@apply --d2l-note-edit-settings;
				}

				d2l-alert {
					margin-top: var(--d2l-note-edit-spacing);

					@apply --d2l-note-edit-error-alert;
				}

				d2l-input-textarea.d2l-note-edit-error {
					--d2l-note-edit-common-textarea: {
						@apply --d2l-note-edit-base-textarea;
						border-color: var(--d2l-alert-critical-color, --d2l-color-cinnabar);
					};

					--d2l-input-hover-focus: {
						border-color: var(--d2l-alert-critical-color, --d2l-color-cinnabar);
						border-width: 2px;
						outline-style: none;
						outline-width: 0;
						padding: var(--d2l-input-padding-focus);
					};

					@apply --d2l-note-edit-error-textarea;
				}

				d2l-input-textarea {
					--d2l-input-padding: var(--d2l-note-edit-textarea-padding-vertical) var(--d2l-note-edit-textarea-padding-horizontal);
					--d2l-input-padding-focus: calc(var(--d2l-note-edit-textarea-padding-vertical) - 1px) calc(var(--d2l-note-edit-textarea-padding-horizontal) - 1px);

					--d2l-input-placeholder: {
						color: var(--d2l-input-placeholder-color);
						font-size: var(--d2l-note-edit-textarea-font-size);
						font-weight: 400;
						opacity: 1; /* Firefox has non-1 default */
					}

					--d2l-input-textarea: {
						@apply --d2l-note-edit-common-textarea;
					}

					@apply --d2l-note-edit-textarea;
				}

				:host(:not([focused])) d2l-input-textarea,
				:host(:not([expanded])) d2l-input-textarea {
					--d2l-input-textarea: {
						@apply --d2l-note-edit-common-textarea;

						/* textarea line-height + padding + border */
						height: calc(var(--d2l-note-edit-textarea-line-height) + var(--d2l-note-edit-textarea-padding-vertical) * 2 + 2px);

						transition-delay: var(--d2l-note-edit-transition-duration);
					}

					@apply --d2l-note-edit-textarea-nofocus;
				}

				:host([focused]) d2l-input-textarea,
				:host([expanded]) d2l-input-textarea {
					--d2l-input-textarea: {
						@apply --d2l-note-edit-common-textarea;

						/* textarea line-height * 4 + padding + border */
						height: calc(var(--d2l-note-edit-textarea-line-height) * 4 + var(--d2l-note-edit-textarea-padding-vertical) * 2 + 2px);

						transition-delay: 0s;
					}

					@apply --d2l-note-edit-textarea-focus;
				}
			</style>

			<div class="d2l-note-edit-description">
				<slot name="description"></slot>
			</div>
			<div
				@focusin=${this._handleFocusin}
				@focusout=${this._handleFocusout}
			>
				<d2l-input-textarea
					class="${this.errormessage ? 'd2l-note-edit-error' : ''}"
					value="${this.value}"
					placeholder="${this.placeholder}"
					@change=${this._handleChange}
				></d2l-input-textarea>
				<d2l-alert type="error" .hidden=${!this.errormessage}>${this.errormessage}</d2l-alert>
				<div class="d2l-note-edit-controls">
					<div class="d2l-note-edit-bottom-left">
						<d2l-button
							class="d2l-note-edit-button"
							primary
							@click=${this._handleEditClick}
						>
							${this.new ? this.addnotestring ? this.addnotestring : this.localize('add') : this.savenotestring ? this.savenotestring : this.localize('save')}
						</d2l-button>
						<div class="d2l-note-edit-settings">
							<slot name="settings"></slot>
						</div>
					</div>
					<d2l-button-icon
						class="d2l-note-edit-discard-button"
						icon="d2l-tier2:delete"
						text="${this.discardnotestring ? this.discardnotestring : this.localize('discard')}"
						@click=${this._handleClick}
					></d2l-button-icon>
				</div>
			</div>
		`;
	}

	_handleChange(e: Event) {
		this.value = e.target && (e.target as any).value;
	}

	_handleEditClick() {
		this.errormessage = undefined;
		const finish = (error?: any) => {
			if (error) {
				this.errormessage = error.message ? error.message : error;
				return;
			}
			this.dispatchEvent(new CustomEvent(D2LNoteEdit.EVENT_FINISHED, {
				bubbles: true,
				composed: true,
				detail: {
					id: this.id,
					value: this.value
				}
			}));
			this.value = '';
		};
		let succeeded = false;
		if (this.new) {
			succeeded = this.dispatchEvent(new CustomEvent(D2LNoteEdit.EVENT_ADD, {
				bubbles: true,
				composed: true,
				cancelable: true,
				detail: {
					id: this.id,
					text: this.value,
					finish
				}
			}));
		} else {
			succeeded = this.dispatchEvent(new CustomEvent(D2LNoteEdit.EVENT_SAVE, {
				bubbles: true,
				composed: true,
				cancelable: true,
				detail: {
					id: this.id,
					text: this.value,
					finish
				}
			}));
		}
		if (succeeded) {
			finish();
		}
	}

	_handleClick() {
		this.errormessage = undefined;
		const discarded = this.dispatchEvent(new CustomEvent(D2LNoteEdit.EVENT_DISCARD, {
			bubbles: true,
			composed: true,
			cancelable: true,
			detail: {
				id: this.id,
				value: this.value
			}
		}));

		if (discarded) {
			this.dispatchEvent(new CustomEvent(D2LNoteEdit.EVENT_FINISHED, {
				bubbles: true,
				composed: true,
				detail: {
					id: this.id,
					value: this.value
				}
			}));
			this.value = '';
		}
	}

	_handleFocusin() {
		this.setAttribute('focused', '');
	}

	_handleFocusout() {
		this.removeAttribute('focused');
	}
}
