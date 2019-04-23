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
@customElement('d2l-note')
export class D2LNote extends LitElement {

	/**
	 * Create an observed property. Triggers update on change.
	 */
	@property()
	prop1 = 'd2l-note';

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
