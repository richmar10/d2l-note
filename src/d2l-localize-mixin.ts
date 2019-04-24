import {
	LitElement, property
} from 'lit-element';

import d2lIntl from 'd2l-intl';

function tryParseHtmlElemAttr(attr: string | null, defaultValue: object) {
	if (!attr) {
		return defaultValue;
	}
	try {
		return JSON.parse(attr) as object;
	} catch (e) {
		return defaultValue;
	}
}

type Constructor<T> = { new (...args: any[]): T };
export function localizeMixin<B extends Constructor<any>>(base: B) {
	class LocalizeMixin extends base {
		@property()
		__documentLanguage = window.document.getElementsByTagName('html')[0]
			.getAttribute('lang')

		@property()
		__documentLanguageFallback = window.document.getElementsByTagName('html')[0]
			.getAttribute('data-lang-default');

		@property()
		__overrides = tryParseHtmlElemAttr(window.document.getElementsByTagName('html')[0].getAttribute('data-intl-overrides'), {});

		@property()
		__timezoneObject = tryParseHtmlElemAttr(window.document.getElementsByTagName('html')[0].getAttribute('data-timezone'), {name: '', identifier: ''});

		_observer?: MutationObserver;

		connectedCallback() {
			const htmlElem = window.document.getElementsByTagName('html')[0];

			this._observer = new MutationObserver(((mutations) => {
				for (let i = 0; i < mutations.length; i++) {
					const mutation = mutations[i];
					if (mutation.attributeName === 'lang') {
						this.__documentLanguage = htmlElem.getAttribute('lang');
					} else if (mutation.attributeName === 'data-lang-default') {
						this.__documentLanguageFallback = htmlElem.getAttribute('data-lang-default');
					} else if (mutation.attributeName === 'data-intl-overrides') {
						this.__overrides = tryParseHtmlElemAttr(htmlElem.getAttribute('data-intl-overrides'), {});
					} else if (mutation.attributeName === 'data-timezone') {
						this.__timezoneObject = tryParseHtmlElemAttr(htmlElem.getAttribute('data-timezone'), {name: '', identifier: ''});
					}
				}
			}));
			this._observer.observe(htmlElem, { attributes: true });
		}

		disconnectedCallback() {
			if (this._observer && this._observer.disconnect) {
				this._observer.disconnect();
			}
		}
	}
	return LocalizeMixin;
}
