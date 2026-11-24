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

type PageObjects = { [Name in keyof typeof pages]: InstanceType<(typeof pages)[Name]> };

export const test = base.extend<{ ui: PageObjects }>({
  ui: async ({ context, page }, use) => {
    // The public demo can place third-party ad overlays over the controls under test.
    await context.route(
      (url) => /(?:^|\.)(?:googlesyndication\.com|doubleclick\.net|googleadservices\.com)$/.test(url.hostname),
      (route) => route.abort(),
    );

    const objects = Object.fromEntries(
      Object.entries(pages).map(([name, PageObject]) => [name, new PageObject(page)]),
    ) as PageObjects;
    await use(objects);
  },
});

export { expect };
