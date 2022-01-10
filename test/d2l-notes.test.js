import '../src/d2l-notes';
import { expect, fixture, html } from '@open-wc/testing';
import { html as litHtml } from 'lit-element'; // prevent collision with @open-wc/testing html

function listenOnce(et, evt, handler) {
	const handle = (...args) => {
		et.removeEventListener(evt, handle);
		return handler(...args);
	};
	return et.addEventListener(evt, handle);
}

describe('d2l-notes', () => {
	it('instantiates with default properties', async() => {
		await fixture(html`<d2l-notes></d2l-notes>`);
	});

	it('shows "No Notes" when notes is empty', async() => {
		const el = await fixture(html`<d2l-notes></d2l-notes>`);
		el.notes = [];
		await el.updateComplete;

		const elementShadowRoot = el.shadowRoot;
		const elementNoteEmpty = elementShadowRoot.querySelector('.d2l-body-standard');
		expect(elementNoteEmpty.textContent.trim()).to.equal('No Notes');
	});

	it('shows emptystring when notes is empty', async() => {
		const el = await fixture(html`<d2l-notes></d2l-notes>`);
		el.notes = [];
		el.emptystring = 'HELLO MOTO';
		el.enternotestring = 'NOT ME';
		await el.updateComplete;

		const elementShadowRoot = el.shadowRoot;
		const elementNoteEmpty = elementShadowRoot.querySelector('.d2l-body-standard');
		expect(elementNoteEmpty.textContent.trim()).to.equal('HELLO MOTO');

	});

	it('shows enternotestring when notes is empty and no emptystring', async() => {
		const el = await fixture(html`<d2l-notes></d2l-notes>`);
		el.notes = [];
		el.enternotestring = 'MEEEE';
		await el.updateComplete;

		const elementShadowRoot = el.shadowRoot;
		const elementNoteEmpty = elementShadowRoot.querySelector('.d2l-body-standard');
		expect(elementNoteEmpty.textContent.trim()).to.equal('MEEEE');
	});

	it('shows enternotestring when notes is not empty and cancreate is true', async() => {
		const el = await fixture(html`<d2l-notes></d2l-notes>`);
		el.notes = [{
			user: {
				name:'Username',
				pic: {
					url: 'fixtures/user.png'
				}
			},
			createdAt: new Date().toISOString(),
			text: 'foozleberries',
			canEdit: true,
			canDelete: true,
			private: false
		}];
		el.cancreate = true;
		el.enternotestring = 'MEEEE';
		await el.updateComplete;

		const elementShadowRoot = el.shadowRoot;
		const elementEnterNoteLabel = elementShadowRoot.querySelector('.d2l-notes-enter-note-string');
		expect(elementEnterNoteLabel.textContent.trim()).to.equal('MEEEE');
	});

	it('does not shows enternotestring cancreate is false', async() => {
		const el = await fixture(html`<d2l-notes></d2l-notes>`);
		el.notes = [{
			user: {
				name:'Username',
				pic: {
					url: 'fixtures/user.png'
				}
			},
			createdAt: new Date().toISOString(),
			text: 'foozleberries',
			canEdit: true,
			canDelete: true,
			private: false
		}];
		el.cancreate = false;
		el.enternotestring = 'MEEEE';
		await el.updateComplete;

		const elementShadowRoot = el.shadowRoot;
		const elementEnterNoteLabel = elementShadowRoot.querySelector('.d2l-notes-enter-note-string');
		expect(elementEnterNoteLabel).to.be.null;
	});

	it('has d2l-note-edit if "cancreate" is true', async() => {
		const el = await fixture(html`<d2l-notes></d2l-notes>`);
		el.cancreate = true;
		await el.updateComplete;

		const elementShadowRoot = el.shadowRoot;
		const elementNoteEdit = elementShadowRoot.querySelector('d2l-note-edit');
		expect(elementNoteEdit).to.not.be.null;
		expect(elementNoteEdit.new).to.be.true;
	});

	it('passes description and settings slots to d2l-note-edit if "cancreate" is true', async() => {
		const el = await fixture(html`<d2l-notes></d2l-notes>`);
		el.cancreate = true;
		el.description = () => litHtml`<span>Description</span>`;
		el.settings = () => litHtml`<span>Settings</span>`;
		await el.updateComplete;

		const elementShadowRoot = el.shadowRoot;
		const elementNoteEdit = elementShadowRoot.querySelector('d2l-note-edit');
		await elementNoteEdit.updateComplete;
		expect(elementNoteEdit).to.not.be.null;
		expect(elementNoteEdit.new).to.be.true;

		const editShadowRoot = elementNoteEdit.shadowRoot;
		const descriptionSlot = editShadowRoot.querySelector('slot[name="description"]');
		const description = descriptionSlot.assignedNodes()[0];
		expect(description.textContent).to.equal('Description');
		const settingsSlot = editShadowRoot.querySelector('slot[name="settings"]');
		const settings = settingsSlot.assignedNodes()[0];
		expect(settings.textContent).to.equal('Settings');

	});

	it('does not have d2l-note-edit if "cancreate" is false', async() => {
		const el = await fixture(html`<d2l-notes></d2l-notes>`);
		el.cancreate = false;
		await el.updateComplete;

		const elementShadowRoot = el.shadowRoot;
		const elementNoteEdit = elementShadowRoot.querySelector('d2l-note-edit');
		expect(elementNoteEdit).to.be.null;
	});

	it('renders d2l-note for each item in "notes" property', async() => {
		const el = await fixture(html`<d2l-notes></d2l-notes>`);
		const createdAt = new Date().toISOString();
		el.notes = [{
			user: {
				name:'Username',
				pic: {
					url: 'fixtures/user.png'
				}
			},
			createdAt,
			text: 'foozleberries',
			canEdit: true,
			canDelete: true,
			private: false
		}];
		await el.updateComplete;
		const elementShadowRoot = el.shadowRoot;
		const elementNote = elementShadowRoot.querySelectorAll('d2l-note');
		expect(elementNote).to.have.lengthOf(1);
		expect(elementNote[0]).to.not.be.null;
	});

	it('shows load more button when there are more than 4 notes', async() => {
		const el = await fixture(html`<d2l-notes></d2l-notes>`);
		const createdAt = new Date().toISOString();
		const note = {
			user: {
				name:'Username',
				pic: {
					url: 'fixtures/user.png'
				}
			},
			createdAt,
			text: 'foozleberries',
			canEdit: true,
			canDelete: true,
			private: false
		};
		el.notes = [note, note, note, note, note];
		await el.updateComplete;

		expect(el.collapsed).to.be.true;
		const elementShadowRoot = el.shadowRoot;
		const elementMoreLess = elementShadowRoot.querySelector('.d2l-notes-load-more-less');
		expect(elementMoreLess).to.not.be.null;
		expect(elementMoreLess.text).to.equal('Load More Notes');
	});

	it('shows load more button when "hasmore" is true', async() => {
		const el = await fixture(html`<d2l-notes></d2l-notes>`);
		el.notes = [];
		el.hasmore = true;
		await el.updateComplete;

		expect(el.collapsed).to.be.true;
		const elementShadowRoot = el.shadowRoot;
		const elementMoreLess = elementShadowRoot.querySelector('.d2l-notes-load-more-less');
		expect(elementMoreLess).to.not.be.null;
		expect(elementMoreLess.text).to.equal('Load More Notes');
	});

	it('shows load less button when there are more than 4 notes and collapsed is set false', async() => {
		const el = await fixture(html`<d2l-notes></d2l-notes>`);
		const createdAt = new Date().toISOString();
		const note = {
			user: {
				name:'Username',
				pic: {
					url: 'fixtures/user.png'
				}
			},
			createdAt,
			text: 'foozleberries',
			canEdit: true,
			canDelete: true,
			private: false
		};
		el.notes = [note, note, note, note, note];
		await el.updateComplete;
		expect(el.collapsed).to.be.true;

		el.collapsed = false;
		await el.updateComplete;

		const elementShadowRoot = el.shadowRoot;
		const elementMoreLess = elementShadowRoot.querySelector('.d2l-notes-load-more-less');
		expect(elementMoreLess).to.not.be.null;
		expect(elementMoreLess.text).to.equal('Load Less Notes');
	});

	it('dispatches d2l-notes-load-more when "collapsed" and load more/less button is tapped', async() => {
		const el = await fixture(html`<d2l-notes></d2l-notes>`);
		const createdAt = new Date().toISOString();
		const note = {
			user: {
				name:'Username',
				pic: {
					url: 'fixtures/user.png'
				}
			},
			createdAt,
			text: 'foozleberries',
			canEdit: true,
			canDelete: true,
			private: false
		};
		el.notes = [note, note, note, note, note];
		await el.updateComplete;

		expect(el.collapsed).to.be.true;
		const elementShadowRoot = el.shadowRoot;
		const elementMoreLess = elementShadowRoot.querySelector('.d2l-notes-load-more-less');
		const loadMorePromise = new Promise((resolve) => listenOnce(el, 'd2l-notes-load-more', resolve));
		elementMoreLess.click();

		await el.updateComplete;
		expect(el.collapsed).to.be.false;
		await loadMorePromise;
	});

	it('dispatches d2l-notes-load-less when not "collapsed" and load more/less button is tapped', async() => {
		const el = await fixture(html`<d2l-notes></d2l-notes>`);
		const createdAt = new Date().toISOString();
		const note = {
			user: {
				name:'Username',
				pic: {
					url: 'fixtures/user.png'
				}
			},
			createdAt,
			text: 'foozleberries',
			canEdit: true,
			canDelete: true,
			private: false
		};
		await el.updateComplete;
		el.notes = [note, note, note, note, note];
		await el.updateComplete;
		expect(el.collapsed).to.be.true;
		el.collapsed = false;
		await el.updateComplete;
		const elementShadowRoot = el.shadowRoot;
		const elementMoreLess = elementShadowRoot.querySelector('.d2l-notes-load-more-less');
		const loadMorePromise = new Promise((resolve) => listenOnce(el, 'd2l-notes-load-less', resolve));
		await el.updateComplete;
		elementMoreLess.click();

		await el.updateComplete;
		expect(el.collapsed).to.be.true;
		await loadMorePromise;
	});
});
