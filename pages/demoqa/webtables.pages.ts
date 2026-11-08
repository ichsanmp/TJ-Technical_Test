import { Page, test, Locator } from '@playwright/test';
import { WebTablesLocators } from '../../selectors/demoqa/webtables.locator';

export interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    age: string;
    salary: string;
    department: string;
}

export class WebTablesPage {
    readonly page: Page;
    readonly locators: WebTablesLocators;

    constructor(page: Page) {
        this.page = page;
        this.locators = new WebTablesLocators(page);
    }

    async navigate() {
        await test.step('Given Navigate to Web Tables page', async () => {
            await this.page.goto('/webtables');
        });
    }

    async addNewRecord(data: UserData) {
        await test.step(`Add new record for: ${data.firstName} ${data.lastName}`, async () => {
            await this.locators.addButton.click();

            await this.locators.firstNameInput.fill(data.firstName);
            await this.locators.lastNameInput.fill(data.lastName);
            await this.locators.emailInput.fill(data.email);
            await this.locators.ageInput.fill(data.age);
            await this.locators.salaryInput.fill(data.salary);
            await this.locators.departmentInput.fill(data.department);

            await this.locators.submitButton.click();
        });
    }

    async searchRecord(keyword: string) {
        await test.step(`Search record with keyword: ${keyword}`, async () => {
            await this.locators.searchBox.fill(keyword);
        });
    }

    async deleteRecordByEmail(email: string) {
        await test.step(`Delete record with email: ${email}`, async () => {
            await this.locators.deleteButtonByKeyword(email).click();
        });
    }

    // Cari baris user di semua halaman. Klik Next sampai baris ketemu
    // atau tombol Next sudah disabled.
    async findRecordWithPagination(data: UserData): Promise<Locator> {
        return await test.step(`Find record across pages for: ${data.email}`, async () => {
            let isFound = false;

            const targetRow = this.locators.tableRowByFullData(
                data.firstName, data.lastName, data.age, data.email, data.salary, data.department
            );

            while (!isFound) {
                isFound = await targetRow.isVisible();

                if (!isFound) {
                    if (await this.locators.nextButton.isDisabled()) {
                        break;
                    }

                    await this.locators.nextButton.click();
                    // tunggu tabel selesai render ulang setelah pindah halaman
                    await this.page.waitForTimeout(500);
                }
            }

            return targetRow;
        });
    }
}