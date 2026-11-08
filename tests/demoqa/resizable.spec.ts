import { test } from '@playwright/test';
import { ResizablePage } from '../../pages/demoqa/resizable.pages';

const target = { width: 400, height: 200 };

test.describe('Interactions - Resizable Module', () => {
    let resizablePage: ResizablePage;

    test.beforeEach(async ({ page }) => {
        resizablePage = new ResizablePage(page);
        await resizablePage.navigate();
    });

    for (const boxType of ['restricted', 'unrestricted'] as const) {
        test(`Should resize ${boxType} box to ${target.width}x${target.height}`, async () => {
            await test.step(`And the ${boxType} box is visible on the Resizable page`, async () => {
                await resizablePage.verifyBoxVisible(boxType);
            });

            await test.step(`When the ${boxType} box is resized`, async () => {
                await resizablePage.resizeBox(boxType, target.width, target.height);
            });

            await test.step(`Then the ${boxType} box size is ${target.width}x${target.height}`, async () => {
                await resizablePage.verifyBoxSize(boxType, target.width, target.height);
            });
        });
    }
});