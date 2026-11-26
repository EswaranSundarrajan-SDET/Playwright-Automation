# Playwright UI and API framework

Run browser tests against **The Internet** and API tests against **Restful Booker**. The project uses TypeScript and the Page Object Model. Each browser test gets its own tab. Each API test that changes data creates its own booking.

## Run the tests

Install Node.js 24 or later. From the project root, run the following commands.

```sh
npm ci
npx playwright install
npm test
```

| Command | What it does |
| --- | --- |
| `npm run test:api` | Runs the booking tests. These can run immediately after `npm ci`. |
| `npm run test:ui` | Runs the browser examples in Chromium, Firefox and WebKit. |
| `npm run test:headed` | Opens Chromium so you can watch the browser tests. |
| `npm run test:list` | Lists the tests and the projects that run them. |
| `npm run typecheck` | Checks that the TypeScript code and fixture types agree. |
| `npm run report` | Opens the HTML report from the last run. |

## Where the code lives

| Folder or file | What to put there |
| --- | --- |
| `tests/ui/` and `tests/api/` | Test steps and expected results. |
| `pages/base-page.ts` | Navigation shared by every page object. |
| `pages/the-internet/` | The controls and actions for individual pages. |
| `fixtures/` | Setup shared by tests. UI fixtures supply page objects. API fixtures supply a client, token and temporary booking when requested. |
| `api/` | Methods for sending requests to the booking server. |
| `test-data/` | The demo login, sample guest details and TypeScript types. |
| `utils/` | Small helpers that work across applications. |
| `config/` | Website and API addresses and demo account settings. |
| `playwright.config.ts` | Browser projects, parallel workers, timeouts and reports. |
| `package.json` | Commands and package versions. |

If you know Selenium page objects, start with `pages/the-internet/login-page.ts`. Its `signIn` method fills the form and clicks Login. The `login` fixture builds that page object from the current tab. The test in `tests/ui/forms.spec.ts` calls the method and checks the resulting banner.

## What the tests cover

| Suite | Examples |
| --- | --- |
| Restful Booker | Health check, valid and invalid login, create, read, list by guest name, full update, partial update, delete and rejected edits. The update tests read the booking again to check what was saved. |
| Forms and choices | Sign-in and sign-out, text, password, email, number, date, time, calendar, text area, checkbox, radio button, slider, color, single and multiple selection, autocomplete, submit, clear and reset. |
| Browser actions | Alerts, confirmations, prompts, modal dialogs, nested frames, rich text editing, new tabs, uploads, CSV downloads and open shadow roots. |
| Mouse, keyboard and changing content | Hover, right-click, double-click, drag and drop, drawing on a canvas, SVG, typing, scrolling, sortable tables and controls that appear, disappear or change state. |

The color example sets the HTML color value and sends the form's input and change events. The upload example sends a small sample text file to the public demo. The booking fixture checks the guest name before cleanup so it can recognize the record it created.

## Add a test

1. For a new UI page, extend `BasePage`, set its path and add the controls or actions your test needs. Add the page to `fixtures/ui.ts`.
2. Import `test` and `expect` from the matching fixture file. Request the page object or API client by name in the test.
3. Put expected results in the test. For a booking test, request `saved` when you need a record created before the test and cleaned up afterward.
4. Describe each class, method, parameter, field and variable in plain English so the next reader knows its purpose.

To test your own deployment, set `UI_BASE_URL` or `API_BASE_URL` in your shell. Use the server root for the API address. Set `BOOKER_USERNAME` and `BOOKER_PASSWORD` if your booking server uses a different account.

## GitHub Actions

A push, pull request or manual run starts four parallel jobs. One runs the API suite and checks TypeScript. The other three each run one browser. Each job uses two workers and uploads its own HTML report. Open a failed test in its report to view the trace.

[The Internet examples](https://the-internet.herokuapp.com/) · [Restful Booker API guide](https://restful-booker.herokuapp.com/apidoc/index.html)
