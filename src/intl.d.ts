declare module "@brightspace-ui/intl/lib/common" {
	export class DocumentLocaleSettings {
		language: string;
		fallbackLanguage: string;

		constructor();
		addChangeListener(cb: () => void): void;
		removeChangeListener(cb: () => void): void;
		reset(): void;
		sync(): void;

		protected _handleObserverChange(mutations: MutationCallback): void;
		protected _normalize(langTag: string): string;
		protected _tryParseHtmlElemAttr<T extends {}>(attrName: string, defaultValue: T): T;
	}
	export function getDocumentLocaleSettings(): DocumentLocaleSettings;
}
