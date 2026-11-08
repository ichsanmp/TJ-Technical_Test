import { test, expect } from '@playwright/test';
import { PracticeFormPage, StudentFormData } from '../../pages/demoqa/practiceform.pages';

export const practiceFormTestData: StudentFormData = {
    firstName: 'Budi',
    lastName: 'Santoso',
    email: 'budi.santoso@example.com',
    gender: 'Male',
    mobile: '0812345678',
    dateOfBirth: '15 Jan 1995',
    subject: 'Maths',
    hobbies: ['Sports', 'Music'],
    address: 'Jl. Merdeka No. 10, Bekasi',
    state: 'NCR',
    city: 'Delhi',
};

test.describe('Forms - Practice Form Module', () => {
    let practiceFormPage: PracticeFormPage;

    test.beforeEach(async ({ page }) => {
        practiceFormPage = new PracticeFormPage(page);
        await practiceFormPage.navigate();
    });

    test('Should fill and submit the Student Registration form and verify the popup data', async () => {
        const input = practiceFormTestData;

        await test.step('And the Practice Form page is open', async () => {
            await practiceFormPage.verifyOnPracticeFormPage();
        });

        await test.step('When the student registration form is filled and submitted', async () => {
            await practiceFormPage.fillStudentForm(input);
            await practiceFormPage.submitForm();
        });

        let output: Record<string, string>;
        await test.step('Then the confirmation popup is displayed', async () => {
            await practiceFormPage.verifyModalOpened();
            output = await practiceFormPage.getModalData();
        });

        await test.step('And the popup data matches the submitted input', async () => {
            expect.soft(output['Student Name']).toBe(`${input.firstName} ${input.lastName}`);
            expect.soft(output['Student Email']).toBe(input.email);
            expect.soft(output['Gender']).toBe(input.gender);
            expect.soft(output['Mobile']).toBe(input.mobile);
            expect.soft(output['Date of Birth']).toBe(practiceFormPage.formatDateForModal(input.dateOfBirth));
            expect.soft(output['Subjects']).toBe(input.subject);
            expect.soft(output['Hobbies']).toBe(input.hobbies.join(', '));
            expect.soft(output['Address']).toBe(input.address);
            expect.soft(output['State and City']).toBe(`${input.state} ${input.city}`);
        });

        await test.step('And the popup is closed', async () => {
            await practiceFormPage.closeModal();
        });
    });
});