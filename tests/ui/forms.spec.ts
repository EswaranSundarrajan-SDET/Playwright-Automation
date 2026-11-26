import { expect, test } from '../../fixtures/ui';
import { visitor } from '../../test-data/visitor';

/** Use the login page with the public demo account and check both banners. */
test('a visitor can sign in and sign out', async ({ login }) => {
  await login.open();
  await login.signIn(visitor.username, visitor.password);
  await expect(login.message).toContainText('You logged into a secure area!');
  await login.logout.click();
  await expect(login.message).toContainText('You logged out of the secure area!');
});

/** Use the login page to check the feedback after an incorrect password. */
test('the sign-in form explains an incorrect password', async ({ login }) => {
  await login.open();
  await login.signIn(visitor.username, 'wrong-demo-password');
  await expect(login.message).toContainText('Your password is invalid!');
});

/** Use the form to send several kinds of input and check the values received by the server. */
test('the form submits text, dates, numbers, colors and selections', async ({ form }) => {
  await form.open();
  await form.firstName.fill('Sam');
  await form.email.fill('sam@example.com');
  await form.age.fill('28');
  await form.birthday.fill('2000-05-12');
  await form.country.selectOption({ label: 'India' });
  await form.languages.selectOption(['English', 'Hindi']);
  await form.phone.check();
  await form.bio.fill('I test web forms.');
  await form.experience.press('ArrowRight');
  await form.setColor('#336699');
  await form.terms.check();
  await form.submit();
  await expect(form.submittedData.getByRole('cell', { name: 'Sam', exact: true })).toBeVisible();
  await expect(form.submittedData).toContainText('sam@example.com');
  await expect(form.submittedData).toContainText('2000-05-12');
  await expect(form.submittedData).toContainText('English, Hindi');
  await expect(form.submittedData).toContainText('I test web forms.');
  await expect(form.submittedData).toContainText('phone');
  await expect(form.submittedData).toContainText('#336699');
  await expect(form.submittedData).toContainText('accepted');
  await expect(form.submittedData.getByRole('cell', { name: '28', exact: true })).toBeVisible();
  await expect(form.submittedData.getByRole('cell', { name: 'in', exact: true })).toBeVisible();
  await expect(form.submittedData.getByRole('cell', { name: '6', exact: true })).toBeVisible();
});

/** Use the form to check how individual edits and the reset button restore field values. */
test('a visitor can clear text, uncheck a box and reset the form', async ({ form }) => {
  await form.open();
  await form.firstName.fill('Sam');
  await form.firstName.clear();
  await expect(form.firstName).toHaveValue('');
  await form.terms.check();
  await form.terms.uncheck();
  await expect(form.terms).not.toBeChecked();
  await form.country.selectOption({ label: 'India' });
  await form.reset.click();
  await expect(form.country).toHaveValue('');
});

/** Use the dates page to choose a day from the calendar and type a time. */
test('a calendar day and a native time can be chosen', async ({ dates }) => {
  await dates.open();
  await dates.pickDay(14);
  await expect(dates.appointment).toHaveValue('2030-05-14');
  await dates.time.fill('09:30');
  await expect(dates.time).toHaveValue('09:30');
});

/** Use the suggestions page to pick an item loaded after the search starts. */
test('a visitor can select a suggestion after typing', async ({ suggestions }) => {
  await suggestions.open();
  await suggestions.query.fill('App');
  await suggestions.choose('Apple');
  await expect(suggestions.selected).toHaveText('You selected: Apple');
});

/** Use the fruit menu to check a disabled option and select an available one. */
test('a custom menu shows which fruit can be selected', async ({ fruit }) => {
  await fruit.open();
  await fruit.menu.click();
  await expect(fruit.cherry).toBeDisabled();
  await fruit.banana.click();
  await expect(fruit.result).toHaveText('Selected: banana');
});

/** Use the read-only example to check when typing is allowed. */
test('a field can be locked and unlocked', async ({ readOnly }) => {
  await readOnly.open();
  await readOnly.lock.check();
  await expect(readOnly.text).not.toBeEditable();
  await expect(readOnly.disabled).toBeDisabled();
  await readOnly.lock.uncheck();
  await readOnly.text.fill('Now editable');
  await expect(readOnly.text).toHaveValue('Now editable');
});
