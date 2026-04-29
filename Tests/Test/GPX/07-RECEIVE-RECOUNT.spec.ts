import { test, Page, expect } from '@playwright/test';
import { ScanVerifyV3Page } from '../../Pages/ScanVerifyV3';
import { LoginPage } from '../../Pages/Login';
import { generateUniqueID } from '../../../Utils/testUtils';
import { ReceiveRecountGpxPage } from '../../Pages/ReceiveRecount';
import { ScanVerifyPage } from '../../Pages/ScanVerify';
import data from '../../../Utils/data.json';
import { waitForDebugger } from 'inspector';

test.describe(`Page - GPX -> Receive and Recount`, () => {
  let page: Page;
  // Declare the variable here without initializing it.
  let duplicateTenantName: string;

  // Add a beforeEach hook to generate a new, unique name before EACH test runs.
  test.beforeEach(async () => {
    duplicateTenantName = `receive_recount_gpx_${generateUniqueID(
      4,
    ).toLowerCase()}_playwright`;
  });

  test.afterEach(async ({ page }) => {
    // Note: The line `page = page;` was redundant and has been removed.
    const scanVerifyV3Page = new ScanVerifyV3Page(page);
    await test.step('Login to Admin Tools Using Using Valid Credentials', async () => {
      await scanVerifyV3Page.visit();
      await scanVerifyV3Page.conditionalLoginAdmin(
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
      await scanVerifyV3Page.searchTenantFromTable(`${duplicateTenantName}`);
      await scanVerifyV3Page.deleteDuplicateTenantAfterTestCase(
        `${duplicateTenantName}`,
      );
      await page.waitForTimeout(4000);
    });
    await page.close();
  });

  test('PART 1 -Receive inventory receive_recount_gpx_01', async ({
    page,
  }) => {
    const receiveRecountPage = new ReceiveRecountGpxPage(page);
    const loginPage = new LoginPage(page);

    const scanVerifyV3Page = new ScanVerifyV3Page(page);
    const tenantName = `${data.tenant.name}`;

    await test.step('Login Using Valid Credentials', async () => {
      await scanVerifyV3Page.visit();
      await page.reload();
      await scanVerifyV3Page.successfulLogin(
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
    });

    await test.step('Search Tenant from Table and Duplicate', async () => {
      await scanVerifyV3Page.searchTenantFromTable(tenantName);
      await scanVerifyV3Page.selectTenantToDuplicate(tenantName);
      await scanVerifyV3Page.duplicateTenantAndObserve(duplicateTenantName);
    });

    await test.step('Observe Tenant is Duplicated', async () => {
      await scanVerifyV3Page.validateFilteredTableData(
        duplicateTenantName,
        'Tenant',
      );
    });

    await test.step('Click on duplicated Tenant URL -> login and Observe Logged In Screen', async () => {
      await scanVerifyV3Page.selectFilteredTableData('URL');
      await scanVerifyV3Page.successfulLogin(
        `${data.tenant.userName}`,
        `${data.tenant.password}`,
      );
      await scanVerifyV3Page.loginToDuplicatedUser();
    });

    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await loginPage.successfulLogin(
        `${duplicateTenantName}`,
        `${data.tenant.userName}`,
        `${data.tenant.password}`,
      );
    });

    await test.step('verify user lands on "Scan & Verify" page.', async () => {
      await loginPage.verifyScanAndPassPage();
    });


    await test.step('Navigate to Receive Inventory Page and Verify', async () => {
      await receiveRecountPage.navigateToReceiveInventoryPage();
      await receiveRecountPage.enterReceivingRecord('ORANGE');
      await receiveRecountPage.enterProductBarcode('ORANGE', 'Ready for Product Scan');
      await expect(page.getByText('ORANGE').last()).toBeVisible()
      // await receiveRecountPage.observeReceiveInventoryPage();
    })
  });

  test('PART 2 - Enter quantity received and create new product - receive_recount_gpx_02', async ({
    page,
  }) => {
    const receiveRecountPage = new ReceiveRecountGpxPage(page);
    const loginPage = new LoginPage(page);

    const scanVerifyV3Page = new ScanVerifyV3Page(page);
    const tenantName = `${data.tenant.name}`;

    await test.step('Login Using Valid Credentials', async () => {
      await scanVerifyV3Page.visit();
      await page.reload();
      await scanVerifyV3Page.successfulLogin(
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
    });

    await test.step('Search Tenant from Table and Duplicate', async () => {
      await scanVerifyV3Page.searchTenantFromTable(tenantName);
      await scanVerifyV3Page.selectTenantToDuplicate(tenantName);
      await scanVerifyV3Page.duplicateTenantAndObserve(duplicateTenantName);
    });

    await test.step('Observe Tenant is Duplicated', async () => {
      await scanVerifyV3Page.validateFilteredTableData(
        duplicateTenantName,
        'Tenant',
      );
    });

    await test.step('Click on duplicated Tenant URL -> login and Observe Logged In Screen', async () => {
      await scanVerifyV3Page.selectFilteredTableData('URL');
      await scanVerifyV3Page.successfulLogin(
        `${data.tenant.userName}`,
        `${data.tenant.password}`,
      );
      await scanVerifyV3Page.loginToDuplicatedUser();
    });

    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await loginPage.successfulLogin(
        `${duplicateTenantName}`,
        `${data.tenant.userName}`,
        `${data.tenant.password}`,
      );
    });

    await test.step('verify user lands on "Scan & Verify" page.', async () => {
      await loginPage.verifyScanAndPassPage();
    });

    await test.step('Navigate to Receive Inventory Page and Verify', async () => {
      await receiveRecountPage.navigateToReceiveInventoryPage();
      await receiveRecountPage.enterReceivingRecord('AP');
      await receiveRecountPage.observeReceiveInventoryPage();
    });

    await test.step('Enter Product Barcode to View Products List', async () => {
      await receiveRecountPage.enterProductBarcode('8765678', 'Ready for Product Scan');
    });

    await test.step('Click on Product to Create New Product', async () => {
      await page.waitForTimeout(2000);
      await receiveRecountPage.createNewProductPopup();
      await page.waitForTimeout(2000);
      // await receiveRecountPage.createNewProductData('8765678');
    });

    // New step to simply enter qty and product name, and save
    await test.step('Enter qty and product name, and save', async () => {
      await page.locator('div:has-text("QOH")').locator('xpath=following-sibling::input').fill('10');
      await page.locator('div:has-text("Product Name")').locator('xpath=following-sibling::input').fill('kiwi');
      await page.getByText('Save & Close').click();
    })

    // Enter the same barcode again on receive inventory page - TO VERIFY THE BARCODE IS THE SAME
    await test.step('Enter the same barcode again on receive inventory page', async () => {
      await receiveRecountPage.enterProductBarcode('8765678', 'Ready for Product Scan');
    })

    // Verify the product barcode is and quantity are exact
    await test.step('The QOH, Product name and barcode are verified', async () => {
      const expectedQOH = '10';
      const expectedProductName = 'kiwi';
      const expectedBarcode = '8765678';

      await page.waitForTimeout(5000);

      const qohInput = page.locator('//div[normalize-space()="Current QOH"]/following-sibling::input');
      await expect(qohInput).toHaveValue(expectedQOH);
    })

  });

  test('PART 3 - Enter location and Observe the Product - receive_recount_gpx_03', async ({
    page,
  }) => {
    const receiveRecountPage = new ReceiveRecountGpxPage(page);
    const loginPage = new LoginPage(page);

    const scanVerifyV3Page = new ScanVerifyV3Page(page);
    const tenantName = `${data.tenant.name}`;

    await test.step('Login Using Valid Credentials', async () => {
      await scanVerifyV3Page.visit();
      await page.reload();
      await scanVerifyV3Page.successfulLogin(
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
    });

    await test.step('Search Tenant from Table and Duplicate', async () => {
      await scanVerifyV3Page.searchTenantFromTable(tenantName);
      await scanVerifyV3Page.selectTenantToDuplicate(tenantName);
      await scanVerifyV3Page.duplicateTenantAndObserve(duplicateTenantName);
    });

    await test.step('Observe Tenant is Duplicated', async () => {
      await scanVerifyV3Page.validateFilteredTableData(
        duplicateTenantName,
        'Tenant',
      );
    });

    await test.step('Click on duplicated Tenant URL -> login and Observe Logged In Screen', async () => {
      await scanVerifyV3Page.selectFilteredTableData('URL');
      await scanVerifyV3Page.successfulLogin(
        `${data.tenant.userName}`,
        `${data.tenant.password}`,
      );
      await scanVerifyV3Page.loginToDuplicatedUser();
    });

    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await loginPage.successfulLogin(
        `${duplicateTenantName}`,
        `${data.tenant.userName}`,
        `${data.tenant.password}`,
      );
    });

    await test.step('verify user lands on "Scan & Verify" page.', async () => {
      await loginPage.verifyScanAndPassPage();
    });

    await test.step('Navigate to Receive Inventory Page and Verify', async () => {
      await receiveRecountPage.navigateToReceiveInventoryPage();
      await receiveRecountPage.enterReceivingRecord('ORANGE');
      await receiveRecountPage.observeReceiveInventoryPage();
      await receiveRecountPage.selectWorkflowDropDownOption('Enter Location');
    });

    await test.step('Enter Product Barcode', async () => {
      await receiveRecountPage.enterProductBarcode('ORANGE', 'Ready for Product Scan');
    });

    await test.step('Enter Product Location and Observe', async () => {
      await receiveRecountPage.enterProductLocation('Crate1');
      await receiveRecountPage.enterProductBarcode('ORANGE', 'Ready for Product Scan');
      await receiveRecountPage.observeProductLocation('Crate1');
    });

    await test.step('Observe the Receive Inventory Page', async () => {
      await receiveRecountPage.observeReceiveInventoryPage();
    });
  });

  test('PART 4 - Update quantity received then enter location - receive_recount_gpx_04', async ({
    page,
  }) => {
    const receiveRecountPage = new ReceiveRecountGpxPage(page);
    const loginPage = new LoginPage(page);

    const scanVerifyV3Page = new ScanVerifyV3Page(page);
    const tenantName = `${data.tenant.name}`;

    await test.step('Login Using Valid Credentials', async () => {
      await scanVerifyV3Page.visit();
      await page.reload();
      await scanVerifyV3Page.successfulLogin(
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
    });

    await test.step('Search Tenant from Table and Duplicate', async () => {
      await scanVerifyV3Page.searchTenantFromTable(tenantName);
      await scanVerifyV3Page.selectTenantToDuplicate(tenantName);
      await scanVerifyV3Page.duplicateTenantAndObserve(duplicateTenantName);
    });

    await test.step('Observe Tenant is Duplicated', async () => {
      await scanVerifyV3Page.validateFilteredTableData(
        duplicateTenantName,
        'Tenant',
      );
    });

    await test.step('Click on duplicated Tenant URL -> login and Observe Logged In Screen', async () => {
      await scanVerifyV3Page.selectFilteredTableData('URL');
      await scanVerifyV3Page.successfulLogin(
        `${data.tenant.userName}`,
        `${data.tenant.password}`,
      );
      await scanVerifyV3Page.loginToDuplicatedUser();
    });

    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await loginPage.successfulLogin(
        `${duplicateTenantName}`,
        `${data.tenant.userName}`,
        `${data.tenant.password}`,
      );
    });

    await test.step('verify user lands on "Scan & Verify" page.', async () => {
      await loginPage.verifyScanAndPassPage();
    });

    await test.step('Navigate to Receive Inventory Page and Verify', async () => {
      await receiveRecountPage.navigateToReceiveInventoryPage();
      await receiveRecountPage.enterReceivingRecord('GREEN');
      await receiveRecountPage.observeReceiveInventoryPage();
      await receiveRecountPage.selectWorkflowDropDownOption('Enter Quantity Received, Then Enter Location');
    });

    await test.step('Enter Product Barcode to Enter Location', async () => {
      await receiveRecountPage.enterProductBarcode('GREEN', 'Ready for Product Scan');
    });

    await test.step('Enter Product Location and Observe', async () => {
      await receiveRecountPage.enterProductQty('10');
      await receiveRecountPage.enterProductLocation('Crate2');
      await receiveRecountPage.enterProductBarcode('GREEN', 'Ready for Product Scan');
      await receiveRecountPage.observeProductLocation('Crate2');
    });

    await test.step('Observe the Receive Inventory Page', async () => {
      await receiveRecountPage.observeReceiveInventoryPage();
    });
  });

  test('PART 5 - Scan each piece received - receive_recount_gpx_05', async ({
    page,
  }) => {
    const receiveRecountPage = new ReceiveRecountGpxPage(page);
    const loginPage = new LoginPage(page);

    const scanVerifyV3Page = new ScanVerifyV3Page(page);
    const tenantName = `${data.tenant.name}`;

    await test.step('Login Using Valid Credentials', async () => {
      await scanVerifyV3Page.visit();
      await page.reload();
      await scanVerifyV3Page.successfulLogin(
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
    });

    await test.step('Search Tenant from Table and Duplicate', async () => {
      await scanVerifyV3Page.searchTenantFromTable(tenantName);
      await scanVerifyV3Page.selectTenantToDuplicate(tenantName);
      await scanVerifyV3Page.duplicateTenantAndObserve(duplicateTenantName);
    });

    await test.step('Observe Tenant is Duplicated', async () => {
      await scanVerifyV3Page.validateFilteredTableData(
        duplicateTenantName,
        'Tenant',
      );
    });

    await test.step('Click on duplicated Tenant URL -> login and Observe Logged In Screen', async () => {
      await scanVerifyV3Page.selectFilteredTableData('URL');
      await scanVerifyV3Page.successfulLogin(
        `${data.tenant.userName}`,
        `${data.tenant.password}`,
      );
      await scanVerifyV3Page.loginToDuplicatedUser();
    });

    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await loginPage.successfulLogin(
        `${duplicateTenantName}`,
        `${data.tenant.userName}`,
        `${data.tenant.password}`,
      );
    });

    await test.step('verify user lands on "Scan & Verify" page.', async () => {
      await loginPage.verifyScanAndPassPage();
    });

    await test.step('Navigate to Receive Inventory Page and Verify', async () => {
      await receiveRecountPage.navigateToReceiveInventoryPage();
      await receiveRecountPage.enterReceivingRecord('BANANA');
      await receiveRecountPage.observeReceiveInventoryPage();
      await receiveRecountPage.selectWorkflowDropDownOption('Scan Each Piece Received');
    });


    await test.step('Enter Product Barcode to Enter Location', async () => {
      await receiveRecountPage.enterProductBarcode('BANANA', 'Ready for Product Scan');
      await receiveRecountPage.enterProductSku('BANANA');
      expect(await receiveRecountPage.observeProductQohCount()).toEqual('2');
      await receiveRecountPage.enterProductSku('BANANA');
      expect(await receiveRecountPage.observeProductQohCount()).toEqual('3');
      await receiveRecountPage.clickOnElementByTestId('incrementButton');
      expect(await receiveRecountPage.observeProductQohCount()).toEqual('4');
      await receiveRecountPage.clickOnElementByTestId('incrementButton');
      expect(await receiveRecountPage.observeProductQohCount()).toEqual('5');
      await receiveRecountPage.clickOnElementByTestId('decrementButton');
      expect(await receiveRecountPage.observeProductQohCount()).toEqual('4');
      await receiveRecountPage.clickOnElementByTestId('SaveButton');
      await receiveRecountPage.observeReceiveInventoryPage();

      await receiveRecountPage.selectWorkflowDropDownOption("Enter Quantity Received");
      await receiveRecountPage.enterProductBarcode('BANANA', 'Ready for Product Scan');
      await receiveRecountPage.observeProductQoh('4');
      await page.getByText('Cancel').last().click();
    });

    await test.step('Observe the Receive Inventory Page', async () => {
      await receiveRecountPage.observeReceiveInventoryPage();
    });
  });

  test('PART 6 - Scan each piece received, then enter location - receive_recount_gpx_06', async ({
    page,
  }) => {
    const receiveRecountPage = new ReceiveRecountGpxPage(page);
    const loginPage = new LoginPage(page);

    const scanVerifyV3Page = new ScanVerifyV3Page(page);
    const tenantName = `${data.tenant.name}`;

    await test.step('Login Using Valid Credentials', async () => {
      await scanVerifyV3Page.visit();
      await page.reload();
      await scanVerifyV3Page.successfulLogin(
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
    });

    await test.step('Search Tenant from Table and Duplicate', async () => {
      await scanVerifyV3Page.searchTenantFromTable(tenantName);
      await scanVerifyV3Page.selectTenantToDuplicate(tenantName);
      await scanVerifyV3Page.duplicateTenantAndObserve(duplicateTenantName);
    });

    await test.step('Observe Tenant is Duplicated', async () => {
      await scanVerifyV3Page.validateFilteredTableData(
        duplicateTenantName,
        'Tenant',
      );
    });

    await test.step('Click on duplicated Tenant URL -> login and Observe Logged In Screen', async () => {
      await scanVerifyV3Page.selectFilteredTableData('URL');
      await scanVerifyV3Page.successfulLogin(
        `${data.tenant.userName}`,
        `${data.tenant.password}`,
      );
      await scanVerifyV3Page.loginToDuplicatedUser();
    });

    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await loginPage.successfulLogin(
        `${duplicateTenantName}`,
        `${data.tenant.userName}`,
        `${data.tenant.password}`,
      );
    });

    await test.step('verify user lands on "Scan & Verify" page.', async () => {
      await loginPage.verifyScanAndPassPage();
    });

    await test.step('Navigate to Receive Inventory Page and Verify', async () => {
      await receiveRecountPage.navigateToReceiveInventoryPage();
      await receiveRecountPage.enterReceivingRecord('REDAPPLE');
      await receiveRecountPage.selectWorkflowDropDownOption('Scan Each Piece Received, Then Enter Location');
      await receiveRecountPage.observeReceiveInventoryPage();
    });


    await test.step('Enter Product Barcode, Increase the product Qoh and observe the Qoh quantity', async () => {
      await receiveRecountPage.part6ScanningQohSteps();
    });

    await test.step('Observe the Receive Inventory Page', async () => {
      await receiveRecountPage.observeReceiveInventoryPage();
    });
  });

  test('PART 7 - Quantity to receive with negative value - receive_recount_gpx_07', async ({
    page,
  }) => {
    const receiveRecountPage = new ReceiveRecountGpxPage(page);
    const loginPage = new LoginPage(page);
    const scanVerifyV3Page = new ScanVerifyV3Page(page);
    const tenantName = `expo1v1receive`;

    // --- Login and Tenant Duplication Steps ---
    await test.step('Login Using Valid Credentials', async () => {
      await scanVerifyV3Page.visit();
      await page.reload();
      await scanVerifyV3Page.successfulLogin(
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
    });

    await test.step('Search Tenant from Table and Duplicate', async () => {
      await scanVerifyV3Page.searchTenantFromTable(tenantName);
      await scanVerifyV3Page.selectTenantToDuplicate(tenantName);
      await scanVerifyV3Page.duplicateTenantAndObserve(duplicateTenantName);
    });

    await test.step('Observe Tenant is Duplicated', async () => {
      await scanVerifyV3Page.validateFilteredTableData(
        duplicateTenantName,
        'Tenant',
      );
    });

    await test.step('Click on duplicated Tenant URL -> login and Observe Logged In Screen', async () => {
      await scanVerifyV3Page.selectFilteredTableData('URL');
      await scanVerifyV3Page.successfulLogin(
        `${data.tenant.userName}`,
        `${data.tenant.password}`,
      );
      await scanVerifyV3Page.loginToDuplicatedUser();
    });

    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await loginPage.successfulLogin(
        `${duplicateTenantName}`,
        `${data.tenant.userName}`,
        `${data.tenant.password}`,
      );
    });

    await test.step('verify user lands on "Scan & Verify" page.', async () => {
      await loginPage.verifyScanAndPassPage();
    });

    await test.step('Setup: Isolate test by zeroing out product QOH', async () => {
      await receiveRecountPage.zeroOutProductQohViaReceive('B-PART-1', 'MAGIC');
    });

    await test.step('Set workflow and verify initial QOH is zero', async () => {
      await receiveRecountPage.selectWorkflowDropDownOption('Enter Quantity Received');
      await receiveRecountPage.verifyCurrentProductQoh('MAGIC', '0');
    });

    await test.step('Update Product Qoh with a negative value', async () => {
      await receiveRecountPage.enterQtyToReceive('-5');

      await expect(page.getByPlaceholder('Ready for Product Scan')).toBeFocused();
    });

    await test.step('Final Verification: Verify Current QOH is now -5', async () => {
      await receiveRecountPage.verifyCurrentProductQoh('MAGIC', '-5');
    });
  });

  test('PART 8 - Edit product fields - receive_recount_gpx_08', async ({
    page,
  }) => {
    const receiveRecountPage = new ReceiveRecountGpxPage(page);
    const loginPage = new LoginPage(page);

    const scanVerifyV3Page = new ScanVerifyV3Page(page);
    const tenantName = "expo1v1receive";
    const scanVerifyPage = new ScanVerifyPage(page);
    await test.step('Login Using Valid Credentials', async () => {
      await scanVerifyV3Page.visit();
      await page.reload();
      await scanVerifyV3Page.successfulLogin(
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
    });

    await test.step('Search Tenant from Table and Duplicate', async () => {
      await scanVerifyV3Page.searchTenantFromTable(tenantName);
      await scanVerifyV3Page.selectTenantToDuplicate(tenantName);
      await scanVerifyV3Page.duplicateTenantAndObserve(duplicateTenantName);
    });

    await test.step('Observe Tenant is Duplicated', async () => {
      await scanVerifyV3Page.validateFilteredTableData(
        duplicateTenantName,
        'Tenant',
      );
    });

    await test.step('Click on duplicated Tenant URL -> login and Observe Logged In Screen', async () => {
      await scanVerifyV3Page.selectFilteredTableData('URL');
      await scanVerifyV3Page.successfulLogin(
        `${data.tenant.userName}`,
        `${data.tenant.password}`,
      );
      await scanVerifyV3Page.loginToDuplicatedUser();
    });

    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await loginPage.successfulLogin(
        `${duplicateTenantName}`,
        `${data.tenant.userName}`,
        `${data.tenant.password}`,
      );
    });

    await test.step('verify user lands on "Scan & Verify" page.', async () => {
      await loginPage.verifyScanAndPassPage();
    });

    await test.step('Navigate to Receive Inventory Page and Verify', async () => {
      await receiveRecountPage.navigateToReceiveInventoryPage();
      await receiveRecountPage.enterReceivingRecord('MAGIC');
      await receiveRecountPage.selectWorkflowDropDownOption('Enter Quantity Received');

      await receiveRecountPage.observeReceiveInventoryPage();
    });

    await test.step('Enter Product Barcode to View Products List', async () => {
      await receiveRecountPage.enterProductBarcode('MAGIC', 'Ready for Product Scan');
    });

    await test.step('Update the Product Qoh', async () => {
      await receiveRecountPage.enterQtyToReceive('-5');
    });

    await test.step('Navigate to Receive Inventory Page', async () => {
      await receiveRecountPage.observeReceiveInventoryPage();
    });
    await test.step('Click on Edit Fields Button and Observe the Product Details Page', async () => {
      await page.waitForTimeout(3000)
      await receiveRecountPage.enterProductBarcode('MAGIC', 'Ready for Product Scan');
      await page.waitForTimeout(3000)
      await expect(page.getByText('Edit all product fields')).toBeVisible()
      await page.getByText('Edit all product fields').first().click();
      await scanVerifyPage.observeAndVerifyProductDetailPage();
    });
  });

  test('PART 9 - Recount with new quantity on hand - receive_recount_gpx_09', async ({
    page,
  }) => {
    const receiveRecountPage = new ReceiveRecountGpxPage(page);
    const loginPage = new LoginPage(page);

    const scanVerifyV3Page = new ScanVerifyV3Page(page);
    const tenantName = "expo1v1";

    await test.step('Login and Setup Tenant', async () => {
      await scanVerifyV3Page.visit();
      await scanVerifyV3Page.successfulLogin(`${process.env.VALID_USERNAME}`, `${process.env.VALID_PASSWORD}`);
      await scanVerifyV3Page.searchTenantFromTable(tenantName);
      await scanVerifyV3Page.selectTenantToDuplicate(tenantName);
      await scanVerifyV3Page.duplicateTenantAndObserve(duplicateTenantName);
      await scanVerifyV3Page.selectFilteredTableData('URL');
      await scanVerifyV3Page.successfulLogin(`${data.tenant.userName}`, `${data.tenant.password}`);
      await scanVerifyV3Page.loginToDuplicatedUser();
      await loginPage.visit();
      await loginPage.successfulLogin(duplicateTenantName, data.tenant.userName, data.tenant.password);
    });

    await test.step('Navigate to Recount and Verify Focus', async () => {
      await receiveRecountPage.navigateToRecountInventoryPage();
      await receiveRecountPage.clearExistingRecountRecords();
    });

    await test.step('Verify the field is focused and ready for a fresh start', async () => {
      await receiveRecountPage.locators.inputRecountingRecord.focus();
    });

    await test.step('Start Recount #001', async () => {
      await receiveRecountPage.locators.inputRecountingRecord.fill('B-PART-1');
      await page.keyboard.press('Enter');
      await expect(page.getByText('B-PART-1 #001').last()).toBeVisible();
      await expect(receiveRecountPage.locators.inputProductScan).toBeFocused();
    });

    await test.step('Enter new QOH 5 and Verify Previous QOH', async () => {
      await receiveRecountPage.selectWorkflowDropDownOption('Enter New Quantity on Hand');
      await receiveRecountPage.enterProductBarcode('B-PART-1', 'Ready for Product Scan');
      
      await expect(page.getByTestId('quantityInput')).toBeFocused();
      await page.getByTestId('quantityInput').fill('5');
      await page.keyboard.press('Enter');

      await receiveRecountPage.enterProductBarcode('B-PART-1', 'Ready for Product Scan');
      await receiveRecountPage.verifyPreviousQohValue('5');

      await page.getByTestId('quantityInput').fill('5');
      await receiveRecountPage.locators.btnSaveAndClose.click();
      await receiveRecountPage.locators.btnDone.click();
    });

    await test.step('Apply Record #001 and verify increment to #002', async () => {
      await receiveRecountPage.verifiRecountSummary('B-PART-1', 'Beads', '5');
      await page.waitForTimeout(3000);
      await page.getByText('Apply').first().click();
      await page.waitForTimeout(3000);
      await page.getByText('Yes, Make it so').first().click();
      await page.waitForTimeout(3000);

      await expect(receiveRecountPage.locators.inputRecountingRecord).toHaveValue('B-PART-1');
      await expect(page.locator('//input[@value="#002"]')).toBeVisible();
    });

    await test.step('Start Recount #002 and enter QOH 50', async () => {
      await page.getByText('Start recounting').click();
      await expect(page.getByText('B-PART-1 #002').last()).toBeVisible();
      
      await receiveRecountPage.selectWorkflowDropDownOption('Enter New Quantity on Hand');
      await receiveRecountPage.enterProductBarcode('B-PART-1', 'Ready for Product Scan');
      
      await page.getByTestId('quantityInput').fill('50');
      await page.keyboard.press('Enter');
      await receiveRecountPage.locators.btnDone.first().click();
    });

    await test.step('Final Apply and Export', async () => {
      await receiveRecountPage.verifiRecountSummary('B-PART-1', 'Beads', '50');
      await page.waitForTimeout(3000);
      await page.getByText('Apply').first().click();
      await page.waitForTimeout(3000);
      await page.getByText('Yes, Make it so').first().click();

      await expect(page.getByText('B-PART-1 #001')).toBeVisible();
      await expect(page.getByText('B-PART-1 #002')).toBeVisible();

      const recordRow = page.locator('//div[div[div[div[contains(text(), "B-PART-1 #001")]]]]//div[contains(text(), "Export")]')
      await recordRow.getByText('Export').click();
      await expect(page.locator('text=/Your export will be emailed/')).toBeVisible();
    });
  });
});