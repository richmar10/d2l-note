import '@d2l/user-elements/d2l-user.js';
import 'd2l-icons/d2l-icon';
import 'd2l-icons/tier1-icons';
import 'd2l-dropdown/d2l-dropdown-more';
import 'd2l-dropdown/d2l-dropdown-menu';
import 'd2l-menu/d2l-menu';
import 'd2l-menu/d2l-menu-item';
import 'd2l-more-less/d2l-more-less';
import './d2l-note-edit';
/**
 * Import LitElement base class, html helper function,
 * and TypeScript decorators
 **/
import {
	customElement, html, LitElement, property
} from 'lit-element';

import { D2LTypographyMixin } from './mixins/d2l-typography-mixin';
import { LocalizeMixin } from './mixins/localize-mixin';

/**
 * Use the customElement decorator to define your class as
 * a custom element. Registers <my-element> as an HTML tag.
 */
@customElement('d2l-note')
export class D2LNote extends D2LTypographyMixin(LocalizeMixin(LitElement)) {

	/**
	 * Create an observed property. Triggers update on change.
	 */
	@property({ type: Object })
	user?: {
		pic?: {
			url: string;
			requireTokenAuth?: boolean;
		};
		name?: string;
	};

	@property({ type: String })
	token?: string;

	@property({ type: Boolean })
	showavatar = true;

	@property({ type: String })
	createdat?: string;

	@property({ type: String })
	updatedat?: string;

	@property({ type: String })
	text?: string;

	@property({ type: String })
	editplaceholder: string = '';

	@property({ type: Boolean })
	me: boolean = false;

	@property({ type: Boolean })
	private: boolean = false;

	@property({ type: Boolean })
	canedit: boolean = false;

	@property({ type: Boolean })
	candelete: boolean = false;

	@property({ attribute: false })
	editting: boolean = false;

	@property({ type: String })
	contextmenulabel?: string;

	@property({ type: String })
	editstring?: string;

	@property({ type: String })
	deletestring?: string;

	@property({ type: String })
	privatelabel?: string;

	@property({ type: String })
	addnotestring?: string;

	@property({ type: String })
	savenotestring?: string;

	@property({ type: String })
	discardnotestring?: string;

	__langResources = {
		'en': {
			'SubtextEdited': '{0} (Edited)',
			'me': 'Me',
			'contextMenu': 'Context Menu',
			'edit': 'Edit',
			'delete': 'Delete',
			'private': 'Private'
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

		const namespace = `d2l-note:${lang}`;

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
		function convertText(text: string) {
			return html`
				<d2l-more-less>
					<div class="d2l-note-text d2l-body-standard">${text}</div>
				</d2l-more-less>`;
		}
		/**
		 * Use JavaScript expressions to include property values in
		 * the element template.
		 */
		const imageUrl = (this.showavatar && this.user && this.user.pic) ? this.user.pic.url : '';
		const useImageAuthentication = !!(this.showavatar && this.user && this.user.pic && this.user.pic.requireTokenAuth);
		const userName = this.me ? this.localize('me') : this.user ? this.user.name : undefined;

		const date = this.createdat ? this.formatDateTime(new Date(this.createdat), { format: 'medium' }) : '';
		const subText = this.updatedat ? this.localize('SubtextEdited', date) : date;
		const showDropdown = this.canedit || this.candelete;
		return html`
			<style>${D2LNote.d2lTypographyStyle}</style>
			<style>
				:host {
					position: relative;
					display: flex;
					line-height: 0;
				}
				.d2l-note-main {
					flex: 1;
					line-height: 0;
				}
				.d2l-note-sidebar {
					flex: 0;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: space-between;
				}

				d2l-user {
					margin-bottom: 18px;
				}

				.d2l-note-text {
					margin-bottom: 18px;
				}

				.skeleton {
					background: var(--d2l-color-sylvite);
					border-radius: 6px;
				}

				.skeleton.skeleton-avatar {
					width: 48px;
					height: 48px;
				}

				.skeleton-user {
					display: flex;
					justify-content: space-between;
					width: 193px;
					margin-bottom: 18px;
				}

				.skeleton-user .skeleton-info-container {
					display: flex;
					flex-direction: column;
					justify-content: center;
				}

				.skeleton-user .skeleton-name {
					width: 80px;
					height: 18px;
					margin-bottom: 5px;
				}

				.skeleton-user .skeleton-subtext {
					width: 140px;
					height: 18px;
				}

				.d2l-note-text-skeleton {
					width: 100%;
					height: 1.4rem;
					margin-bottom: 18px;
				}
			</style>
			<div class="d2l-note-main d2l-typography">
				${this.user ? html`
					<d2l-user
						image-url="${imageUrl}"
						image-token="${useImageAuthentication ? this.token : ''}"
						name="${userName}"
						sub-text="${subText}"
						.useImageAuthentication=${useImageAuthentication}
						></d2l-user>` : html`
					<div class="d2l-note-user-skeleton skeleton-user">
						<div class="skeleton skeleton-avatar"></div>
						<div class="skeleton-info-container">
							<div class="skeleton skeleton-name"></div>
							<div class="skeleton skeleton-subtext"></div>
						</div>
					</div>`}
				${this.editting ? html`
					<d2l-note-edit
						placeholder="${this.editplaceholder}"
						.addnotestring=${this.addnotestring}
						.savenotestring=${this.savenotestring}
						.discardnotestring=${this.discardnotestring}
						@d2l-note-edit-discard=${this._handleDiscard} value=${this.text}
					>
						<slot name="description" slot="description"></slot>
						<slot name="settings" slot="settings"></slot>
					</d2l-note-edit>` : this.text ? convertText(this.text) : html`
					<div class="d2l-note-text-skeleton skeleton"></div>`}
			</div>

			${!this.editting ? html`
			<div class="d2l-note-sidebar">
				${showDropdown ? html`
					<d2l-dropdown-more text="${this.contextmenulabel ? this.contextmenulabel : this.localize('contextMenu')}">
						<d2l-dropdown-menu>
							<d2l-menu label="${this.contextmenulabel ? this.contextmenulabel : this.localize('contextMenu')}">
								${this.canedit ? html`<d2l-menu-item
									text="${this.editstring ? this.editstring : this.localize('edit')}"
									@d2l-menu-item-select=${this.editSelectHandler}
								></d2l-menu-item>` : null }
								${this.candelete ? html`<d2l-menu-item
									text="${this.deletestring ? this.deletestring : this.localize('delete')}"
									@d2l-menu-item-select=${this.deleteSelectHandler}
								></d2l-menu-item>` : null }
							</d2l-menu>
						</d2l-dropdown-menu>
					</d2l-dropdown-more>` : null }
				${this.private ? html`<d2l-icon
					class="d2l-note-private-indicator"
					icon="d2l-tier1:visibility-hide"
					aria-label="${this.privatelabel ? this.privatelabel : this.localize('private')}"
				></d2l-icon>` : null }
			</div>` : null }
		`;
	}

	editSelectHandler() {
		this.editting = true;
	}

	_handleDiscard() {
		this.editting = false;
	}

	deleteSelectHandler() {
		this.dispatchEvent(new CustomEvent('d2l-note-delete', {
			bubbles: true,
			composed: true
		}));
	}
}
