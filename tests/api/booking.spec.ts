import { expect, test } from '../../fixtures/api';

/** Use booker to check the service's health endpoint. */
test('the booking service answers its health check', async ({ booker }) => {
  expect((await booker.ping()).status()).toBe(201);
});

/** Use the token fixture to check that a valid login returns an access token. */
test('valid credentials return a token', async ({ token }) => {
  expect(token.length).toBeGreaterThan(0);
});

/** Use booker to check the error message returned for an incorrect password. */
test('an incorrect password returns a reason', async ({ booker }) => {
  /** The reply from the server when the password is incorrect. */
  const response = await booker.signIn('admin', 'incorrect-demo-password');
  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ reason: 'Bad credentials' });
});

/** Compare the saved booking with the guest data and read it again through booker. */
test('a new booking keeps all the submitted guest details', async ({ saved, guest, booker }) => {
  expect(saved.booking).toEqual(guest);
  /** The answer from a separate request to read the new record. */
  const response = await booker.get(saved.bookingid);
  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual(guest);
});

/** Use booker to find the saved booking by the guest's unique name. */
test('the booking list can be filtered by guest name', async ({ saved, guest, booker }) => {
  /** The booking numbers returned for this particular guest. */
  const response = await booker.list({ firstname: guest.firstname, lastname: guest.lastname });
  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual([{ bookingid: saved.bookingid }]);
});

/** Use the token to replace the saved booking and read it back through booker. */
test('PUT replaces the complete booking', async ({ saved, booker, token }) => {
  /** The full replacement record, keeping the unique first name for cleanup. */
  const replacement = { ...saved.booking, lastname: 'Revised', totalprice: 200, depositpaid: true,
    bookingdates: { checkin: '2031-01-02', checkout: '2031-01-05' }, additionalneeds: 'Late arrival' };
  /** The server's reply after all the fields are replaced. */
  const response = await booker.replace(saved.bookingid, replacement, token);
  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual(replacement);
  expect(await (await booker.get(saved.bookingid)).json()).toEqual(replacement);
});

/** Use the token to change one field and use booker to check the other saved fields. */
test('PATCH changes only the requested field', async ({ saved, booker, token }) => {
  /** The one field the guest wants to change. */
  const change = { additionalneeds: 'Evening meal' };
  /** The complete record expected after the change. */
  const expected = { ...saved.booking, ...change };
  /** The server's reply to the partial update. */
  const response = await booker.update(saved.bookingid, change, token);
  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual(expected);
  expect(await (await booker.get(saved.bookingid)).json()).toEqual(expected);
});

/** Use booker and the token to remove the saved record and check the missing-booking response. */
test('a deleted booking can no longer be read', async ({ saved, booker, token }) => {
  expect((await booker.remove(saved.bookingid, token)).status()).toBe(201);
  expect((await booker.get(saved.bookingid)).status()).toBe(404);
});

/** Ask booker to edit the saved record with an invalid token, then read the record again. */
test('an invalid token cannot change a booking', async ({ saved, booker }) => {
  /** The rejected change to the amount due. */
  const response = await booker.update(saved.bookingid, { totalprice: 5 }, 'invalid-demo-token');
  expect(response.status()).toBe(403);
  expect(await (await booker.get(saved.bookingid)).json()).toEqual(saved.booking);
});
