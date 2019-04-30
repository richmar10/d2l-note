import 'd2l-typography/d2l-typography';
import { DomModule } from '@polymer/polymer/lib/elements/dom-module.js';

const d2lTypographyTemplate = DomModule.import('d2l-typography', 'template') as HTMLTemplateElement;
const d2lTypographyContents = d2lTypographyTemplate && d2lTypographyTemplate.content.childNodes;
const d2lTypographyContent = Array.prototype.filter.call(d2lTypographyContents, (node: ChildNode) => node.nodeType === node.ELEMENT_NODE)[0];
const d2lTypographyStyle = d2lTypographyContent && d2lTypographyContent.textContent || '';

type Constructor<T> = new(...args: any[]) => T;

export function D2LTypographyMixin<B extends Constructor<any>>(superClass: B) {
	class D2LTypographyMixinClass extends superClass {
		static d2lTypographyStyle = d2lTypographyStyle;
	}

	return D2LTypographyMixinClass;
}
