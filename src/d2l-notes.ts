import 'd2l-button/d2l-button-subtle';
import './d2l-note';
/**
 * Import LitElement base class, html helper function,
 * and TypeScript decorators
 **/
import {
	customElement, html, LitElement, property, TemplateResult
} from 'lit-element';

import { LocalizeMixin } from './mixins/localize-mixin';

/**
 * Use the customElement decorator to define your class as
 * a custom element. Registers <my-element> as an HTML tag.
 */
@customElement('d2l-notes')
export class D2LNotes extends LocalizeMixin(LitElement) {

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
		const notes = this.collapsed ? this.notes.slice(0, this.collapsedsize) : this.notes;
		/**
		 * Use JavaScript expressions to include property values in
		 * the element template.
		 */
		return html`
			<style>
				ol {
					margin: 0;
					padding: 0;
				}
				li {
					display: block;
				}
			</style>
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

			<d2l-button-subtle
				class="d2l-notes-load-more-less"
				@click=${this.handleMoreLess}
				text="${this.collapsed ? this.loadmorestring ? this.loadmorestring : this.localize('more') : this.loadlessstring ? this.loadlessstring : this.localize('less')}"
			></d2l-button-subtle>

			${this.cancreate ? html`<d2l-note-edit new>
				<div slot="description">${this.description}</div>
				<div slot="settings">${this.settings}</div>
			</d2l-note-edit>` : null}
		`;
	}

	handleMoreLess() {
		if (this.collapsed) {
			this.dispatchEvent(new CustomEvent('d2l-notes-load-more'));
		} else {
			this.dispatchEvent(new CustomEvent('d2l-notes-load-less'));
		}
		this.collapsed = !this.collapsed;
	}
}
