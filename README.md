# GroovePacker E2E Automation Suite

A robust end-to-end testing framework built with Playwright and TypeScript to validate GroovePacker scanning and inventory management systems. This suite covers modern GPX interfaces, Legacy applications, subscription workflows, and inventory operations.

## 🚀 Features

- **Multi-Version Support**: Separate test suites for GPX (v3), GPX v2, and Legacy applications.
- **Page Object Model (POM)**: Clean separation of locators and page action logic.
- **Dynamic Tenant Creation**: Isolated test environments using duplicated tenants via admin tools.
- **Complex Workflow Coverage**:
  - Inventory Receive & Recount.
  - Subscription creation with Stripe iframe handling and coupon application.
  - Scan & Verify workflows including tracking number validation and kit processing.
- **Rich Reporting**:
  - Slack notifications for test results.
  - HTML report generation with traces and video on failure.
  - Custom reporter for zipping and uploading artifacts.
- **API Integration**: Pre-test setup using REST APIs to reset order statuses.

## 🛠️ Tech Stack

- **Test Runner**: Playwright
- **Language**: TypeScript
- **CI/CD**: Bitbucket Pipelines
- **Reporting**: Playwright HTML Reporter, Slack Reporter

## 📋 Prerequisites

- Node.js v18 or higher
- npm v9 or higher

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd groovepackerautomation
```

### 2. Install dependencies
```bash
npm install
npx playwright install --with-deps
```

### 3. Configure environment variables
Create a `.env` file in the repository root and add the following keys:

```env
BASE_URL=https://app.groovepacker.com
TENANT_URL=https://admin.groovepacker.com
VALID_USERNAME=your_username
VALID_PASSWORD=your_password
VALID_USER_ACCOUNT=account_name
API_TOKEN=your_gpx_api_token
CHANNEL_NAME=slack-report-channel
SEND_REPORT_SLACK=true
```

## 🧪 Running Tests

Use the predefined npm scripts in `package.json`:

| Command | Description |
| --- | --- |
| `npm run tests:all` | Runs the entire test suite |
| `npm run test` | Runs modern GPX application tests |
| `npm run test:v2` | Runs GPX v2 specific tests |
| `npm run legacy` | Runs Legacy application tests |
| `npm run subscription` | Runs subscription/payment flow tests |
| `npm run test:recount` | Runs inventory recount tests |
| `npm run report:show` | Opens the local HTML report |

### Useful Playwright flags

Run tests in headed mode:
```bash
npx playwright test --headed
```

### Debug a specific test file
```bash
npx playwright test Tests/Test/GPX/03-ScanVerify.spec.ts --debug
```

## 📁 Project Structure

```text
├── Tests/
│   ├── Test/
│   │   ├── GPX/        # Modern GPX interface tests (v3/v2)
│   │   └── LEGACY/     # Legacy application and subscription tests
│   └── Pages/          # Page object actions and business logic
├── Locators/           # UI selectors separated by page
├── Utils/              # API helpers, Slack layouts, and ID generators
├── playwright.config.ts # Global configuration (retry, workers, reporters)
├── customReport.ts     # Custom logic for zipping/uploading reports
└── bitbucket-pipelines.yml # CI/CD configuration
```

## 📊 Reporting & CI/CD

### Slack integration
The framework sends test results to Slack using a custom layout defined in `Utils/slackCustomLayout.ts`. The notification includes metadata such as Base URL and account name.

### Custom artifacts
After a test run, `customReport.ts` automatically:

- Zips the `playwright-report` folder
- Uploads the ZIP file for easier debugging of CI failures

## 🛠️ Development Guidelines

- Add new selectors to the appropriate file in `Locators/`.
- Prefer `data-testid` attributes when available.
- Most tests include a `test.afterEach` block to delete duplicated tenants and keep the admin environment clean.
- Use `test.step()` to wrap logical sections for better report readability.
- Use `updateOrderList` in `Utils/updateApi.ts` to ensure orders are in the expected state before scanning.
