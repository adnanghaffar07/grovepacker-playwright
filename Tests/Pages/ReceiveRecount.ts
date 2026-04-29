import { type Page, expect } from '@playwright/test';
import { ReceiveRecountPageLocators } from '../Locators/ReceiveRecountLocators';
import { ScanVerifyPageLocators } from '../Locators/scanVerifyPageLocators';

export class ReceiveRecountGpxPage {
  readonly page: Page;
  readonly locators: ReceiveRecountPageLocators;
  readonly scanVerifyPageLocators: ScanVerifyPageLocators;
  constructor(page: Page) {
    this.page = page;
    this.locators = new ReceiveRecountPageLocators(page);
    this.scanVerifyPageLocators = new ScanVerifyPageLocators(page);
  }

  async visit() {
    await this.page.goto('/');
  }

  async clickOnElementByTestId(testId: string) {
    const locateElement = this.page.getByTestId(testId).first();
    await expect(locateElement).toBeVisible();
    await locateElement.click();
  }

  async navigateToReceiveInventoryPage() {
    await this.page.waitForTimeout(3000);
    await this.clickOnElementByTestId('menuIcon');
    await this.page.getByText('Receive').last().click();

    const input = this.page.getByPlaceholder('Receiving Record').first();

    await expect(input).toBeVisible();
    await expect(input).toBeFocused();
    // await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(3000);
  }

  async enterReceivingRecord(receivingRecord: string) {
    const input = this.page.getByPlaceholder('Receiving Record').first();

    await expect(input).toBeVisible();
    await expect(input).toBeFocused();
    await input.click()
    await input.fill(receivingRecord)

    await expect(this.page.getByText("Start Receiving")).toBeVisible()
    await this.page.getByText("Start Receiving").click()
    await this.page.keyboard.press('Enter');
    await expect(this.page.getByText("Receive Inventory")).toBeVisible()
    await this.page.waitForTimeout(3000);
  }

  async navigateToRecountInventoryPage() {
    await this.page.waitForTimeout(3000);
    await this.clickOnElementByTestId('menuIcon');
    await this.page.getByText('Recount').last().click();
  }

  async observeReceiveRecordPage() {
    const receiveInventoryTitle = this.page
      .getByText('Receiving Record')
      .first();
    await expect(receiveInventoryTitle).toBeVisible();

    await expect(this.page.getByText('Apple product').last()).toBeVisible();
    await this.page.getByText('Apply').last().click();
    await this.page.waitForTimeout(1000);
    await this.page.getByText('Yes, Make it so').last().click();
    await this.page.waitForTimeout(1000);
    await expect(this.page.getByText('ORANGE #001').last()).toBeVisible();

    await this.page.getByText('Export').last().click();
    await this.page.waitForTimeout(1000);
    await expect(this.page.getByText('Your export will be emailed to')).toBeVisible();
  }

  async observeReceiveInventoryPage() {
    const receiveInventoryTitle = this.page
      .getByText('Receive Inventory')
      .first();
    await expect(receiveInventoryTitle).toBeVisible();

    const productScan = this.page
      .getByText('Scan a product to continue')
      .first();
    await expect(productScan).toBeVisible();

    const productScanInputFeild = this.page
      .getByPlaceholder('Ready for Product Scan')
      .first();
    await expect(productScanInputFeild).toBeVisible();
    await expect(productScanInputFeild).toBeFocused();
  }

  async observeRecountPage() {
    const receiveInventoryTitle = this.page
      .getByText('Recount')
      .first();
    await expect(receiveInventoryTitle).toBeVisible();

  }
  async observeRecountInventoryPage() {
    const receiveInventoryTitle = this.page
      .getByText('Recount Inventory')
      .nth(1);
    await expect(receiveInventoryTitle).toBeVisible();

    const productScan = this.page
      .getByText('Scan a product to continue')
      .first();
    await expect(productScan).toBeVisible();

    const productScanInputFeild = this.page
      .getByPlaceholder('Ready for Product Scan')
      .first();
    await expect(productScanInputFeild).toBeVisible();
    await expect(productScanInputFeild).toBeFocused();
  }

  async selectWorkflowDropDownOption(optionSelect: string) {
    const workFlowDropDown = this.page.getByTestId('workFlowContainer').first();
    await expect(workFlowDropDown).toBeVisible();
    await this.page.waitForTimeout(2000);
    await workFlowDropDown.dispatchEvent('click');
    const workFlowDropDownOption = this.page
      .getByTestId('workflowOption')
      .getByText(optionSelect)
      .first();
    await expect(workFlowDropDownOption).toBeVisible();
    await workFlowDropDownOption.click({ delay: 1200 });
  }

  async enterProductBarcodeReceiveInventory(productBarcode: string) {
    const productScanInputField = this.page.getByPlaceholder('Receiving Record').first();

    // Make sure the input is visible
    await expect(productScanInputField).toBeVisible();


    // Double-check it’s focused
    await expect(productScanInputField).toBeFocused();

    // Fill in the barcode text
    await productScanInputField.fill(productBarcode);

    // Click the icon button (like a submit/scan icon)
    await this.page.keyboard.press('Enter');

    // Wait a bit for processing (use explicit waits if possible instead of timeout)
    await this.page.waitForTimeout(1500);
  }

  async enterProductBarcode(productBarcode: string, inputFieldPlaceholderText: string) {
    await this.page.waitForTimeout(3000);
    const productScanInputField = await this.page.getByPlaceholder(inputFieldPlaceholderText).first();

    // Make sure the input is visible
    await expect(productScanInputField).toBeVisible();

    // Double-check it’s focused
    await expect(productScanInputField).toBeFocused();

    // Fill in the barcode text
    await productScanInputField.fill(productBarcode);

    // Click the icon button (like a submit/scan icon)
    await this.page.keyboard.press('Enter');
  }

  async clickOnProductSkuToOpenDetailsPage(product: string) {
    const clickOnProduct = this.page
      .getByText(product, { exact: true })
      .first();
    await expect(clickOnProduct).toBeVisible();
    await clickOnProduct.click({ delay: 2000 });

    const qtyToReceive = this.page.getByTestId('quantityInput').first();
    await expect(qtyToReceive).toBeVisible();
  }

  async enterQtyToReceive(qty: string) {
    const qtyToReceive = this.page.getByTestId('quantityInput').first();
    await expect(qtyToReceive).toBeVisible();

    // Fill in the quantity
    await qtyToReceive.fill(qty);

    // Option 1 — Press Enter directly on the input
    // await this.page.keyboard.press('Enter');

    // Wait briefly for any UI response
    await this.page.waitForTimeout(2000);

    // Optionally click Save & Close if needed after Enter
    await this.page.getByText('Save & Close').first().click();
    // await this.page.waitForTimeout(2000);

    await expect(qtyToReceive).toBeHidden({ timeout: 10000 });
  }

  // Check the "Previous QOH" value inside the detail modal
  async verifyPreviousQohValue(expectedValue: string) {
    const previousQohInput = this.page
      .locator('div')
      .filter({ hasText: /^Previous QOH$/ })
      .locator('xpath=following-sibling::input | ..//input') 
      .first();
    
    await expect(previousQohInput).toBeVisible();
    await expect(previousQohInput).toHaveValue(expectedValue);
  }

  // Target the horizontal row in the summary table
  async verifiRecountSummary(sku: string, itemName: string, countedQty: string) {
    await expect(this.page.getByText("Recount Summary")).toBeVisible();

    await expect(this.page.locator('div')
      .filter({ hasText: 'Beads' })
      .first()).toBeVisible();
  }

  // async verifiRecountSummary(itemName: string, qty: string) {
  //   const verifyRecountSummary = this.page.getByText("Recount Summary").first();
  //   await expect(verifyRecountSummary).toBeVisible();
  //   await expect(this.page.locator('[dir="auto"]').filter({ hasText: qty }).locator(' +div').filter({ hasText: "Beads" }).first()).toBeVisible()
  //   await expect(this.page.locator('[dir="auto"]').filter({ hasText: qty }).locator(' +div').filter({ hasText: "Beads" }).first().locator(' +div').filter({ hasText: qty }).first()).toBeVisible()
  // }
  async enterProductInformation(product: string, value: string) {
    const productInformation = this.page
      .locator('div')
      .filter({ has: this.page.locator('input') })
      .filter({ has: this.page.getByText(product) })
      .last()
      .locator('input')
      .first();
    await expect(productInformation).toBeVisible();
    await productInformation.fill(value);
  }

  async createNewProductPopup() {
    const newProductPopup = this.page
      .getByText('Click or tap here to create a new product with barcode')
      .first();
    await expect(newProductPopup).toBeVisible();
    await newProductPopup.click();
    await this.page.waitForTimeout(1200);
  }

  async expectProductInputValue(product: string, value: any) {
    const productInformation = this.page
      .locator('div')
      .filter({ has: this.page.locator('input') })
      .filter({ has: this.page.getByText(product) })
      .last()
      .locator('input')
      .first();
    await expect(productInformation).toBeVisible();
    await expect(await productInformation.inputValue()).toBe(value);
  }

  async createNewProductData(barcode: string) {
    await this.page.waitForTimeout(2000);
    // await this.page.evaluate(() => {
    //   const el = document.querySelectorAll('[data-testid="addNewBarcode"]')[2] as HTMLElement;
    //   el?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    // });


    const productBarcode = this.page.getByTestId('barcodeInput').first();
    await expect(productBarcode).toBeVisible();
    await expect(await productBarcode.inputValue()).toBe(barcode);
    await this.expectProductInputValue('QOH', '0');
    await this.expectProductInputValue('Product Name', 'New Product');
    await this.expectProductInputValue('Location 1', '');

    await this.enterProductInformation('QOH', '10');
    await this.enterProductInformation('Product Name', 'Kiwi');
    await this.page.getByTestId('saveAndCloseButton').first().click();
    await expect(this.page.getByRole('progressbar')).not.toBeVisible();
  }

  async enterProductQty(qty: string) {
    const enterLocation = this.page.getByTestId('quantityInput').first();
    await expect(enterLocation).toBeVisible();
    await enterLocation.fill(qty);
  }

  async enterProductLocation(location: string) {
    const enterLocation = this.page.getByTestId('LocationInput').first();
    await expect(enterLocation).toBeVisible({ timeout: 15000 });
    await enterLocation.fill(location);

    await this.page.getByText('Save & Close').first().click();
  }

  async observeProductLocation(location: string) {
    const enterLocation = this.page.getByTestId('LocationInput').first();
    await expect(enterLocation).toBeVisible();
    expect(await enterLocation.inputValue()).toBe(location);
    await this.page.getByText('Save & Close').first().click();
  }

  async observeProductQohCount() {
    await this.page.waitForTimeout(2000);
    const newQohCount = this.page.getByText('New QOH: ').first();
    await expect(newQohCount).toBeVisible();
    const productCount = await newQohCount.innerText();
    expect(productCount).toBeTruthy();

    const qohQty = productCount.replace(/\D/g, '');
    console.log(qohQty, productCount);
    return qohQty;
  }

  async enterProductSku(barcode: string) {
    const enterProductSku = this.page
      .getByTestId('ReadyForProductScan')
      .first();
    await expect(enterProductSku).toBeVisible();
    await enterProductSku.click();
    await enterProductSku.fill(barcode);
    await this.page.keyboard.press('Enter');
  }

  async observeProductQoh(expectedCount: string) {
    // Locate the label/text node itself
    const qohLabel = this.page.getByText('Current QOH', { exact: true });

    // Go up to its containing div (nearest ancestor)
    const qohContainer = qohLabel.locator('xpath=ancestor::div[1]');

    // Inside that container, find the first <input>
    const qohInput = qohContainer.locator('input').first();

    // Wait until the input is visible
    await expect(qohInput).toBeVisible({ timeout: 10000 });

    // Get the value and compare
    const actualValue = await qohInput.inputValue();
    expect(actualValue.trim()).toBe(expectedCount);
  }



  async observeProductCount(count: string) {
    const productInformation = this.page
      .locator('div')
      .filter({ has: this.page.locator('input') })
      .filter({ has: this.page.getByText('Previous QOH') })
      .last()
      .locator('input')
      .first();
    await expect(productInformation).toBeVisible();
    expect(await productInformation.inputValue()).toBe(count);

    // await this.page.getByText('Done', { exact: true }).last().click();

  }

  async part6ScanningQohSteps() {
    await this.enterProductBarcode('REDAPPLE', 'Ready for Product Scan');

    await this.clickOnElementByTestId('incrementButton');
    await this.clickOnElementByTestId('incrementButton');
    await this.clickOnElementByTestId('SaveButton');
    await expect(this.page.getByTestId('LocationInput')).toBeVisible();
    await this.page.keyboard.press('Enter');
  }

  // See if the div table with products exists at Receive Inventory Page
  async observeReceiveInventoryTable() {
    const receiveInventoryTable = this.locators.receiveInventoryPageTable;
    await expect(receiveInventoryTable).toBeVisible();
  }

  async zeroOutProductQohViaReceive(recordName: string, productBarcode: string) {
    // We can reuse the existing navigation methods
    await this.navigateToReceiveInventoryPage();
    await this.enterReceivingRecord(recordName);

    // Scan the product with an intelligent wait
    const productScanInput = this.page.getByPlaceholder('Ready for Product Scan');
    await expect(productScanInput).toBeFocused({ timeout: 15000 });
    await productScanInput.fill(productBarcode);
    await this.page.keyboard.press('Enter');

    // Wait for the quantity screen to appear and then read the QOH
    const currentQohLabel = this.page.getByText('Current QOH', { exact: true });
    await expect(currentQohLabel).toBeVisible({ timeout: 15000 });
    const currentQohInput = currentQohLabel.locator('xpath=following-sibling::input[1]');
    const currentQohValue = Number(await currentQohInput.inputValue());

    // If QOH is not zero, enter the inverse value and save.
    if (currentQohValue !== 0) {
      console.log(`Current QOH is ${currentQohValue}. Entering ${-currentQohValue} to make it zero.`);
      // We perform this action directly to avoid the fixed wait in the shared 'enterQtyToReceive'
      const qtyToReceive = this.page.getByTestId('quantityInput').first();
      await qtyToReceive.fill(String(-currentQohValue));
      await this.page.getByText('Save & Close').first().click();
    } else {
      console.log('Current QOH is already 0. No setup action needed.');
      await this.page.getByText('Cancel').last().click();
    }

    // Wait for the action to complete by ensuring the main input is focused again
    await expect(productScanInput).toBeFocused();
  }

  async verifyCurrentProductQoh(productBarcode: string, expectedQoh: string) {
    // Scan the product
    const productScanInput = this.page.getByPlaceholder('Ready for Product Scan');
    await expect(productScanInput).toBeFocused();
    await productScanInput.fill(productBarcode);
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(10000);
    // Wait for quantity screen and verify the QOH value
    const currentQohLabel = this.page.getByText('Current QOH');
    await expect(currentQohLabel).toBeVisible();
    const currentQohInput = currentQohLabel.locator('xpath=following-sibling::input[1]');
    await expect(currentQohInput).toHaveValue(expectedQoh);
  }

  async clearExistingRecountRecords() {
    await this.page.waitForTimeout(8000)
    // 1. Wait for the Recounting Records container to be attached to the DOM
    const containerXpath = 'xpath=//div[contains(text(), "Recounting Records")]';
    await this.page.locator(containerXpath).waitFor({ state: 'visible', timeout: 10000 });

    // 2. Delete records using your exact structural XPath
    const deleteBtnXpath = 'xpath=//div[div[div[div[div[contains(text(), "Recounting Records")]]]]]//div[contains(text(), "Delete")]';
    const deleteBtn = this.page.locator(deleteBtnXpath);
    
    // Check count and loop
    let deleteCount = await deleteBtn.count();
    while (deleteCount > 0) {
      await deleteBtn.first().click();
      await this.page.getByText('Yes, This is the way.').click();
      await this.page.waitForTimeout(2000);
      deleteCount = await deleteBtn.count();
    }

    // 3. Archive records
    const archiveBtnXpath = 'xpath=//div[div[div[div[div[contains(text(), "Recounting Records")]]]]]//div[contains(text(), "Archive")]';
    const archiveBtn = this.page.locator(archiveBtnXpath);
    
    let archiveCount = await archiveBtn.count();
    while (archiveCount > 0) {
      await archiveBtn.first().click();
      await this.page.waitForTimeout(2000);
      archiveCount = await archiveBtn.count();
    }

    // 4. Click "Show Archived"
    const showArchivedBtn = this.page.locator('xpath=//div[contains(text(), "Show Archived")]');
    if (await showArchivedBtn.isVisible()) {
        await showArchivedBtn.click();
        await this.page.waitForTimeout(2000);

        // 5. Delete from Archived page
        const archivedDeleteBtn = this.page.locator('xpath=//div[contains(text(), "Delete")]');
        while (await archivedDeleteBtn.count() > 0) {
            await archivedDeleteBtn.first().click();
            await this.page.getByText('Yes, This is the way.').click();
            await this.page.waitForTimeout(2000);
        }

        // 6. Click Back
        await this.page.locator('xpath=//div[contains(text(), "back")]').click();
        await this.page.waitForTimeout(2000);
    }
  }
}
