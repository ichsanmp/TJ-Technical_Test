import { test, expect } from '@playwright/test';
import testData from '../../data/demoqa_webtables/webtables-data.json';
import { WebTablesPage } from '../../pages/demoqa/webtables.pages';

test.describe('Web Tables - Data Driven Testing', () => {
    let webTablesPage: WebTablesPage;

    test.beforeEach(async ({ page }) => {
        webTablesPage = new WebTablesPage(page);
        await webTablesPage.navigate();
    });

    test('Should successfully add multiple users and verify their presence in the table', async () => {
        test.slow();

        await test.step(`And ${testData.length} users prepared from the JSON dataset`, async () => {
            expect(testData.length).toBeGreaterThan(0);
        });

        await test.step('When all users are added through the registration form', async () => {
            for (const user of testData) {
                await webTablesPage.addNewRecord(user);
            }
        });

        await test.step('Then every user is displayed with complete and correct data', async () => {
            const goToFirstPage = async () => {
                while (await webTablesPage.locators.previousButton.isEnabled()) {
                    await webTablesPage.locators.previousButton.click();
                }
            };

            await goToFirstPage();

            for (const user of testData) {
                await test.step(`Verify full record: ${user.firstName} ${user.lastName} (${user.email})`, async () => {
                    const row = await webTablesPage.findRecordWithPagination(user);
                    const cells = row.getByRole('cell');

                    await expect(row, `Record not found in table for ${user.email}`).toBeVisible();

                    await expect.soft(cells.nth(0), 'First Name').toHaveText(user.firstName);
                    await expect.soft(cells.nth(1), 'Last Name').toHaveText(user.lastName);
                    await expect.soft(cells.nth(2), 'Age').toHaveText(user.age);
                    await expect.soft(cells.nth(3), 'Email').toHaveText(user.email);
                    await expect.soft(cells.nth(4), 'Salary').toHaveText(user.salary);
                    await expect.soft(cells.nth(5), 'Department').toHaveText(user.department);

                    await goToFirstPage();
                });
            }
        });
    });
});