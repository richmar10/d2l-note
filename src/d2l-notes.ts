import './d2l-note';
/**
 * Import LitElement base class, html helper function,
 * and TypeScript decorators
 **/
import {
	customElement, html, LitElement, property
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
	@property()
	prop1 = 'd2l-notes';

	/**
	 * Implement `render` to define a template for your element.
	 */
	render() {
		/**
		 * Use JavaScript expressions to include property values in
		 * the element template.
		 */
		return html`<p>Hello ${this.prop1}!</p>`;
	}
}
