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
import { repeat } from 'lit-html/directives/repeat';

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
		id: string;
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
		contextmenulabel: string;
	}[] = [];

	@property({ type: Boolean })
	cancreate: boolean = false;

	@property({ type: String })
	editplaceholder: string = '';

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
	dateformat?: string;

	@property({ type: String })
	loadmorestring?: string;

	@property({ type: String })
	loadlessstring?: string;

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

	@property({ type: String })
	emptystring?: string;

	__langResources = {
		'en': {
			'more': 'Load More Notes',
			'less': 'Load Less Notes',
			'empty': 'No Notes'
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
		const notes = this.notes && this.collapsed ? this.notes.slice(0, this.collapsedsize) : this.notes;
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

					margin-bottom: 6px;
				}

				li:last-child {
					margin-bottom: 24px;
				}

				hr {
					margin-top: 36px;
					margin-bottom: 18px
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
				${notes.length > 0 ? html`
					<ol>${repeat(notes, (note) => html`
						<li>
							<d2l-note
								id="${note.id}"
								.user=${note.user}
								.token=${note.token}
								.showavatar=${typeof note.showAvatar === 'boolean' ? note.showAvatar : true}
								.me=${note.me ? note.me : false}
								.createdat=${note.createdAt}
								.updatedat=${note.updatedAt}
								.text=${note.text}
								.canedit=${note.canEdit ? note.canEdit : false}
								.candelete=${note.canDelete ? note.canDelete : false}
								.private=${note.private ? note.private : false}
								.dateformat=${this.dateformat}
								.contextmenulabel=${note.contextmenulabel}
								.editstring=${this.editstring}
								.deletestring=${this.deletestring}
								.privatelabel=${this.privatelabel}
								.addnotestring=${this.addnotestring}
								.savenotestring=${this.savenotestring}
								.discardnotestring=${this.discardnotestring}
								.editplaceholder=${this.editplaceholder}
							>
								<div slot="description">${this.description}</div>
								<div slot="settings">${this.settings}</div>
							</d2l-note>
						</li>
					`)}
					</ol>` : html`
						<span class="d2l-body-standard">${this.emptystring ? this.emptystring : this.localize('empty')}</span>
					`}

				${hasmore ? html`
				<div
					class="d2l-notes-more-less"
					@click=${this.handleMoreLess}
					@tap=${this.handleMoreLess}
				>
					<div class="d2l-notes-more-less-separator"></div>
					<d2l-button-subtle
						class="d2l-notes-load-more-less"
						text="${(this.hasmore || this.collapsed) ? this.loadmorestring ? this.loadmorestring : this.localize('more') : this.loadlessstring ? this.loadlessstring : this.localize('less')}"
					></d2l-button-subtle>
					<div class="d2l-notes-more-less-separator"></div>
				</div>
				` : null}

				${(hasmore || this.notes.length) && this.cancreate ? html`<hr>` : null}

				${this.cancreate ? html`<d2l-note-edit new placeholder="${this.editplaceholder}">
					<div slot="description">${this.description}</div>
					<div slot="settings">${this.settings}</div>
				</d2l-note-edit>` : null}
			</div>
		`;
	}

	handleMoreLess() {
		if (this.hasmore || this.collapsed) {
			this.dispatchEvent(new CustomEvent('d2l-notes-load-more', {
				bubbles: true,
				composed: true
			}));
			this.collapsed = false;
		} else {
			this.dispatchEvent(new CustomEvent('d2l-notes-load-less', {
				bubbles: true,
				composed: true
			}));
			this.collapsed = true;
		}
	}
}
