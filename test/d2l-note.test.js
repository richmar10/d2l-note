import '../src/d2l-note.js';
import { expect, fixture, html } from '@open-wc/testing';

import { formatDateTime } from '@brightspace-ui/intl/lib/dateTime.js';

function listenOnce(et, evt, handler) {
	const handle = (...args) => {
		et.removeEventListener(evt, handle);
		return handler(...args);
	};
	et.addEventListener(evt, handle);
}

describe('d2l-note', () => {
	it('instantiates with default properties', async() => {
		await fixture(html`<d2l-note></d2l-note>`);
	});

	it('shows skeleton', async() => {
		const el = await fixture(html`<d2l-note></d2l-note>`);
		await el.updateComplete;

		const elementShadowRoot = el.shadowRoot;
		const elementUser = elementShadowRoot.querySelector('d2l-user');
		const elementUserSkeleton = elementShadowRoot.querySelector('.d2l-note-user-skeleton');

		expect(elementUser).to.be.null;
		expect(elementUserSkeleton).to.not.be.null;

		const elementText = elementShadowRoot.querySelector('.d2l-note-text');
		const elementTextSkeleton = elementShadowRoot.querySelector('.d2l-note-text-skeleton');

		expect(elementText).to.be.null;
		expect(elementTextSkeleton).to.not.be.null;
	});

	it('has profile image from "user" property', async() => {
		const el = await fixture(html`<d2l-note></d2l-note>`);
		el.user = {
			pic: {
				url: 'fixtures/user.png'
			}
		};
		el.showAvatar = true;
		await el.updateComplete;

		const elementShadowRoot = el.shadowRoot;
		const elementUser = elementShadowRoot.querySelector('d2l-user');
		const elementUserSkeleton = elementShadowRoot.querySelector('.d2l-note-user-skeleton');

		expect(elementUser.imageUrl).to.equal('fixtures/user.png');
		expect(elementUserSkeleton).to.be.null;
	});

	it('has profile image from "user" property using "token"', async() => {
		const el = await fixture(html`<d2l-note></d2l-note>`);

		el.token = 'foozleberries';
		el.user = {
			pic: {
				url: 'fixtures/user.png',
				requireTokenAuth: true
			}
		};
		el.showAvatar = true;
		await el.updateComplete;

		const elementShadowRoot = el.shadowRoot;
		const elementUser = elementShadowRoot.querySelector('d2l-user');

		expect(elementUser.imageUrl).to.equal('fixtures/user.png');
		expect(elementUser.token).to.equal('foozleberries');
	});

	it('doesn\'t render profile image when "show-avatar" is false', async() => {
		const el = await fixture(html`<d2l-note></d2l-note>`);
		el.user = {
			pic: {
				url: 'fixtures/user.png'
			}
		};
		el.showAvatar = false;
		await el.updateComplete;

		const elementShadowRoot = el.shadowRoot;
		const elementUser = elementShadowRoot.querySelector('d2l-user');
		expect(elementUser.imageUrl).to.not.equal('fixtures/user.png');
	});

	it('has user name supplied by "user" property', async() => {
		const el = await fixture(html`<d2l-note></d2l-note>`);
		el.user = {
			name: 'Username'
		};
		el.showAvatar = true;
		await el.updateComplete;

		const elementShadowRoot = el.shadowRoot;
		const elementUser = elementShadowRoot.querySelector('d2l-user');
		expect(elementUser.firstName).to.equal('Username');
		expect(elementUser.lastName).to.be.empty;

		const elementName = elementUser.shadowRoot.querySelector('.name');
		expect(elementName.innerText).to.equal('Username');
	});

	it('correctly splits name into "firstName" and "lastName"', async() => {
		const el = await fixture(html`<d2l-note></d2l-note>`);
		el.user = {
			name: 'First Last'
		};
		el.showAvatar = true;
		await el.updateComplete;

		const elementShadowRoot = el.shadowRoot;
		const elementUser = elementShadowRoot.querySelector('d2l-user');
		expect(elementUser.firstName).to.equal('First');
		expect(elementUser.lastName).to.equal('Last');
		expect(elementUser.displayName).to.be.empty;

		const elementName = elementUser.shadowRoot.querySelector('.name');
		expect(elementName.innerText).to.equal('First Last');
	});

	it('renders "Me" instead of user name when "me" is true', async() => {
		const el = await fixture(html`<d2l-note></d2l-note>`);
		el.user = {
			name: 'First Last'
		};
		el.showAvatar = true;
		el.me = true;
		await el.updateComplete;

		const elementShadowRoot = el.shadowRoot;
		const elementUser = elementShadowRoot.querySelector('d2l-user');
		expect(elementUser.firstName).to.equal('First');
		expect(elementUser.lastName).to.equal('Last');
		expect(elementUser.displayName).to.equal('Me');

		const elementName = elementUser.shadowRoot.querySelector('.name');
		expect(elementName.innerText).to.equal('Me');
	});

	it('correctly localizes "created-at" date', async() => {
		const el = await fixture(html`<d2l-note></d2l-note>`);
		const date = new Date();
		el.user = {
			name: 'Username'
		};
		el.createdAt = date.toISOString();
		await el.updateComplete;

		const elementShadowRoot = el.shadowRoot;
		const elementUser = elementShadowRoot.querySelector('d2l-user');
		expect(elementUser.subText).to.equal(formatDateTime(date, { format: 'medium' }));
	});

	it('has note text supplied by "text" property', async() => {
		const el = await fixture(html`<d2l-note></d2l-note>`);
		el.text = 'foozleberries';
		await el.updateComplete;

		const elementShadowRoot = el.shadowRoot;
		const elementText = elementShadowRoot.querySelector('.d2l-note-text');
		const elementTextSkeleton = elementShadowRoot.querySelector('.d2l-note-text-skeleton');
		expect(elementText.textContent).to.equal('foozleberries');
		expect(elementTextSkeleton).to.be.null;
	});

	it('has no privacy indicator if "private" is false', async() => {
		const el = await fixture(html`<d2l-note></d2l-note>`);
		el.private = false;
		await el.updateComplete;

		const elementShadowRoot = el.shadowRoot;
		const elementPrivateIndicator = elementShadowRoot.querySelector('.d2l-note-private-indicator');
		expect(elementPrivateIndicator).to.be.null;
	});

	it('has privacy indicator supplied by "private" property', async() => {
		const el = await fixture(html`<d2l-note></d2l-note>`);
		el.private = true;
		await el.updateComplete;

		const elementShadowRoot = el.shadowRoot;
		const elementPrivateIndicator = elementShadowRoot.querySelector('.d2l-note-private-indicator');
		expect(elementPrivateIndicator).to.not.be.null;
	});

	describe('context menu', () => {
		it('has context menu if "can-edit" is true', async() => {
			const el = await fixture(html`<d2l-note></d2l-note>`);
			el.canEdit = true;
			await el.updateComplete;

			const elementShadowRoot = el.shadowRoot;
			const elementDropdown = elementShadowRoot.querySelector('d2l-dropdown-more');
			expect(elementDropdown).to.not.be.null;
		});

		it('has context menu if "can-delete" is true', async() => {
			const el = await fixture(html`<d2l-note></d2l-note>`);
			el.canDelete = true;
			await el.updateComplete;

			const elementShadowRoot = el.shadowRoot;
			const elementDropdown = elementShadowRoot.querySelector('d2l-dropdown-more');
			expect(elementDropdown).to.not.be.null;
		});

		it('does not have context menu if "can-edit"/"can-delete" are not true', async() => {
			const el = await fixture(html`<d2l-note></d2l-note>`);
			el.canEdit = false;
			el.canDelete = false;
			await el.updateComplete;

			const elementShadowRoot = el.shadowRoot;
			const elementDropdown = elementShadowRoot.querySelector('d2l-dropdown-more');
			expect(elementDropdown).to.be.null;
		});

		it('has edit action if "can-edit" is true', async() => {
			const el = await fixture(html`<d2l-note></d2l-note>`);
			el.canEdit = true;
			await el.updateComplete;

			const elementShadowRoot = el.shadowRoot;
			const elementMenuItems = elementShadowRoot.querySelectorAll('d2l-menu-item');

			expect([].some.call(elementMenuItems, item => item.text.indexOf('Edit') !== -1)).to.be.true;
		});

		it('does not have edit action if "can-edit" is not true', async() => {
			const el = await fixture(html`<d2l-note></d2l-note>`);
			el.canEdit = false;
			await el.updateComplete;

			const elementShadowRoot = el.shadowRoot;
			const elementMenuItems = elementShadowRoot.querySelectorAll('d2l-menu-item');
			expect([].some.call(elementMenuItems, item => item.text.indexOf('Edit') !== -1)).to.be.false;
		});

		it('has delete action if "can-delete" is true', async() => {
			const el = await fixture(html`<d2l-note></d2l-note>`);
			el.canDelete = true;
			await el.updateComplete;

			const elementShadowRoot = el.shadowRoot;
			const elementMenuItems = elementShadowRoot.querySelectorAll('d2l-menu-item');
			expect([].some.call(elementMenuItems, item => item.text.indexOf('Delete') !== -1)).to.be.true;
		});

		it('does not have delete action if "can-delete" is not true', async() => {
			const el = await fixture(html`<d2l-note></d2l-note>`);
			el.canDelete = false;
			await el.updateComplete;

			const elementShadowRoot = el.shadowRoot;
			const elementMenuItems = elementShadowRoot.querySelectorAll('d2l-menu-item');
			expect([].some.call(elementMenuItems, item => item.text.indexOf('Delete') !== -1)).to.be.false;
		});

		describe('edit', () => {
			it('shows d2l-note-edit when edit button is tapped', async() => {
				const el = await fixture(html`<d2l-note></d2l-note>`);
				el.canEdit = true;
				await el.updateComplete;

				const elementShadowRoot = el.shadowRoot;
				const hiddenElementNoteEdit = elementShadowRoot.querySelector('d2l-note-edit');
				expect(hiddenElementNoteEdit).to.be.null;

				const elementDropdown = elementShadowRoot.querySelector('d2l-dropdown-more');
				const elementMenu = elementShadowRoot.querySelector('d2l-dropdown-menu');
				const elementMenuItems = elementShadowRoot.querySelectorAll('d2l-menu-item');

				const openPromise = new Promise((resolve) => listenOnce(elementDropdown, 'd2l-dropdown-open', resolve));
				elementMenu.setAttribute('opened', true);
				await openPromise;

				// Wait for menu to become visible
				await new Promise((resolve) => setTimeout(resolve, 100));
				const editItem = [].filter.call(elementMenuItems, item => item.text.indexOf('Edit') !== -1)[0];
				editItem.click();

				await el.updateComplete;

				expect(el.editing).to.be.true;
				const elementNoteEdit = elementShadowRoot.querySelector('d2l-note-edit');
				expect(elementNoteEdit).to.not.be.null;
			});

		});

		describe('delete', () => {
			it('fires "d2l-note-delete" when delete button is tapped', async() => {
				const el = await fixture(html`<d2l-note></d2l-note>`);
				el.canDelete = true;
				await el.updateComplete;
				const elementShadowRoot = el.shadowRoot;
				const elementDropdown = elementShadowRoot.querySelector('d2l-dropdown-more');
				const elementMenu = elementShadowRoot.querySelector('d2l-dropdown-menu');
				const elementMenuItems = elementShadowRoot.querySelectorAll('d2l-menu-item');

				const openPromise = new Promise((resolve) => listenOnce(elementDropdown, 'd2l-dropdown-open', resolve));
				elementMenu.setAttribute('opened', true);
				await openPromise;

				// Wait for menu to become visible
				await new Promise((resolve) => setTimeout(resolve, 100));
				const deleteItem = [].filter.call(elementMenuItems, item => item.text.indexOf('Delete') !== -1)[0];

				const deletePromise = new Promise((resolve) => listenOnce(el, 'd2l-note-delete', resolve));
				deleteItem.click();

				await el.updateComplete;
				await deletePromise;
			});
		});
	});
});

