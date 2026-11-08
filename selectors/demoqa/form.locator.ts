import { Page, Locator } from '@playwright/test';

export class PracticeFormLocators {
    readonly page: Page;

    readonly firstName: Locator;
    readonly lastName: Locator;
    readonly email: Locator;
    readonly genderWrapper: Locator;
    readonly mobile: Locator;
    readonly dateOfBirth: Locator;
    readonly subjectsInput: Locator;
    readonly hobbiesWrapper: Locator;
    readonly currentAddress: Locator;
    readonly stateDropdown: Locator;
    readonly cityDropdown: Locator;
    readonly submitButton: Locator;

    // Popup konfirmasi
    readonly modal: Locator;
    readonly modalTitle: Locator;
    readonly closeModalButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.firstName = page.locator('#firstName');
        this.lastName = page.locator('#lastName');
        this.email = page.locator('#userEmail');
        this.genderWrapper = page.locator('#genterWrapper');
        this.mobile = page.locator('#userNumber');
        this.dateOfBirth = page.locator('#dateOfBirthInput');
        this.subjectsInput = page.locator('#subjectsInput');
        this.hobbiesWrapper = page.locator('#hobbiesWrapper');
        this.currentAddress = page.locator('#currentAddress');
        this.stateDropdown = page.locator('#state');
        this.cityDropdown = page.locator('#city');
        this.submitButton = page.locator('#submit');

        this.modal = page.locator('.modal-content');
        this.modalTitle = page.locator('#example-modal-sizes-title-lg');
        this.closeModalButton = page.locator('.modal-footer #closeLargeModal');
    }

    modalValueByLabel(label: string): Locator {
        return this.modal
            .locator('tbody tr')
            .filter({ has: this.page.getByRole('cell', { name: label, exact: true }) })
            .locator('td')
            .nth(1);
    }
}