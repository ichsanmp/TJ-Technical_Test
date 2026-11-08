import { Page, Locator, test, expect } from '@playwright/test';
import { ResizableLocators } from '../../selectors/demoqa/resizable.locator';

type BoxType = 'restricted' | 'unrestricted';

export class ResizablePage {
    readonly page: Page;
    readonly locators: ResizableLocators;

    constructor(page: Page) {
        this.page = page;
        this.locators = new ResizableLocators(page);
    }

    async navigate() {
        await test.step('Given Navigate to Resizable page', async () => {
            await this.page.goto('/resizable');
            await this.page.waitForLoadState('load');
        });
    }

    async verifyBoxVisible(boxType: BoxType) {
        await test.step(`Verify ${boxType} box is visible`, async () => {
            const box = boxType === 'restricted' ? this.locators.restrictedBox : this.locators.unrestrictedBox;
            const handle = boxType === 'restricted' ? this.locators.restrictedBoxHandle : this.locators.unrestrictedBoxHandle;

            await expect(box).toBeVisible();
            await expect(handle).toBeVisible();
        });
    }

    private async waitForStablePosition(locator: Locator, stableChecks = 4, intervalMs = 150) {
        let last = '';
        let count = 0;
        for (let i = 0; i < 40 && count < stableChecks; i++) {
            const b = await locator.boundingBox();
            const cur = b ? `${Math.round(b.x)},${Math.round(b.y)}` : 'null';
            count = cur === last ? count + 1 : 0;
            last = cur;
            await this.page.waitForTimeout(intervalMs);
        }
    }

    private async readSize(box: Locator) {
        return box.evaluate((el) => ({
            w: parseFloat((el as HTMLElement).style.width),
            h: parseFloat((el as HTMLElement).style.height),
        }));
    }

    async resizeBox(boxType: BoxType, targetWidth: number, targetHeight: number) {
        await test.step(`Resize ${boxType} box to ${targetWidth}x${targetHeight}`, async () => {
            const box = boxType === 'restricted' ? this.locators.restrictedBox : this.locators.unrestrictedBox;
            const handle = boxType === 'restricted' ? this.locators.restrictedBoxHandle : this.locators.unrestrictedBoxHandle;

            await box.evaluate((el) => el.scrollIntoView({ block: 'center' }));
            await this.waitForStablePosition(handle);

            const current = await this.readSize(box);
            const h = await handle.boundingBox();
            if (!h) throw new Error('Bounding box handle tidak ditemukan');

            const startX = h.x + h.width / 2;
            const startY = h.y + h.height / 2;
            const endX = startX + (targetWidth - current.w);
            const endY = startY + (targetHeight - current.h);

            await this.page.mouse.move(startX, startY);
            await this.page.mouse.down();
            try {
                await this.page.mouse.move(endX, endY, { steps: 25 });
            } finally {
                await this.page.mouse.up();
            }
        });
    }

    async verifyBoxSize(boxType: BoxType, expectedWidth: number, expectedHeight: number) {
        await test.step(`Verify ${boxType} box size is ${expectedWidth}x${expectedHeight}`, async () => {
            const box = boxType === 'restricted' ? this.locators.restrictedBox : this.locators.unrestrictedBox;

            await expect.poll(async () => {
                const s = await this.readSize(box);
                return { w: Math.round(s.w), h: Math.round(s.h) };
            }).toEqual({ w: expectedWidth, h: expectedHeight });
        });
    }
}