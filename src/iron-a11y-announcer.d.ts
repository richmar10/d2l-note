import { IronA11yAnnouncer } from '@polymer/iron-a11y-announcer/iron-a11y-announcer';

declare module '@polymer/iron-a11y-announcer/iron-a11y-announcer' {
	class IronA11yAnnouncer {
		static instance: IronA11yAnnouncer;
		static assertiveInstance: IronA11yAnnouncer;
		static requestAvailability: () => {}
	}
}
