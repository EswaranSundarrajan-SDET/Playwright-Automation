import { expect, test } from '../../src/fixtures/ui';

test('valid credentials open the secure area and logout returns to login', async ({ page, ui }) => {
  await ui.login.goto();
  // The practice site provides these demo credentials.
  await ui.login.login('practice', 'SuperSecretPassword!');
  await expect(page).toHaveURL(/\/secure\/?$/);
  await expect(ui.login.logoutLink).toBeVisible();

  // Returning to the login URL shows that the logout link completed the action.
  await ui.login.logout();
  await expect(page).toHaveURL(/\/login\/?$/);
});

test('an incorrect password shows the login error', async ({ page, ui }) => {
  await ui.login.goto();
  // Keep the username valid so this test checks the password error.
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
  // Check that the browser treats this field as a password input.
  await expect(ui.inputs.password).toHaveAttribute('type', 'password');
  await expect(ui.inputs.date).toHaveValue(values.date);

  // Compare the values the page displays with the values sent to the inputs.
  await ui.inputs.display();
  await expect(ui.inputs.output('number')).toHaveText(values.number);
  await expect(ui.inputs.output('text')).toHaveText(values.text);
  await expect(ui.inputs.output('password')).toHaveText(values.password);
  await expect(ui.inputs.output('date')).toHaveText(values.date);

  // Check every input after Clear Inputs because each control has its own value.
  await ui.inputs.clear();
  await expect(ui.inputs.number).toHaveValue('');
  await expect(ui.inputs.text).toHaveValue('');
  await expect(ui.inputs.password).toHaveValue('');
  await expect(ui.inputs.date).toHaveValue('');
});

test('submitting an empty form shows required-field feedback', async ({ ui }) => {
  await ui.form.goto();
  // The demo fills in the contact name by default. Clear it to trigger all four required-field warnings.
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
  // Keep the second box selected to check that each checkbox has its own state.
  await first.uncheck();
  await expect(first).not.toBeChecked();
  await expect(second).toBeChecked();
});

test('radio selection is exclusive within each group', async ({ ui }) => {
  const { blue, red, green, tennis } = ui.radios;
  await ui.radios.goto();
  await expect(green).toBeDisabled();
  // Choose two colors in a row to exercise the rule that only one color can be selected.
  await blue.check();
  await red.check();
  // The sport has its own group. Both the new sport and the chosen color should be selected.
  await tennis.check();
  await expect(red).toBeChecked();
  await expect(blue).not.toBeChecked();
  await expect(tennis).toBeChecked();
});

test('native dropdowns support selecting by label and value', async ({ ui }) => {
  await ui.dropdown.goto();
  await ui.dropdown.selectOptions();
  // The displayed label and the value saved by an option can be different.
  await expect(ui.dropdown.simple).toHaveValue('2');
  await expect(ui.dropdown.pageSize).toHaveValue('20');
  await expect(ui.dropdown.selectedCountry()).toHaveText('India');
});

test('autocomplete fills the selected country', async ({ ui }) => {
  await ui.autocomplete.goto();
  // Use a partial name to check that picking a suggestion completes the field.
  await ui.autocomplete.chooseCountry('Ind', 'India');
  await expect(ui.autocomplete.country).toHaveValue('India');
});
