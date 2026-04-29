import { Page } from '@playwright/test';

export class ReceiveRecountPageLocators {
  constructor(private readonly page: Page) { }

  get receieveRecountInput() {
    return this.page.getByPlaceholder('Ready for Product Scan').first();
  }

  get receieveRecountSearchButton() {
    return this.page.locator('.icon-search').first();
  }

  get receiveInventoryPageTable() {
    return this.page.locator('div.css-175oi2r');
  }

  get inputRecountingRecord() {
    return this.page.getByPlaceholder('Recounting Record');
  }

  get inputProductScan() {
    return this.page.getByPlaceholder('Ready for Product Scan');
  }

  get btnSaveAndClose() {
    return this.page.getByText('Save & Close');
  }

  get btnDone() {
    return this.page.getByText('Done', { exact: true });
  }

  get btnApply() {
    return this.page.getByText('Apply');
  }

  get btnConfirmYesMakeItSo() {
    return this.page.getByText('Yes, Make it so');
  }
}
