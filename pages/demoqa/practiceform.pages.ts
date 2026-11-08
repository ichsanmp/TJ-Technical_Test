import { Page, test, expect } from '@playwright/test';
import { PracticeFormLocators } from '../../selectors/demoqa/form.locator';

export interface StudentFormData {
    firstName: string;
    lastName: string;
    email: string;
    gender: 'Male' | 'Female' | 'Other';
    mobile: string;
    dateOfBirth: string;
    subject: string;
    hobbies: string[];
    address: string;
    state: string;
    city: string;
}

export class PracticeFormPage {
    readonly page: Page;
    readonly locators: PracticeFormLocators;

    constructor(page: Page) {
        this.page = page;
        this.locators = new PracticeFormLocators(page);
    }

    async navigate() {
        await test.step('Given Navigate to Practice Form page', async () => {
            await this.page.goto('/automation-practice-form');
            await this.page.waitForLoadState('load');
        });
    }

    async verifyOnPracticeFormPage() {
        await test.step('Verify current page is Practice Form', async () => {
            await expect(this.page).toHaveURL(/.*automation-practice-form/);
        });
    }

    async fillStudentForm(data: StudentFormData) {
        await test.step('Fill Student Registration form', async () => {
            const l = this.locators;

            await test.step('Fill personal information', async () => {
                await l.firstName.fill(data.firstName);
                await l.lastName.fill(data.lastName);
                await l.email.fill(data.email);
                await l.genderWrapper.getByText(data.gender, { exact: true }).click();
                await l.mobile.fill(data.mobile);
            });

            await test.step('Fill date of birth, subject and hobbies', async () => {
                await l.dateOfBirth.fill(data.dateOfBirth);
                await l.dateOfBirth.press('Enter');

                await l.subjectsInput.fill(data.subject);
                await l.subjectsInput.press('Enter');

                for (const hobby of data.hobbies) {
                    await l.hobbiesWrapper.getByText(hobby, { exact: true }).click();
                }
            });

            await test.step('Fill address, state and city', async () => {
                await l.currentAddress.fill(data.address);

                await l.stateDropdown.click();
                await this.page.getByText(data.state, { exact: true }).click();

                // city baru aktif setelah state dipilih
                await l.cityDropdown.click();
                await this.page.getByText(data.city, { exact: true }).click();
            });
        });
    }

    async submitForm() {
        await test.step('Submit the form', async () => {
            await this.locators.submitButton.scrollIntoViewIfNeeded();
            await this.locators.submitButton.click();
        });
    }

    formatDateForModal(input: string): string {
        const months: Record<string, string> = {
            Jan: 'January', Feb: 'February', Mar: 'March', Apr: 'April',
            May: 'May', Jun: 'June', Jul: 'July', Aug: 'August',
            Sep: 'September', Oct: 'October', Nov: 'November', Dec: 'December',
        };
        const [day, month, year] = input.trim().split(/\s+/);
        const fullMonth = months[month];
        if (!fullMonth) throw new Error(`Format bulan tidak dikenali: "${month}"`);
        return `${day.padStart(2, '0')} ${fullMonth},${year}`;
    }

    async verifyModalOpened() {
        await test.step('Verify confirmation popup is displayed', async () => {
            await expect(this.locators.modal).toBeVisible();
            await expect(this.locators.modalTitle).toHaveText('Thanks for submitting the form');
        });
    }

    async getModalData(): Promise<Record<string, string>> {
        return await test.step('Read data from confirmation popup', async () => {
            const rows = this.locators.modal.locator('tbody tr');
            await expect(rows).toHaveCount(10);

            const data: Record<string, string> = {};
            for (const row of await rows.all()) {
                const [label, value] = await row.locator('td').allInnerTexts();
                data[label.trim()] = value.trim();
            }
            return data;
        });
    }

    async closeModal() {
        await test.step('Close confirmation popup', async () => {
            const { modal } = this.locators;

            await expect(async () => {
                if (await modal.isVisible()) {
                    await this.page.keyboard.press('Escape');
                }
                await expect(modal).toBeHidden({ timeout: 1000 });
            }).toPass({ timeout: 10000 });
        });
    }
}