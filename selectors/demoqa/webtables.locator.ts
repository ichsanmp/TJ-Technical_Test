import { Page, Locator } from '@playwright/test';

export class WebTablesLocators {
    readonly page: Page;

    // Halaman utama
    readonly addButton: Locator;
    readonly searchBox: Locator;
    readonly nextButton: Locator;
    readonly previousButton: Locator;

    // Form registrasi (modal)
    readonly modalTitle: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly emailInput: Locator;
    readonly ageInput: Locator;
    readonly salaryInput: Locator;
    readonly departmentInput: Locator;
    readonly submitButton: Locator;
    readonly closeFormButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.addButton = page.getByRole('button', { name: 'Add' });
        this.searchBox = page.getByPlaceholder('Type to search');

        this.nextButton = page.getByRole('button', { name: 'Next', exact: true });
        this.previousButton = page.getByRole('button', { name: 'Previous', exact: true });

        this.modalTitle = page.getByText('Registration Form');
        this.firstNameInput = page.getByPlaceholder('First Name');
        this.lastNameInput = page.getByPlaceholder('Last Name');
        this.emailInput = page.getByPlaceholder('name@example.com');
        this.ageInput = page.getByPlaceholder('Age');
        this.salaryInput = page.getByPlaceholder('Salary');
        this.departmentInput = page.getByPlaceholder('Department');
        this.submitButton = page.getByRole('button', { name: 'Submit' });
        this.closeFormButton = page.getByLabel('Close');
    }

    // Locator dinamis untuk baris tertentu di tabel
    tableRowByKeyword(keyword: string): Locator {
        return this.page.getByRole('row').filter({ hasText: keyword });
    }

    editButtonByKeyword(keyword: string): Locator {
        return this.tableRowByKeyword(keyword).getByTitle('Edit');
    }

    deleteButtonByKeyword(keyword: string): Locator {
        return this.tableRowByKeyword(keyword).getByTitle('Delete');
    }

    // Baris yang memuat semua data user sekaligus
    tableRowByFullData(firstName: string, lastName: string, age: string, email: string, salary: string, department: string): Locator {
        return this.page.getByRole('row')
            .filter({ hasText: firstName })
            .filter({ hasText: lastName })
            .filter({ hasText: age })
            .filter({ hasText: email })
            .filter({ hasText: salary })
            .filter({ hasText: department });
    }
}