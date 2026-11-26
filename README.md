# Playwright Automation

A TypeScript Playwright Test framework for [ExpandTesting](https://practice.expandtesting.com/). The UI suites use Page Object Models and test-scoped fixtures. The REST suites use Playwright's `APIRequestContext` with the [Notes API](https://practice.expandtesting.com/notes/api/api-docs/). A hybrid scenario seeds a note over the API, verifies it in the browser, and checks that a browser-created note persists in the API.

## Run locally

Requires Node.js 24 or newer. The default URLs use the public practice site.

```bash
npm ci
npx playwright install
npm run typecheck
npm test
```

| Command | What it runs |
| --- | --- |
| `npm test` | API plus UI in Chromium, Firefox, and WebKit |
| `npm run test:ui` | Chromium UI and hybrid tests |
| `npm run test:api` | API tests without a browser |
| `npm run test:headed` | Chromium UI with a visible browser |
| `npm run test:debug` | Chromium UI in the Playwright Inspector |
| `npm run test:list` | Discover tests without running them |
| `npm run report` | Open the most recent local HTML report |

Install just Chromium with `npx playwright install chromium` when running only that project. A custom environment can set `UI_BASE_URL` to the site origin and `API_BASE_URL` to its Notes API root. By default the API uses `/notes/api/` on the UI origin.

## Coverage

| Area | Operations verified |
| --- | --- |
| Authentication and forms | Login, invalid password, logout, text, masked password, number, native date, display and clear, required-field messages |
| Selection | Check and uncheck, radio grouping and disabled state, native selects by label and value, autocomplete suggestions |
| Mouse and keyboard | Hover, tooltip, key presses, right-click, slider movement, drag and drop |
| Browser controls | Alert acceptance, confirm accept and dismiss, prompt input, HTML modal, iframe, open Shadow DOM, popup/tab lifecycle |
| Files | Upload a generated text file, download a built-in sample and verify its contents |
| Dynamic controls and tables | Checkbox removal and restoration, input enable and disable, delayed visibility, dynamic row/column lookup, sorting, page size, next page |
| Notes API | Health, registration, login, authenticated profile, invalid credentials, missing token, invalid category, create/list/read/replace/complete/delete |
| Hybrid UI and API | API data setup, browser login and creation, API verification |

## Framework structure

The repository root is the Playwright framework folder. The shared classes can be used with other web apps and APIs. The `expandtesting` modules show how to use them with a real UI and REST API.

| Location | Responsibility |
| --- | --- |
| `tests/` | UI, API, and hybrid test specifications |
| `pages/` | Shared `BasePage` and the ExpandTesting Page Objects |
| `fixtures/` | Shared Playwright fixtures and demo setup for page objects and test accounts |
| `utils/` | Shared helpers for browser dialogs and API response checks |
| `test-data/` | Application-specific inputs, payloads, and TypeScript interfaces |
| `api/` | Shared HTTP client and the ExpandTesting Notes endpoints and response checks |
| `config/` | Shared environment loader and application-specific default addresses |
| `playwright.config.ts` | Test projects, parallel execution, timeouts, and reports |
| `package.json` | Dependencies and commands for running the framework |
| `.github/workflows/playwright.yml` | Type check, parallel test jobs, and report publishing |

Each UI test gets a fresh browser context. The UI fixture blocks third-party ad requests so ad overlays do not intercept the demo controls. Tests that write Notes data register a unique account and delete it during fixture teardown. Upload names are unique, and downloads use a test-specific output path. Web-first assertions wait for state changes without fixed sleeps.

## Reading a test

- For a UI example, open `tests/ui/forms.spec.ts` and follow `ui.login` to `pages/expandtesting/forms.ts`. The page object finds controls and performs actions. The spec checks what happened.
- For an API example, open `tests/api/notes.spec.ts`. The `notesApi` fixture opens an HTTP request context. The `notesAccount` fixture builds on that client to register and sign in a demo user, then tries to delete the user after the test.
- For a test that uses both, open `tests/ui/notes.spec.ts`. It uses the same demo user for API requests and browser actions, so it can check the data in both places.

`package.json` lists the commands and dependencies. `package-lock.json` records the exact versions installed by `npm ci`. `tsconfig.json` controls how TypeScript checks the code.

## Use the framework with another application

1. Set the application's default UI and API addresses in a file under `config/`. Import those settings in `playwright.config.ts`. The browser uses `baseURL` and the shared HTTP fixture uses `apiBaseURL`.
2. Add application page classes under `pages/` and extend `BasePage`. Each class sets its page path and defines its own locators and actions. Use the shared `goto()` and `fillFields()` methods as needed.
3. Import `test` from `fixtures/base.ts`. Use Playwright's `page` fixture for UI tests and ask for `apiClient` for HTTP tests. Add an application fixture when several tests need the same setup or cleanup.
4. Put endpoint methods under `api/` and payloads under `test-data/`. Use `apiClient.request()` to send requests and `expectJson()` from `utils/response.ts` to check JSON responses. Keep checks for the application's own response fields close to its API client.

## GitHub Actions

The workflow runs on pushes and pull requests targeting `main`, and can also run on demand. The five test jobs start independently. Chromium runs in two shards, while Firefox, WebKit, and API each run in their own job. Each job uses one Playwright worker, with one retry available on CI.

Open the workflow run and download the `playwright-html-report` artifact for combined results. Failed tests capture traces, and browser failures also capture screenshots. The pipeline publishes the test report as its artifact.

```bash
npx playwright test --project=chromium --shard=1/2
npx playwright test --project=chromium --shard=2/2
```
