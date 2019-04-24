import '@d2l/user-elements/d2l-user.js';
import './d2l-note-edit';
/**
 * Import LitElement base class, html helper function,
 * and TypeScript decorators
 **/
import {
	customElement, html, LitElement, property
} from 'lit-element';

import { localizeMixin } from './d2l-localize-mixin';

/**
 * Use the customElement decorator to define your class as
 * a custom element. Registers <my-element> as an HTML tag.
 */
@customElement('d2l-note')
export class D2LNote extends localizeMixin(LitElement) {

	/**
	 * Create an observed property. Triggers update on change.
	 */
	@property({ type: Object })
	user?: {
		pic?: {
			url: string;
			requireTokenAuth?: boolean;
		},
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
	dateformat?: string;

	@property({ type: String })
	text?: string;

	/**
	 * Implement `render` to define a template for your element.
	 */
	render() {
		function convertText(text: string) {
			return html`<div class="d2l-note-text">${text}</div>`;
		}
		/**
		 * Use JavaScript expressions to include property values in
		 * the element template.
		 */
		const imageUrl = (this.showavatar && this.user && this.user.pic) ? this.user.pic.url : '';
		const useImageAuthentication = !!(this.showavatar && this.user && this.user.pic && this.user.pic.requireTokenAuth);

		const formatter = new d2lIntl.DateTimeFormat(this.language);
		const date = formatter.format(this.createdat)
			.format(this.dateformat || langterms('EvidenceDetails.DateFormat'));
		const subText = this.updatedat ? langterms('TeacherComments.SubtextEdited', date) : date;
		return html`
			${this.user ? html`
				<d2l-user
			        image-url=${imageUrl}
			        use-image-authentication=${useImageAuthentication}
			        image-token=${useImageAuthentication ? this.token : ''}
			        name=${this.user.name}
			        sub-text=${subText}
					></d2l-user>` : html`
				<div class="d2l-note-user-skeleton"></div>`}
			${this.text ? convertText(this.text) : html`<div class="d2l-note-text-skeleton"></div>`}
		`;
	}
}
