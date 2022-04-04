import '../src/d2l-note-edit.js';
import { expect, fixture, html } from '@open-wc/testing';

function listenOnce(et, evt, handler) {
	const handle = (...args) => {
		et.removeEventListener(evt, handle);
		return handler(...args);
	};
	et.addEventListener(evt, handle);
}

const basicTestFixture = html`<d2l-note-edit></d2l-note-edit>`;

const descriptionTestFixture = html`
	<d2l-note-edit>
		<p slot="description">
			Description
		</p>
	</d2l-note-edit>`;

const settingsTestFixture = html`
	<d2l-note-edit>
		<div slot="settings">
			Settings
		</div>
	</d2l-note-edit>`;

describe('d2l-note-edit', () => {
	it('instantiates with default properties', async() => {
		const el = await fixture(basicTestFixture);
		await el.updateComplete;
	});

	it('has description slot', async() => {
		const el = await fixture(descriptionTestFixture);
		await el.updateComplete;

		const elementShadowRoot = el.shadowRoot;
		const elementDescriptionSlot = elementShadowRoot.querySelector('slot[name="description"]');
		const elementDescription = elementDescriptionSlot.assignedNodes()[0];
		expect(elementDescription.textContent.trim()).to.equal('Description');
	});

	it('has settings slot', async() => {
		const el = await fixture(settingsTestFixture);
		await el.updateComplete;
		const elementShadowRoot = el.shadowRoot;
		const elementSettingsSlot = elementShadowRoot.querySelector('slot[name="settings"]');
		const elementSettings = elementSettingsSlot.assignedNodes()[0];
		expect(elementSettings.textContent.trim()).to.equal('Settings');
	});

	it('has edit field set by "value" property', async() => {
		const el = await fixture(basicTestFixture);
		await el.updateComplete;
		el.value = 'foozleberries';
		await el.updateComplete;

		const elementShadowRoot = el.shadowRoot;
		const elementInputText = elementShadowRoot.querySelector('textarea.d2l-input');
		expect(elementInputText.value).to.equal('foozleberries');
	});

	it('has add button when [new]', async() => {
		const el = await fixture(basicTestFixture);
		el.new = true;
		await el.updateComplete;

		const elementShadowRoot = el.shadowRoot;
		const elementButton = elementShadowRoot.querySelector('.d2l-note-edit-button');

		expect(elementButton.textContent.trim()).to.equal('Add');
		expect(elementButton.primary).to.be.true;
	});

	it('has edit button when :not([new])', async() => {
		const el = await fixture(basicTestFixture);
		el.new = false;
		await el.updateComplete;

		const elementShadowRoot = el.shadowRoot;
		const elementButton = elementShadowRoot.querySelector('.d2l-note-edit-button');
		expect(elementButton.textContent.trim()).to.equal('Save');
		expect(elementButton.primary).to.be.true;
	});

	it('has discard button', async() => {
		const el = await fixture(basicTestFixture);
		await el.updateComplete;

		const elementShadowRoot = el.shadowRoot;
		const elementButton = elementShadowRoot.querySelector('.d2l-note-edit-discard-button');
		expect(elementButton.textContent.trim()).to.equal('Cancel');
	});

	it('dispatches d2l-note-edit-add when "Add" is tapped', async() => {
		const el = await fixture(basicTestFixture);
		const addPromise = new Promise((resolve) => listenOnce(el, 'd2l-note-edit-add', resolve));
		el.new = true;
		await el.updateComplete;
		const elementShadowRoot = el.shadowRoot;
		const elementButton = elementShadowRoot.querySelector('.d2l-note-edit-button');
		elementButton.click();

		await addPromise;
	});

	it('dispatches d2l-note-edit-finished when "Add" is tapped', async() => {
		const el = await fixture(basicTestFixture);
		const addPromise = new Promise((resolve) => listenOnce(el, 'd2l-note-edit-finished', resolve));
		el.new = true;
		await el.updateComplete;
		const elementShadowRoot = el.shadowRoot;
		const elementButton = elementShadowRoot.querySelector('.d2l-note-edit-button');
		elementButton.click();

		await addPromise;
	});

	it('does not dispatch d2l-note-edit-finished when "Add" is tapped and d2l-note-edit-add is prevent defaulted', async() => {
		const el = await fixture(basicTestFixture);
		let finishedDispatched = false;
		listenOnce(el, 'd2l-note-edit-add', e => e.preventDefault());
		listenOnce(el, 'd2l-note-edit-finished', () => finishedDispatched = true);
		el.new = true;
		await el.updateComplete;
		const elementShadowRoot = el.shadowRoot;
		const elementButton = elementShadowRoot.querySelector('.d2l-note-edit-button');
		elementButton.click();

		await new Promise((resolve) => setTimeout(resolve, 1));

		await expect(finishedDispatched).to.be.false;
	});

	it('dispatches d2l-note-edit-finished when "Add" is tapped and d2l-note-edit-add is prevent defaulted and e.detail.finish is called', async() => {
		const el = await fixture(basicTestFixture);
		listenOnce(el, 'd2l-note-edit-add', e => {
			e.preventDefault();
			e.detail.finish();
		});
		const addPromise = new Promise((resolve) => listenOnce(el, 'd2l-note-edit-finished', resolve));
		el.new = true;
		await el.updateComplete;
		const elementShadowRoot = el.shadowRoot;
		const elementButton = elementShadowRoot.querySelector('.d2l-note-edit-button');
		elementButton.click();

		await addPromise;
	});

	it('shows d2l-alert component when "Add" is tapped and d2l-note-edit-add is prevent defaulted and e.detail.finish is called with an error', async() => {
		const el = await fixture(basicTestFixture);
		const savePromise = new Promise(resolve => listenOnce(el, 'd2l-note-edit-add', e => {
			e.preventDefault();
			e.detail.finish(new Error('This is some error'));
			resolve();
		}));
		el.new = true;
		await el.updateComplete;
		const elementShadowRoot = el.shadowRoot;
		const elementButton = elementShadowRoot.querySelector('.d2l-note-edit-button');
		elementButton.click();

		await savePromise;
		const alert = elementShadowRoot.querySelector('d2l-alert');
		expect(alert.hidden).to.be.false;
	});

	it('dispatches d2l-note-edit-save when "Save" is tapped', async() => {
		const el = await fixture(basicTestFixture);
		const editPromise = new Promise((resolve) => listenOnce(el, 'd2l-note-edit-save', resolve));
		el.new = false;
		await el.updateComplete;
		const elementShadowRoot = el.shadowRoot;
		const elementButton = elementShadowRoot.querySelector('.d2l-note-edit-button');
		elementButton.click();

		await editPromise;
	});

	it('dispatches d2l-note-edit-finish when "Save" is tapped', async() => {
		const el = await fixture(basicTestFixture);
		const editPromise = new Promise((resolve) => listenOnce(el, 'd2l-note-edit-finished', resolve));
		el.new = false;
		await el.updateComplete;
		const elementShadowRoot = el.shadowRoot;
		const elementButton = elementShadowRoot.querySelector('.d2l-note-edit-button');
		elementButton.click();

		await editPromise;
	});

	it('does not dispatch d2l-note-edit-finished when "Save" is tapped and d2l-note-edit-save is prevent defaulted', async() => {
		const el = await fixture(basicTestFixture);
		let finishedDispatched = false;
		listenOnce(el, 'd2l-note-edit-save', e => e.preventDefault());
		listenOnce(el, 'd2l-note-edit-finished', () => finishedDispatched = true);
		el.new = false;
		await el.updateComplete;
		const elementShadowRoot = el.shadowRoot;
		const elementButton = elementShadowRoot.querySelector('.d2l-note-edit-button');
		elementButton.click();

		await new Promise((resolve) => setTimeout(resolve, 1));
		expect(finishedDispatched).to.be.false;
	});

	it('dispatches d2l-note-edit-finished when "Save" is tapped and d2l-note-edit-save is prevent defaulted and e.detail.finish is called', async() => {
		const el = await fixture(basicTestFixture);
		listenOnce(el, 'd2l-note-edit-save', e => {
			e.preventDefault();
			e.detail.finish();
		});
		const editPromise = new Promise((resolve) => listenOnce(el, 'd2l-note-edit-finished', resolve));
		el.new = false;
		await el.updateComplete;
		const elementShadowRoot = el.shadowRoot;
		const elementButton = elementShadowRoot.querySelector('.d2l-note-edit-button');
		elementButton.click();

		await editPromise;
	});

	it('dispatches d2l-note-edit-discard when "discard" is tapped', async() => {
		const el = await fixture(basicTestFixture);
		const discardPromise = new Promise((resolve) => listenOnce(el, 'd2l-note-edit-discard', resolve));
		await el.updateComplete;
		const elementShadowRoot = el.shadowRoot;
		const elementButton = elementShadowRoot.querySelector('.d2l-note-edit-discard-button');
		elementButton.click();

		await discardPromise;
	});

	it('shows d2l-alert component when "errormessage" is set', async() => {
		const el = await fixture(basicTestFixture);
		el.errorMessage = 'Error';
		await el.updateComplete;
		const elementShadowRoot = el.shadowRoot;
		const alert = elementShadowRoot.querySelector('d2l-alert');
		expect(alert.hidden).to.be.false;
	});

	it('shows d2l-alert component when "Save" is tapped and d2l-note-edit-save is prevent defaulted and e.detail.finish is called with an error', async() => {
		const el = await fixture(basicTestFixture);
		const savePromise = new Promise(resolve => listenOnce(el, 'd2l-note-edit-save', e => {
			e.preventDefault();
			e.detail.finish(new Error('This is some error'));
			resolve();
		}));
		el.new = false;
		await el.updateComplete;
		const elementShadowRoot = el.shadowRoot;
		const elementButton = elementShadowRoot.querySelector('.d2l-note-edit-button');
		elementButton.click();

		await savePromise;
		const alert = elementShadowRoot.querySelector('d2l-alert');
		expect(alert.hidden).to.be.false;
	});

});
