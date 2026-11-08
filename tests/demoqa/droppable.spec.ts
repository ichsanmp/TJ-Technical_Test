import { test, expect } from '@playwright/test';
import { DroppablePage } from '../../pages/demoqa/droppable.pages';

export const droppableTestData = {
    expectedText: 'Dropped!',
    expectedClass: /ui-state-highlight/,
};

test.describe('Interactions - Droppable Module', () => {
    let droppablePage: DroppablePage;

    test.beforeEach(async ({ page }) => {
        droppablePage = new DroppablePage(page);
        await droppablePage.navigate();
    });

    test('Should successfully drag and drop the element in the simple tab and verify its position', async () => {
        await test.step('And the Droppable page is open on the Simple tab', async () => {
            await droppablePage.verifyOnDroppablePage();
            await droppablePage.verifySimpleTabActive();
        });

        await test.step('When the draggable element is dragged into the drop area', async () => {
            await droppablePage.dragToSimpleDroppable();
        });

        await test.step('Then the drop area shows the dropped state', async () => {
            const dropTarget = droppablePage.locators.simpleDropBox;
            await expect(dropTarget).toHaveText(droppableTestData.expectedText);
            await expect(dropTarget).toHaveClass(droppableTestData.expectedClass);
        });

        await test.step('And the element is positioned inside the drop area', async () => {
            await droppablePage.verifyDroppedInsideTarget();
        });
    });
});