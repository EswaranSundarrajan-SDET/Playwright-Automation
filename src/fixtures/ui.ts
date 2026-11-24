// Start with the API fixtures so a browser test can also ask for an API client or a demo account.
import { test as base, expect } from './api';
import {
  AutocompletePage, CheckboxesPage, DropdownPage, FormValidationPage,
  InputsPage, LoginPage, RadioButtonsPage,
} from '../pages/forms';
import {
  ContextMenuPage, DialogsPage, DragAndDropPage, HoverPage, KeyboardPage, SliderPage, TooltipPage,
} from '../pages/interactions';
import {
  DownloadPage, FramesPage, ModalPage, ShadowDomPage, UploadPage, WindowsPage,
} from '../pages/browser-controls';
import {
  DynamicControlsPage, DynamicLoadingPage, DynamicTablePage, PaginationPage, SortableTablePage,
} from '../pages/dynamic-content';
import { NotesPage } from '../pages/notes-page';

// These names are the keys used in tests. For example, ui.login gives the test its LoginPage object.
const pages = {
  autocomplete: AutocompletePage,
  checkboxes: CheckboxesPage,
  contextMenu: ContextMenuPage,
  dialogs: DialogsPage,
  download: DownloadPage,
  drag: DragAndDropPage,
  dropdown: DropdownPage,
  dynamic: DynamicControlsPage,
  dynamicTable: DynamicTablePage,
  form: FormValidationPage,
  frames: FramesPage,
  hover: HoverPage,
  inputs: InputsPage,
  keyboard: KeyboardPage,
  loading: DynamicLoadingPage,
  login: LoginPage,
  modal: ModalPage,
  notes: NotesPage,
  pagination: PaginationPage,
  radios: RadioButtonsPage,
  shadow: ShadowDomPage,
  slider: SliderPage,
  sortable: SortableTablePage,
  tooltip: TooltipPage,
  upload: UploadPage,
  windows: WindowsPage,
};

// Keep each key linked to its page object type so editors can suggest the right actions.
type PageObjects = { [Name in keyof typeof pages]: InstanceType<(typeof pages)[Name]> };

// The ui fixture uses Playwright's fresh browser context and tab for the current test.
export const test = base.extend<{ ui: PageObjects }>({
  ui: async ({ context, page }, use) => {
    // The public demo can place third-party ad overlays over the controls under test.
    await context.route(
      (url) => /(?:^|\.)(?:googlesyndication\.com|doubleclick\.net|googleadservices\.com)$/.test(url.hostname),
      (route) => route.abort(),
    );

    // Create the page objects with the same tab. Creating an object leaves the tab on its current page.
    const objects = Object.fromEntries(
      Object.entries(pages).map(([name, PageObject]) => [name, new PageObject(page)]),
    ) as PageObjects;
    // Hand the page objects to the spec. Playwright closes the built-in tab and context after the test.
    await use(objects);
  },
});

export { expect };
