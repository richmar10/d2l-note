import { DocumentLocaleSettings, getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common';
import {
	LitElement, property, PropertyValues
} from 'lit-element';
import IntlMessageFormat from 'intl-messageformat/src/main';

window.IntlMessageFormat = IntlMessageFormat;

declare global {
	interface Window {
		IntlMessageFormat: typeof IntlMessageFormat;
	}
}

type Constructor<T> = new(...args: any[]) => T;

type LocalizeMixinProto = Function & {
	getLocalizeResources?: (possibleLanguages: string[]) => Promise<{ language: string; resources: Resources }>;
}

interface GetLocalizeResourcesDefined {
	constructor: Function & {
		getLocalizeResources: (possibleLanguages: string[]) => Promise<{ language: string; resources: Resources }>;
	};
}

interface Resources { [key: string]: string }

export declare class LocalizeMixinInstance {
	localize(key: string, inParams?: { [key: string]: string }): string;
	localize(key: string, ...args: string[]): string;
	_generatePossibleLanguages(): string[];
	_hasResources(): boolean;
	_languageChange(): void;
}

export function LocalizeMixin<B extends Constructor<LitElement>>(superClass: B): {
	new(...args: any[]): LocalizeMixinInstance;
} & B {
	class LocalizeMixinClass extends superClass {
		private __documentLocaleSettings: DocumentLocaleSettings;
		private __languageChangeCallback: () => void;
		private __updatedProperties: PropertyValues;

		@property({ type: String, attribute: false })
		private __language?: string;
		@property({ type: Object, attribute: false })
		private __resources?: Resources;

		constructor(...args: any[]) {
			super(...args);

			this.__documentLocaleSettings = getDocumentLocaleSettings();
			let first = true;
			this.__languageChangeCallback = () => {

				if (!this._hasResources()) return;
				const possibleLanguages = this._generatePossibleLanguages();
				this.constructor.getLocalizeResources(possibleLanguages)
					.then((res) => {
						if (!res) {
							return;
						}
						this.__language = res.language;
						this.__resources = res.resources;
						if (first) {
							first = false;
						} else {
							this._languageChange();
						}
					});

			};
			this.__updatedProperties = new Map();

		}

		connectedCallback() {
			super.connectedCallback();
			this.__documentLocaleSettings.addChangeListener(this.__languageChangeCallback);
			this.__languageChangeCallback();
		}

		disconnectedCallback() {
			super.disconnectedCallback();
			this.__documentLocaleSettings.removeChangeListener(this.__languageChangeCallback);
			this.__updatedProperties.clear();
		}

		protected shouldUpdate(changedProperties: PropertyValues) {

			const hasResources = this._hasResources();
			if (!hasResources) {
				return super.shouldUpdate(changedProperties);
			}

			const ready = (this.__language !== undefined && this.__resources !== undefined);
			if (!ready) {
				changedProperties.forEach((oldValue, propName) => {
					this.__updatedProperties.set(propName, oldValue);
				});
				return false;
			}

			this.__updatedProperties.forEach((oldValue, propName) => {
				if (!changedProperties.has(propName)) {
					changedProperties.set(propName, oldValue);
				}
			});
			this.__updatedProperties.clear();

			return super.shouldUpdate(changedProperties);

		}

		localize(key: string, inParams?: { [key: string]: string }): string;
		localize(key: string, ...args: string[]): string;
		localize(key: string, ...args: any[]) {

			if (!key || !this.__resources || !this.__language) {
				return '';
			}

			const translatedValue = this.__resources[key];
			if (!translatedValue) {
				return '';
			}

			let params: { [key: string]: string } = {};

			if (arguments.length > 1 && typeof args[0] === 'object') {
				// support for key-value replacements as a single arg
				params = args[0];
			} else {
				// legacy support for localize-behavior replacements as many args
				for (let i = 0; i < args.length; i += 2) {
					params[arguments[i]] = arguments[i + 1];
				}
			}

			const translatedMessage = new IntlMessageFormat(translatedValue, this.__language);
			return translatedMessage.format(params);

		}

		_generatePossibleLanguages() {
			const langs = [];

			let docLang = this.__documentLocaleSettings.language;
			if (docLang) {
				docLang = docLang.toLowerCase();
				langs.push(docLang);

				if (docLang.indexOf('-') !== -1) {
					const baseDocLang = docLang.split('-')[0];
					langs.push(baseDocLang);
				}
			}

			let docFallbackLang = this.__documentLocaleSettings.fallbackLanguage;
			if (docFallbackLang) {
				docFallbackLang = docFallbackLang.toLowerCase();
				langs.push(docFallbackLang);

				if (docFallbackLang.indexOf('-') !== -1) {
					const baseDocFallbackLang = docFallbackLang.split('-')[0];
					langs.push(baseDocFallbackLang);
				}
			}

			langs.push('en-us', 'en');

			return langs;
		}

		_hasResources(): this is GetLocalizeResourcesDefined {
			return (this.constructor as LocalizeMixinProto)['getLocalizeResources'] !== undefined;
		}

		_languageChange() {
			this.dispatchEvent(new CustomEvent(
				'd2l-localize-behavior-language-changed', { bubbles: true, composed: true }
			));
		}

	}
	return LocalizeMixinClass;
}
