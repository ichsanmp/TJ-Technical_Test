import { Page, Locator } from '@playwright/test';

export class ResizableLocators {
    readonly page: Page;

    // Kotak dengan batas ukuran (min 150x150, max 500x300)
    readonly restrictedBox: Locator;
    readonly restrictedBoxHandle: Locator;

    // Kotak tanpa batas ukuran
    readonly unrestrictedBox: Locator;
    readonly unrestrictedBoxHandle: Locator;

    constructor(page: Page) {
        this.page = page;

        this.restrictedBox = page.locator('#resizableBoxWithRestriction');
        this.restrictedBoxHandle = this.restrictedBox.locator('.react-resizable-handle-se');

        this.unrestrictedBox = page.locator('#resizable');
        this.unrestrictedBoxHandle = this.unrestrictedBox.locator('.react-resizable-handle-se');
    }
}