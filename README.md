# GroovePacker E2E Automation Suite

A robust end-to-end testing framework built with Playwright and TypeScript to validate the GroovePacker scanning and inventory management systems. This suite covers the modern GPX interface, the Legacy application, subscription workflows, and inventory operations.

## 🚀 Features

- **Multi-Version Support**: Separate test suites for GPX (v3), V2, and Legacy applications.
- **Page Object Model (POM)**: Clean separation of Locators and Page Actions for high maintainability.
- **Dynamic Tenant Creation**: Tests automatically duplicate tenants via Admin Tools to ensure an isolated testing environment.
- **Complex Workflow Testing**:
  - Inventory Receive & Recount.
  - Subscription creation with Stripe iframe handling and coupon application.
  - Scan & Verify workflows including tracking number validation and kit processing.
- **Rich Reporting**:
  - Integrated with Slack for real-time result notifications.
  - HTML Reports with trace and video recording on failure.
  - Custom reporter that automatically zips and uploads artifacts.
- **API Integration**: Pre-test setup using REST APIs to reset order statuses.

## 🛠️ Tech Stack

- **Engine**: Playwright
- **Language**: TypeScript
- **CI/CD**: Bitbucket Pipelines
- **Reporting**: Playwright Slack Reporter, HTML Reporter

## 📋 Prerequisites

- **Node.js**: v18 or higher.
- **NPM**: v9 or higher.

## ⚙️ Setup & Installation

### Clone the repository:
```bash
git clone <your-repo-url>
cd groovepackerautomation

## ⚙️ Setup & Installation

### Install dependencies:
```bash
npm install
npx playwright install --with-deps

## Environment Variables:

Create a .env file in the root directory and populate it with the following keys (referencing playwright.config.ts and test files):

BASE_URL=https://app.groovepacker.com
TENANT_URL=https://admin.groovepacker.com
VALID_USERNAME=your_username
VALID_PASSWORD=your_password
VALID_USER_ACCOUNT=account_name
API_TOKEN=your_gpx_api_token
CHANNEL_NAME=slack-report-channel
SEND_REPORT_SLACK=true

## 🧪 Running Tests

The project includes several predefined scripts in package.json for targeted execution:

### Command	Description
npm run tests:all	Runs the entire test suite.
npm run test	Runs modern GPX application tests.
npm run test:v2	Runs GPX v2 specific tests.
npm run legacy	Runs Legacy application tests.
npm run subscription	Runs Subscription/Payment flow tests.
npm run test:recount	Runs Inventory Recounting tests.
npm run report:show	Opens the local HTML report.
Useful Playwright Flags:

Run in headed mode:
- npx playwright test --headed

### Debug a specific file:

npx playwright test Tests/Test/GPX/03-ScanVerify.spec.ts --debug
📂 Project Structure
├── Tests/
│   ├── Test/
│   │   ├── GPX/             # Modern GPX interface tests (v3/v2)
│   │   └── LEGACY/          # Legacy application and Subscription tests
│   └── Pages/               # Page Object actions and business logic
├── Locators/                # UI selectors separated by page
├── Utils/                   # API helpers, Slack layouts, and ID generators
├── playwright.config.ts     # Global configuration (Retry, Workers, Reporters)
├── customReport.ts          # Custom logic for zipping/uploading reports
└── bitbucket-pipelines.yml  # CI/CD configuration

## 📊 Reporting & CI/CD
### Slack Integration

The framework is configured to send test results to Slack. It uses a custom layout defined in Utils/slackCustomLayout.ts to provide metadata such as the Base URL and Account Name used during the run.

### Custom Artifacts

Upon completion of a test run, customReport.ts triggers:
Zipping of the playwright-report folder.
Uploading the .zip file (usually to Slack or a storage bucket) for easy debugging of CI failures.

Bitbucket Pipelines

## 🛠️ Development Guidelines
- Locators: Always add new selectors to the appropriate file in the Locators/ directory. Use data-testid where possible.
- Clean Up: Most tests include a test.afterEach block to delete the duplicated tenant created during the test to keep the admin environment clean.
- Atomic Steps: Use test.step() to wrap logical sections of your test for better readability in reports.
- API Helpers: Use updateOrderList in Utils/updateApi.ts to ensure an order is in the awaiting state before scanning begins.