import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/the-internet/login-page';
import { GuestFormPage } from '../pages/the-internet/guest-form-page';
import { DynamicControlsPage } from '../pages/the-internet/dynamic-controls-page';
import { DatePickersPage } from '../pages/the-internet/date-pickers-page';
import { AutocompletePage } from '../pages/the-internet/autocomplete-page';
import { CustomDropdownPage } from '../pages/the-internet/custom-dropdown-page';
import { AlertsPage } from '../pages/the-internet/alerts-page';
import { ModalPage } from '../pages/the-internet/modal-page';
import { NestedFramesPage } from '../pages/the-internet/nested-frames-page';
import { EditorPage } from '../pages/the-internet/editor-page';
import { WindowsPage } from '../pages/the-internet/windows-page';
import { UploadPage } from '../pages/the-internet/upload-page';
import { DownloadPage } from '../pages/the-internet/download-page';
import { DragAndDropPage } from '../pages/the-internet/drag-and-drop-page';
import { HoverPage } from '../pages/the-internet/hover-page';
import { TablesPage } from '../pages/the-internet/tables-page';
import { ShadowDomPage } from '../pages/the-internet/shadow-dom-page';
import { CanvasPage } from '../pages/the-internet/canvas-page';
import { ChartPage } from '../pages/the-internet/chart-page';
import { ContextMenuPage } from '../pages/the-internet/context-menu-page';
import { ElementsPage } from '../pages/the-internet/elements-page';
import { ReadOnlyPage } from '../pages/the-internet/read-only-page';
import { InfiniteScrollPage } from '../pages/the-internet/infinite-scroll-page';

/** Page objects a UI test can request by name. Each one uses that test's tab. */
interface UiFixtures {
  /** Signs a visitor in and out of the secure area. */
  login: LoginPage;
  /** Holds the fields on the large form and the table shown after submission. */
  form: GuestFormPage;
  /** Finds controls that disappear, return or become editable after a short wait. */
  dynamic: DynamicControlsPage;
  /** Finds the native time field and the appointment calendar. */
  dates: DatePickersPage;
  /** Finds the fruit search box and its delayed suggestions. */
  suggestions: AutocompletePage;
  /** Finds the fruit menu built from buttons and options. */
  fruit: CustomDropdownPage;
  /** Opens JavaScript alerts, confirmation boxes and text prompts. */
  alerts: AlertsPage;
  /** Finds the native dialog drawn inside the web page. */
  modal: ModalPage;
  /** Reads content from a frame nested inside another frame. */
  frames: NestedFramesPage;
  /** Finds the rich text field inside the editor's frame. */
  editor: EditorPage;
  /** Opens the example link in a new browser tab. */
  windows: WindowsPage;
  /** Chooses a file and submits it with the upload form. */
  files: UploadPage;
  /** Downloads the sample CSV made by the page. */
  downloads: DownloadPage;
  /** Moves a draggable column and reads the new order. */
  drag: DragAndDropPage;
  /** Finds the first visitor photo and its hidden profile link. */
  hover: HoverPage;
  /** Finds the last-name column and sorts the example table. */
  tables: TablesPage;
  /** Finds a button inside two open shadow roots. */
  shadow: ShadowDomPage;
  /** Finds the drawing area and the log of pointer and keyboard actions. */
  canvas: CanvasPage;
  /** Finds interactive shapes in the SVG chart. */
  chart: ChartPage;
  /** Opens the example's context menu with the right mouse button. */
  contextMenu: ContextMenuPage;
  /** Adds and removes buttons while the page is open. */
  elements: ElementsPage;
  /** Finds fields that can be locked, edited or disabled. */
  readOnly: ReadOnlyPage;
  /** Scrolls the page to load another paragraph of text. */
  scroll: InfiniteScrollPage;
}

/** The UI test runner. Playwright builds each requested page object when the test starts. */
export const test = base.extend<UiFixtures>({
  /** Give use the login page object built from the current browser page. */
  login: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  /** Give use the form page object built from the current browser page. */
  form: async ({ page }, use) => {
    await use(new GuestFormPage(page));
  },

  /** Give use the dynamic page object built from the current browser page. */
  dynamic: async ({ page }, use) => {
    await use(new DynamicControlsPage(page));
  },

  /** Give use the dates page object built from the current browser page. */
  dates: async ({ page }, use) => {
    await use(new DatePickersPage(page));
  },

  /** Give use the suggestions page object built from the current browser page. */
  suggestions: async ({ page }, use) => {
    await use(new AutocompletePage(page));
  },

  /** Give use the fruit page object built from the current browser page. */
  fruit: async ({ page }, use) => {
    await use(new CustomDropdownPage(page));
  },

  /** Give use the alerts page object built from the current browser page. */
  alerts: async ({ page }, use) => {
    await use(new AlertsPage(page));
  },

  /** Give use the modal page object built from the current browser page. */
  modal: async ({ page }, use) => {
    await use(new ModalPage(page));
  },

  /** Give use the frames page object built from the current browser page. */
  frames: async ({ page }, use) => {
    await use(new NestedFramesPage(page));
  },

  /** Give use the editor page object built from the current browser page. */
  editor: async ({ page }, use) => {
    await use(new EditorPage(page));
  },

  /** Give use the windows page object built from the current browser page. */
  windows: async ({ page }, use) => {
    await use(new WindowsPage(page));
  },

  /** Give use the files page object built from the current browser page. */
  files: async ({ page }, use) => {
    await use(new UploadPage(page));
  },

  /** Give use the downloads page object built from the current browser page. */
  downloads: async ({ page }, use) => {
    await use(new DownloadPage(page));
  },

  /** Give use the drag page object built from the current browser page. */
  drag: async ({ page }, use) => {
    await use(new DragAndDropPage(page));
  },

  /** Give use the hover page object built from the current browser page. */
  hover: async ({ page }, use) => {
    await use(new HoverPage(page));
  },

  /** Give use the tables page object built from the current browser page. */
  tables: async ({ page }, use) => {
    await use(new TablesPage(page));
  },

  /** Give use the shadow page object built from the current browser page. */
  shadow: async ({ page }, use) => {
    await use(new ShadowDomPage(page));
  },

  /** Give use the canvas page object built from the current browser page. */
  canvas: async ({ page }, use) => {
    await use(new CanvasPage(page));
  },

  /** Give use the chart page object built from the current browser page. */
  chart: async ({ page }, use) => {
    await use(new ChartPage(page));
  },

  /** Give use the context menu page object built from the current browser page. */
  contextMenu: async ({ page }, use) => {
    await use(new ContextMenuPage(page));
  },

  /** Give use the elements page object built from the current browser page. */
  elements: async ({ page }, use) => {
    await use(new ElementsPage(page));
  },

  /** Give use the read only page object built from the current browser page. */
  readOnly: async ({ page }, use) => {
    await use(new ReadOnlyPage(page));
  },

  /** Give use the scroll page object built from the current browser page. */
  scroll: async ({ page }, use) => {
    await use(new InfiniteScrollPage(page));
  },
});

export { expect } from '@playwright/test';
