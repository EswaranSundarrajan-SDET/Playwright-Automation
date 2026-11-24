import { expect, test } from '../../src/fixtures/ui';

test('valid credentials open the secure area and logout returns to login', async ({ page, ui }) => {
  await ui.login.goto();
  await ui.login.login('practice', 'SuperSecretPassword!');
  await expect(page).toHaveURL(/\/secure\/?$/);
  await expect(ui.login.logoutLink).toBeVisible();

  await ui.login.logout();
  await expect(page).toHaveURL(/\/login\/?$/);
});

test('an incorrect password shows the login error', async ({ page, ui }) => {
  await ui.login.goto();
  await ui.login.login('practice', 'incorrect');
  await expect(page).toHaveURL(/\/login\/?$/);
  await expect(ui.login.error).toBeVisible();
});

test('text, password, number and date inputs display and clear values', async ({ ui }) => {
  const values = {
    number: '42',
    text: 'Playwright',
    password: 'Sample123!',
    date: '2030-06-15',
  };
  await ui.inputs.goto();
  await ui.inputs.enter(values);
  await expect(ui.inputs.password).toHaveAttribute('type', 'password');
  await expect(ui.inputs.date).toHaveValue(values.date);

  await ui.inputs.display();
  await expect(ui.inputs.output('number')).toHaveText(values.number);
  await expect(ui.inputs.output('text')).toHaveText(values.text);
  await expect(ui.inputs.output('password')).toHaveText(values.password);
  await expect(ui.inputs.output('date')).toHaveText(values.date);

  await ui.inputs.clear();
  await expect(ui.inputs.number).toHaveValue('');
  await expect(ui.inputs.text).toHaveValue('');
  await expect(ui.inputs.password).toHaveValue('');
  await expect(ui.inputs.date).toHaveValue('');
});

test('submitting an empty form shows required-field feedback', async ({ ui }) => {
  await ui.form.goto();
  await ui.form.contactName.clear();
  await ui.form.submit();
  await expect(ui.form.nameError).toBeVisible();
  await expect(ui.form.phoneError).toBeVisible();
  await expect(ui.form.dateError).toBeVisible();
  await expect(ui.form.paymentError).toBeVisible();
});

test('checkboxes can be checked and unchecked independently', async ({ ui }) => {
  const { first, second } = ui.checkboxes;
  await ui.checkboxes.goto();
  await first.check();
  await second.check();
  await expect(first).toBeChecked();
  await expect(second).toBeChecked();
  await first.uncheck();
  await expect(first).not.toBeChecked();
  await expect(second).toBeChecked();
});

test('radio selection is exclusive within each group', async ({ ui }) => {
  const { blue, red, green, tennis } = ui.radios;
  await ui.radios.goto();
  await expect(green).toBeDisabled();
  await blue.check();
  await red.check();
  await tennis.check();
  await expect(red).toBeChecked();
  await expect(blue).not.toBeChecked();
  await expect(tennis).toBeChecked();
});

test('native dropdowns support selecting by label and value', async ({ ui }) => {
  await ui.dropdown.goto();
  await ui.dropdown.selectOptions();
  await expect(ui.dropdown.simple).toHaveValue('2');
  await expect(ui.dropdown.pageSize).toHaveValue('20');
  await expect(ui.dropdown.selectedCountry()).toHaveText('India');
});

test('autocomplete fills the selected country', async ({ ui }) => {
  await ui.autocomplete.goto();
  await ui.autocomplete.chooseCountry('Ind', 'India');
  await expect(ui.autocomplete.country).toHaveValue('India');
});
