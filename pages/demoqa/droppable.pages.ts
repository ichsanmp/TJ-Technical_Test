import { Page, Locator, test, expect } from '@playwright/test';
import { DroppableLocators } from '../../selectors/demoqa/droppable.locator';

export class DroppablePage {
    readonly page: Page;
    readonly locators: DroppableLocators;

    constructor(page: Page) {
        this.page = page;
        this.locators = new DroppableLocators(page);
    }

    async navigate() {
        await test.step('Given Navigate to Droppable page', async () => {
            await this.page.goto('/droppable');
            await this.page.waitForLoadState('load');
        });
    }

    async verifyOnDroppablePage() {
        await test.step('Verify current page is Droppable', async () => {
            await expect(this.page).toHaveURL(/.*droppable/);
        });
    }

    async verifySimpleTabActive() {
        await test.step('Ensure Simple tab is active', async () => {
            await expect(this.locators.simpleTab).toHaveClass(/active/);
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

    private async center(locator: Locator) {
        const b = await locator.boundingBox();
        if (!b) throw new Error('Bounding box tidak ditemukan');
        return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
    }

    async dragToSimpleDroppable() {
        await test.step('Drag element to simple droppable area', async () => {
            const source = this.locators.draggableElement;
            const target = this.locators.simpleDropBox;

            await source.scrollIntoViewIfNeeded();
            await this.waitForStablePosition(source);
            await this.waitForStablePosition(target);

            const start = await this.center(source);

            await this.page.mouse.move(start.x, start.y);
            await this.page.mouse.down();
            try {
                
                await this.page.mouse.move(start.x + 5, start.y + 5, { steps: 5 });
                await expect(source).toHaveClass(/ui-draggable-dragging/);

                
                const steps = 25;
                const current = { x: start.x + 5, y: start.y + 5 };
                for (let i = 1; i <= steps; i++) {
                    const tgt = await this.center(target);
                    const x = current.x + (tgt.x - current.x) * (i / steps);
                    const y = current.y + (tgt.y - current.y) * (i / steps);
                    await this.page.mouse.move(x, y);
                }

                const finalTarget = await this.center(target);
                await this.page.mouse.move(finalTarget.x, finalTarget.y);
                await expect(target).toHaveClass(/ui-droppable-hover/);
            } finally {
                
                await this.page.mouse.up();
            }
        });
    }

    async verifyDroppedInsideTarget() {
        await test.step('Verify draggable is positioned inside drop target', async () => {
            const s = await this.locators.draggableElement.boundingBox();
            const t = await this.locators.simpleDropBox.boundingBox();
            if (!s || !t) throw new Error('Bounding box tidak ditemukan');

            const cx = s.x + s.width / 2;
            const cy = s.y + s.height / 2;
            expect(cx).toBeGreaterThan(t.x);
            expect(cx).toBeLessThan(t.x + t.width);
            expect(cy).toBeGreaterThan(t.y);
            expect(cy).toBeLessThan(t.y + t.height);
        });
    }
}