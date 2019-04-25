import 'd2l-button/d2l-button-subtle';
import 'd2l-colors/d2l-colors';
import './d2l-note';
/**
 * Import LitElement base class, html helper function,
 * and TypeScript decorators
 **/
import {
	customElement, html, LitElement, property, TemplateResult
} from 'lit-element';

import { D2LTypographyMixin } from './mixins/d2l-typography-mixin';
import { LocalizeMixin } from './mixins/localize-mixin';

/**
 * Use the customElement decorator to define your class as
 * a custom element. Registers <my-element> as an HTML tag.
 */
@customElement('d2l-notes')
export class D2LNotes extends D2LTypographyMixin(LocalizeMixin(LitElement)) {

	/**
	 * Create an observed property. Triggers update on change.
	 */
	@property({ type: Array })
	notes: {
		user: {
			name: string;
			pic: {
				url: string;
				requireTokenAuth?: boolean;
			};
		};
		token: string;
		showAvatar: boolean;
		me: boolean;
		createdAt: string;
		updatedAt: string;
		text: string;
		canEdit: boolean;
		canDelete: boolean;
		private: boolean;
	}[] = [];

	@property({ type: Boolean })
	cancreate: boolean = false;

	@property({ type: Object })
	description: TemplateResult = html`<div></div>`;

	@property({ type: Object })
	settings: TemplateResult = html`<div></div>`;

	@property({ type: Boolean })
	hasmore: boolean = false;

	@property({ type: Boolean })
	collapsed: boolean = true;

	@property({ type: Number })
	collapsedsize: number = 4;

	@property({ type: String })
	loadmorestring?: string;

	@property({ type: String })
	loadlessstring?: string;

	__langResources = {
		'en': {
			'more': 'Load More Notes',
			'less': 'Load Less Notes'
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

		const namespace = `d2l-notes:${lang}`;

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
		const hasmore = this.hasmore || this.notes.length > this.collapsedsize;
		const notes = this.collapsed ? this.notes.slice(0, this.collapsedsize) : this.notes;
		/**
		 * Use JavaScript expressions to include property values in
		 * the element template.
		 */
		return html`
			<style>${D2LNotes.d2lTypographyStyle}</style>
			<style>
				:host {
					display: block;
				}
				.d2l-typography {
					line-height: 0;
				}
				ol {
					margin: 0;
					padding: 0;
				}
				li {
					display: block;
				}

				.d2l-notes-more-less {
					display: flex;
					width: 100%;
					align-items: center;
				}

				.d2l-notes-load-more-less {
					flex: 0;
				}

				.d2l-notes-more-less-separator {
					flex: 1;
					border-top: solid 1px var(--d2l-color-celestine);
				}
			</style>
			<div class="d2l-typography">
				<ol>
				${notes.map(note => html`
					<li>
						<d2l-note
							.user=${note.user}
							.token=${note.token}
							.showavatar=${note.showAvatar ? note.showAvatar : false}
							.me=${note.me ? note.me : false}
							.createdat=${note.createdAt}
							.updatedat=${note.updatedAt}
							.text=${note.text}
							.canedit=${note.canEdit ? note.canEdit : false}
							.candelete=${note.canDelete ? note.canDelete : false}
							.private=${note.private ? note.private : false}
						>
							<div slot="description">${this.description}</div>
							<div slot="settings">${this.settings}</div>
						</d2l-note>
					</li>
				`)}
				</ol>

				${hasmore ? html`
				<div
					class="d2l-notes-more-less"
					@click=${this.handleMoreLess}
					@tap=${this.handleMoreLess}
				>
					<div class="d2l-notes-more-less-separator"></div>
					<d2l-button-subtle
						class="d2l-notes-load-more-less"
						text="${this.collapsed ? this.loadmorestring ? this.loadmorestring : this.localize('more') : this.loadlessstring ? this.loadlessstring : this.localize('less')}"
					></d2l-button-subtle>
					<div class="d2l-notes-more-less-separator"></div>
				</div>
				` : null}

				${hasmore && this.notes.length && this.cancreate ? html`<hr>` : null}

				${this.cancreate ? html`<d2l-note-edit new>
					<div slot="description">${this.description}</div>
					<div slot="settings">${this.settings}</div>
				</d2l-note-edit>` : null}
			</div>
		`;
	}

	handleMoreLess() {
		if (this.collapsed) {
			this.dispatchEvent(new CustomEvent('d2l-notes-load-more', {
				bubbles: true,
				composed: true
			}));
		} else {
			this.dispatchEvent(new CustomEvent('d2l-notes-load-less', {
				bubbles: true,
				composed: true
			}));
		}
		this.collapsed = !this.collapsed;
	}
}
