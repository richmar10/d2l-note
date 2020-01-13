declare module "@brightspace-ui/intl/lib/dateTime.js" {
	export interface DateTime {
		month: number;
		date: number;
		year: number;
		hours: number;
		minutes: number;
		seconds: number;
	}

	export interface DateTimeDescriptor {
		hour24: string | false,
		formats: {
			dateFormats: {
				'full': string;
				'medium': string;
				'short': string;
				'monthYear': string;
				'monthDay': string;
				'longDayOfWeek': string;
				'shortDayOfWeek': string;
				'longMonth': string;
				'shortMonth': string;
			},
			timeFormats: {
				'full': string;
				'medium': string;
				'short': string;
			}
		},
		calendar: {
			firstDayOfWeek: string;
			weekendStartDay: string;
			weekendEndDay: string;
			months: {
				short: string;
				long: string;
			},
			days: {
				narrow: string;
				short: string;
				long: string;
			},
			dayPeriods: {am: string; pm: string;}
		}
	}

	export function convertUTCToLocalDateTime(date: DateTime): DateTime;
	export function convertLocalToUTCDateTime(date: DateTime): DateTime;
	export function getDateTimeDescriptor(): DateTimeDescriptor;
	export function formatTime(date: Date, options?: {
		timezone?: {
			name: string;
		};
		format?: string;
	}): string;
	export function parseTime(input: string, options?: {
		timezone?: {
			name: string;
		};
		format?: string;
	}): Date;
	export function formatDate(date: Date, options?: {
		timezone?: {
			name: string;
		};
		format?: string;
	}): string;
	export function parseDate(input: string): Date;
	export function formatDateTime(date: Date, options?: {
		timezone?: {
			name: string;
		};
		format?: string;
	}): string;
}
