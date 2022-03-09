import '@brightspace-ui/core/components/button/button-subtle.js';
import '@brightspace-ui/core/components/colors/colors.js';
import './d2l-note';

/**
 * Import LitElement base class, html helper function,
 * and TypeScript decorators
 **/
import { css, html, LitElement } from 'lit';

import { bodyStandardStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { langResources } from './lang';
import { LocalizeStaticMixin } from '@brightspace-ui/core/mixins/localize-static-mixin.js';

/**
 * d2l-note component created with lit-element
 *
 * # Usage
 * ```html
 * <d2l-notes
 *	 id="notes"
 *	 dateformat="medium"
 *	 editstring="Edit Note"
 *	 deletestring="Delete Note"
 *	 privatelabel="Private"
 *	 addnotestring="Add"
 *	 savenotestring="Save"
 *	 discardnotestring="Discard"
 *	 editplaceholder="Placeholder for d2l-note-edit"
 * >
 *	 <div slot="description">Description for d2l-note-edit</div>
 * </d2l-notes>
 * <script>
 * document.getElementById('notes').description = (note) => note ? html`<p>Description for note</p>` : html`<p>Description for notes</p>`;
 * document.getElementById('notes').settings = (note) => note ? html`<div>Settings for note</div>` : html`<div>Settings for notes</div>`;
 * document.getElementById('notes').notes = [{
 *	user: {
 *		name: 'Username',
 *		pic: {
 *			url: 'url',
 *			requireTokenAuth: true,
 *		},
 *	},
 *	token: 'foozleberries',
 *	showAvatar: true,
 *	me: false,
 *	createdAt: '2019-04-23T17:08:33.839Z',
 *	updatedAt: '2019-04-24T17:08:33.839Z',
 *	text: 'Note',
 *	canEdit: true,
 *	canDelete: true,
 *	private: true,
 *	contextmenulabel: 'Context Menu'
 * }];
 * </script>
 * ```
 */
export class D2LNotes extends LocalizeStaticMixin(LitElement) {
	static properties = {
		/**
		 * Array of notes to pass to d2l-note elements
		 */
		notes: { type: Array },
		/**
		 * Indicates this user can create new notes
		 */
		canCreate: { type: Boolean, attribute: 'can-create' },
		/**
		 * d2l-note-edit placeholder to show when creating
		 */
		editPlaceholder: { type: String, attribute: 'edit-placeholder' },
		/**
		 * TemplateResult containing description for d2l-note's in edit state and d2l-note-edit
		 */
		description: { type: Object },
		/**
		 * TemplateResult containing settings for d2l-note's in edit state and d2l-note-edit
		 */
		settings: { type: Object },
		/**
		 * Show the loadmore button regardless of number of items
		 */
		hasMore: { type: Boolean, attribute: 'has-more' },
		/**
		 * Load more/less collapsed state
		 */
		collapsed: { type: Boolean },
		/**
		 * Number of items to show before showing the load more button
		 */
		collapsedSize: { type: Number, attribute: 'collapsed-size' },
		/**
		 * dateformat in d2l-note's
		 */
		dateFormat: { type: String, attribute: 'date-format' },
		/**
		 * override loadmore button text
		 */
		loadMoreString: { type: String, attribute: 'load-more-string' },
		/**
		 * override loadless button text
		 */
		loadLessString: { type: String, attribute: 'load-less-string' },
		/**
		 * editstring in d2l-note's
		 */
		editString: { type: String, attribute: 'edit-string' },
		/**
		 * deletestring in d2l-note's
		 */
		deleteString: { type: String, attribute: 'delete-string' },
		/**
		 * privatelabel in d2l-note's
		 */
		privateLabel: { type: String, attribute: 'private-label' },
		/**
		 * addnotestring in d2l-note-edit
		 */
		addNoteString: { type: String, attribute: 'add-note-string' },
		/**
		 * savenotestring in d2l-note's
		 */
		saveNoteString: { type: String, attribute: 'save-note-string' },
		/**
		 * discardnotestring in d2l-note's and d2l-note-edit
		 */
		discardNoteString: { type: String, attribute: 'discard-note-string' },
		/**
		 * string to show when there are no notes to show. Set to '' to not show anything
		 */
		emptyString: { type: String, attribute: 'empty-string' },
		/**
		 * label for the 'enter notes' area, overridden by emptystring if there are no existing notes. Does not render if undefined
		 */
		enterNoteString: { type: String, attribute: 'enter-note-string' },
	}

	constructor() {
		super();
		this.notes = [];
		this.canCreate = false;
		this.editPlaceholder = '';
		this.description = () => html`<div></div>`;
		this.settings = () => html`<div></div>`;
		this.hasMore = false;
		this.collapsed = true;
		this.collapsedSize = 4;

		/**
		 * Fired when load more is tapped
		 * @fires d2l-notes-load-more
		 */
		this.EVENT_LOAD_MORE = 'd2l-notes-load-more';

		/**
		 * Fired when load less is tapped
		 * @fires d2l-notes-load-less
		 */
		this.EVENT_LOAD_LESS = 'd2l-notes-load-less';

	}

	static get resources() {
		return langResources;
	}

	static styles = [bodyStandardStyles, css`
		:host {
			--d2l-notes-note-margin-top: 6px;
			--d2l-notes-note-margin-bottom: 12px;
			--d2l-notes-hr-margin-bottom: 18px;
			--d2l-notes-ol-margin-bottom: 24px;
			--d2l-notes-load-more-margin-bottom: 36px;
		}
		:host {
			display: block;
		}
		.d2l-typography {
			line-height: 0;
		}
		ol {
			margin: 0;
			padding: 0;
			/* (paragraph separation) 8px + (load more/less border) 1px + (load more/less padding) 8px = 17px */
			margin-bottom: calc(var(--d2l-notes-ol-margin-bottom) - 17px);

			@apply --d2l-notes-ol;
		}
		li {
			display: block;
			margin-top: var(--d2l-notes-note-margin-top);
			margin-bottom: var(--d2l-notes-note-margin-bottom);

			@apply --d2l-notes-li;
		}
		li:first-child {
			margin-top: 0;

			@apply --d2l-notes-li-first;
		}
		li:last-child {
			margin-bottom: 0;

			@apply --d2l-notes-li-last;
		}

		hr {
			/* (paragraph separation) 8px */
			margin-top: calc(var(--d2l-notes-ol-margin-bottom) - 8px);
			margin-bottom: var(--d2l-notes-hr-margin-bottom);

			@apply --d2l-notes-hr;
		}

		.d2l-notes-more-less {
			display: flex;
			width: 100%;
			align-items: center;
			/* load more/less padding (8px) - load more/less border (1px) = 9px */
			margin-bottom: calc(var(--d2l-notes-load-more-margin-bottom) - 9px);

			@apply --d2l-notes-more-less;
		}

		.d2l-notes-load-more-less {
			flex: 0 1 auto;

			@apply --d2l-notes-more-less-button;
		}

		.d2l-notes-more-less-separator {
			flex: 1;
			border-top: solid 1px var(--d2l-color-celestine);

			@apply --d2l-notes-more-less-separator;
		}

		.d2l-notes-enter-note-string,
		.d2l-note-emptystring {
			line-height: 1.4;
			margin-bottom: 0.6rem;
		}
	`];

	/**
	 * Implement `render` to define a template for your element.
	 */
	render() {
		const hasmore = this.hasMore || this.notes.length > this.collapsedSize;
		const notes = this.notes && this.collapsed ? this.notes.slice(0, this.collapsedSize) : this.notes;
		/**
		 * Use JavaScript expressions to include property values in
		 * the element template.
		 */
		return html`
			<div class="d2l-typography">
				${notes.length > 0 ? html`
					<ol>
						${notes.map(note => html`
							<li>
								<d2l-note
									.id=${note.id ? note.id : ''}
									.user=${note.user}
									.href=${note.href}
									.token=${note.token}
									?show-avatar=${typeof note.showAvatar === 'boolean' ? note.showAvatar : true}
									.me=${note.me ? note.me : false}
									created-at=${note.createdAt}
									updated-at=${note.updatedAt}
									text=${note.text}
									?can-edit=${note.canEdit ? note.canEdit : false}
									?can-delete=${note.canDelete ? note.canDelete : false}
									?private=${note.private ? note.private : false}
									date-format=${this.dateFormat}
									context-menu-label=${note.contextmenulabel}
									edit-string=${this.editString}
									delete-string=${this.deleteString}
									private-label=${this.privateLabel}
									add-note-string=${this.addNoteString}
									save-note-string=${this.saveNoteString}
									discard-note-string=${this.discardNoteString}
									edit-placeholder=${this.editPlaceholder}
								>
									<div slot="description">${this.description(note)}</div>
									<div slot="settings">${this.settings(note)}</div>
								</d2l-note>
							</li>
						`)}
					</ol>
				` : (this.emptyString === '' ? '' : html`
					<div class="d2l-body-standard d2l-note-emptystring">
						${this.emptyString !== undefined || this.enterNoteString !== undefined ? this.emptyString || this.enterNoteString : this.localize('empty')}
					</div>
				`)}

				${hasmore ? html`
					<div
						class="d2l-notes-more-less"
						@click=${this.handleMoreLess}
						@tap=${this.handleMoreLess}
					>
					<div class="d2l-notes-more-less-separator"></div>
					<d2l-button-subtle
						class="d2l-notes-load-more-less"
						text="${(this.hasMore || this.collapsed) ? this.loadMoreString ? this.loadMoreString : this.localize('more') : this.loadLessString ? this.loadLessString : this.localize('less')}"
					></d2l-button-subtle>
					<div class="d2l-notes-more-less-separator"></div></div>
				` : null}

				${(hasmore || this.notes.length) && this.canCreate ? html`<hr>` : null}

				${this.canCreate ? html`${notes.length > 0 && this.enterNoteString !== undefined ? html`<div class='d2l-notes-enter-note-string'>${this.enterNoteString}</div>` : html``}
				<d2l-note-edit new placeholder="${this.editPlaceholder}">
					<slot class="d2l-body-standard" name="description" slot="description"><div>${this.description()}</div></slot>
					<div slot="settings">${this.settings()}</div>
				</d2l-note-edit>` : null}
			</div>
		`;
	}

	handleMoreLess() {
		if (this.hasmore || this.collapsed) {
			this.dispatchEvent(new CustomEvent(this.EVENT_LOAD_MORE, {
				bubbles: true,
				composed: true
			}));
			this.collapsed = false;
		} else {
			this.dispatchEvent(new CustomEvent(this.EVENT_LOAD_LESS, {
				bubbles: true,
				composed: true
			}));
			this.collapsed = true;
		}
	}
}
customElements.define('d2l-notes', D2LNotes);
