import '@d2l/user-elements/d2l-user.js';
import 'd2l-icons/d2l-icon';
import 'd2l-icons/tier1-icons';
import 'd2l-dropdown/d2l-dropdown-more';
import 'd2l-dropdown/d2l-dropdown-menu';
import 'd2l-menu/d2l-menu';
import 'd2l-menu/d2l-menu-item';
import 'd2l-more-less/d2l-more-less';
import 'd2l-colors/d2l-colors';
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
import { repeat } from 'lit-html/directives/repeat';

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
	showavatar = false;

	@property({ type: String })
	createdat?: string;

	@property({ type: String })
	updatedat?: string;

	@property({ type: String })
	text?: string;

	@property({ type: String })
	editplaceholder: string = '';

	@property({ type: Boolean, reflect: true })
	me: boolean = false;

	@property({ type: Boolean })
	private: boolean = false;

	@property({ type: Boolean })
	canedit: boolean = false;

	@property({ type: Boolean })
	candelete: boolean = false;

	@property({ type: String })
	dateformat: string = 'medium';

	@property({ type: Boolean })
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
		const mapToParagraphs = (text: string) => repeat(
			text.split('\n'),
			(paragraph) => html`<div className="paragraph">${paragraph}</div>`
		);
		function convertText(text: string) {
			return html`
				<d2l-more-less>
					<div class="d2l-note-text d2l-body-standard">${mapToParagraphs(text)}</div>
				</d2l-more-less>`;
		}
		/**
		 * Use JavaScript expressions to include property values in
		 * the element template.
		 */
		const imageUrl = (this.showavatar && this.user && this.user.pic) ? this.user.pic.url : undefined;
		const useImageAuthentication = !!(this.showavatar && this.user && this.user.pic && this.user.pic.requireTokenAuth);
		const userName = this.showavatar ? this.me ? this.localize('me') : this.user ? this.user.name : undefined : undefined;

		const createdAtDate = this.createdat ? new Date(this.createdat) : null;
		const date = createdAtDate ? this.formatDateTime(createdAtDate, { format: this.dateformat || 'medium' }) : undefined;
		// Need this step because the formatter doesn't parse the time when using a custom format
		const dateTime = createdAtDate ? this.formatTime(createdAtDate, { format: date }) : undefined;

		const subText = this.updatedat ? this.localize('SubtextEdited', dateTime) : dateTime;
		const showDropdown = this.canedit || this.candelete;
		return html`
			<style>${D2LNote.d2lTypographyStyle}</style>
			<style>
				:host {
					position: relative;
					display: flex;
					line-height: 0;
					padding-top: 6px;
				}
				:host([me]) {
					background-color: var(--d2l-color-regolith);
				}
				.d2l-note-main {
					flex: 1;
					line-height: 0;
				}
				.d2l-note-top {
					display: flex;
					justify-content: space-between;
					align-items: flex-start;
				}

				d2l-user {
					margin-bottom: 18px;
				}

				.d2l-note-text {
					margin-bottom: 12px;
				}
				.paragraph {
					margin: 0.5rem 0;
				}

				.d2l-note-private-indicator {
					position: absolute;
					bottom: 0;
					right: 0;
				}

				:host(:dir(rtl)) .d2l-note-private-indicator {
					right: initial;
					left: 0;
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
				<div class="d2l-note-top">
					${this.user ? html`
						<d2l-user
							.imageUrl="${imageUrl}"
							.imageToken="${useImageAuthentication ? this.token : ''}"
							.name="${userName}"
							.subText="${subText}"
							.useImageAuthentication=${useImageAuthentication}
							.shouldHideImage=${!this.showavatar}
							></d2l-user>` : html`
						<div class="d2l-note-user-skeleton skeleton-user">
							<div class="skeleton skeleton-avatar"></div>
							<div class="skeleton-info-container">
								<div class="skeleton skeleton-name"></div>
								<div class="skeleton skeleton-subtext"></div>
							</div>
						</div>`}
					${showDropdown ? html`
						<d2l-dropdown-more text="${this.contextmenulabel ? this.contextmenulabel : this.localize('contextMenu')}">
							<d2l-dropdown-menu>
								<d2l-menu label="${this.contextmenulabel ? this.contextmenulabel : this.localize('contextMenu')}">
									${this.canedit && !this.editting ? html`<d2l-menu-item
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
				</div>
				${this.editting ? html`
					<d2l-note-edit
						id="${this.id}"
						placeholder="${this.editplaceholder}"
						value="${this.text}"
						.addnotestring=${this.addnotestring}
						.savenotestring=${this.savenotestring}
						.discardnotestring=${this.discardnotestring}
						@d2l-note-edit-finished=${this._handleFinished}
					>
						<slot name="description" slot="description"></slot>
						<slot name="settings" slot="settings"></slot>
					</d2l-note-edit>` : this.text ? convertText(this.text) : html`
					<div class="d2l-note-text-skeleton skeleton"></div>`}
				${!this.editting && this.private ? html`<d2l-icon
					class="d2l-note-private-indicator"
					icon="d2l-tier1:visibility-hide"
					aria-label="${this.privatelabel ? this.privatelabel : this.localize('private')}"
				></d2l-icon>` : null }
			</div>
		`;
	}

	editSelectHandler() {
		this.editting = true;
	}

	_handleFinished() {
		this.editting = false;
	}

	deleteSelectHandler() {
		this.dispatchEvent(new CustomEvent('d2l-note-delete', {
			bubbles: true,
			composed: true,
			detail: {
				id: this.id
			}
		}));
	}
}
