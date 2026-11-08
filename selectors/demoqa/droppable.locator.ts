import { Page, Locator } from '@playwright/test';

export class DroppableLocators {
    readonly page: Page;

    readonly simpleTab: Locator;
    readonly draggableElement: Locator;
    readonly simpleDropBox: Locator;

    constructor(page: Page) {
        this.page = page;

        this.simpleTab = page.locator('#droppableExample-tab-simple');
        this.draggableElement = page.locator('#simpleDropContainer #draggable');
        this.simpleDropBox = page.locator('#simpleDropContainer #droppable');
    }
}