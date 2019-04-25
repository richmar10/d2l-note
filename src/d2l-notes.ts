import './d2l-note';
/**
 * Import LitElement base class, html helper function,
 * and TypeScript decorators
 **/
import {
	customElement, html, LitElement, property, TemplateResult
} from 'lit-element';

/**
 * Use the customElement decorator to define your class as
 * a custom element. Registers <my-element> as an HTML tag.
 */
@customElement('d2l-notes')
export class D2LNotes extends LitElement {

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
				ol {
					margin: 0;
					padding: 0;
				}
				li {
					display: block;
				}
			</style>
			<ol>
			${this.notes.map(note => html`
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

			${this.cancreate ? html`<d2l-note-edit new>
				<div slot="description">${this.description}</div>
				<div slot="settings">${this.settings}</div>
			</d2l-note-edit>` : null}
		`;
	}
}
