declare module 'd2l-intl' {
	export interface FormatOpts {
		locale?: object;
		timezone?: string;
	}

	export interface DateFormatOpts extends FormatOpts {
		format?: string;
	}

	export interface NumberFormatOpts extends FormatOpts {
		style?: 'decimal' | 'percent';
		minimumFractionDigits?: number;
		maximumFractionDigits?: number;
	}

	export class DateTimeFormat {
		constructor(lang?: string, opts?: DateFormatOpts);

		format(val: Date): string;
		formatDate(val: Date): string;
		formatTime(val: Date): string;
	}

	export class DateTimeParse {
		constructor(lang?: string, opts?: FormatOpts);

		parseDate(val: string): Date;
		parseTime(val: string): Date;
	}

	export class NumberFormat {
		constructor(lang?: string, opts?: NumberFormatOpts);

		format(value: number): string;
	}

	export class NumberParse {
		constructor(lang?: string, opts?: FormatOpts);

		parse(val: string): number;
	}

	export class FileSizeFormat {
		constructor(lang?: string, opts?: FormatOpts);

		format(fileSize: number): string;
	}

	type Months = [
		string,
		string,
		string,
		string,
		string,
		string,
		string,
		string,
		string,
		string,
		string,
		string
	];

	type Days = [
		string,
		string,
		string,
		string,
		string,
		string,
		string,
	];

	export interface PartialLocaleData {
		'date'?: {
			'hour24'?: boolean;
			'formats'?: {
				'dateFormats'?: {
					'full'?: string;
					'medium'?: string;
					'short'?: string;
					'monthYear'?: string;
					'monthDay'?: string;
				};
				'timeFormats'?: {
					'full'?: string;
					'medium'?: string;
					'short'?: string;
				};
			};
			'calendar'?: {
				'type'?: string;
				'firstDayOfWeek'?: number;
				'weekendStartDay'?: number;
				'weekendEndDay'?: number;
				'months'?: {
					'short'?: Months;
					'long'?: Months;
				},
				'days'?: {
					'narrow'?: Days;
					'short'?: Days;
					'long'?: Days;
				},
				'dayPeriods'?: {
					'am'?: string;
					'pm'?: string;
				}
			}
		};
		'number'?: {
			'patterns'?: {
				'decimal'?: {
					'positivePattern'?: string;
					'negativePattern'?: string;
				};
				'percent'?: {
					'positivePattern'?: string;
					'negativePattern'?: string;
				};
			};
			'symbols'?: {
				'decimal'?: string;
				'group'?: string;
				'negative'?: string;
				'percent'?: string;
			};
			'groupSize'?: number;
		};
		'fileSize'?: {
			'patterns'?: {
				'fileSizePattern'?: string;
			};
			'units'?: {
				'gigabyte'?: string;
				'megabyte'?: string;
				'kilobyte'?: string;
				'bytes'?: string;
				'byte'?: string;
			};
		};
	}

	export interface LocaleData {
		'date': {
			'hour24': boolean;
			'formats': {
				'dateFormats': {
					'full': string;
					'medium': string;
					'short': string;
					'monthYear': string;
					'monthDay': string;
				};
				'timeFormats': {
					'full': string;
					'medium': string;
					'short': string;
				};
			};
			'calendar': {
				'type': string;
				'firstDayOfWeek': number;
				'weekendStartDay': number;
				'weekendEndDay': number;
				'months': {
					'short': Months;
					'long': Months;
				},
				'days': {
					'narrow': Days;
					'short': Days;
					'long': Days;
				},
				'dayPeriods': {
					'am': string;
					'pm': string;
				}
			}
		};
		'number': {
			'patterns': {
				'decimal': {
					'positivePattern': string;
					'negativePattern': string;
				};
				'percent': {
					'positivePattern': string;
					'negativePattern': string;
				};
			};
			'symbols': {
				'decimal': string;
				'group': string;
				'negative': string;
				'percent': string;
			};
			'groupSize': number;
		};
		'fileSize': {
			'patterns': {
				'fileSizePattern': string;
			};
			'units': {
				'gigabyte': string;
				'megabyte': string;
				'kilobyte': string;
				'bytes': string;
				'byte': string;
			};
		};
	}

	export function LocaleProvider(locales: string[] | string, override: PartialLocaleData): LocaleData;
}
