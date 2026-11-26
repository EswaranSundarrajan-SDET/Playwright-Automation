import { test as base, expect } from '@playwright/test';
import { BookingClient } from '../api/booking-client';
import { bookerAccount } from '../config/environment';
import { makeBooking, type Booking, type SavedBooking } from '../test-data/bookings';

/** The API tools and booking data a test can ask Playwright to prepare. */
interface ApiFixtures {
  /** A client that sends requests to this test's booking server. */
  booker: BookingClient;
  /** A sign-in token for editing or deleting this test's booking. */
  token: string;
  /** The guest details this test will send when it creates a booking. */
  guest: Booking;
  /** A booking owned by this test and removed during cleanup. */
  saved: SavedBooking;
}

/** The API test runner. Playwright creates only the fixtures each test requests. */
export const test = base.extend<ApiFixtures>({
  /** Pass a booking client to the test using its own request context. */
  booker: async ({ request }, use) => {
    await use(new BookingClient(request));
  },

  /** Sign in with the demo account and pass the returned token to the test. */
  token: async ({ booker }, use) => {
    /** The server's answer to the sign-in request. */
    const response = await booker.signIn(bookerAccount.username, bookerAccount.password);
    expect(response.status()).toBe(200);
    /** The token returned for the public demo account. */
    const { token } = await response.json();
    expect(token).toEqual(expect.stringMatching(/\S+/));
    await use(token);
  },

  /** Give each test its own guest details. */
  guest: async ({}, use) => {
    await use(makeBooking());
  },

  /** Create a booking before the test and check its owner before deleting it afterward. */
  saved: async ({ booker, guest, token }, use) => {
    /** The answer to the request that created this test's booking. */
    const response = await booker.create(guest);
    expect(response.status()).toBe(200);
    /** The booking number and the details the server saved. */
    const saved: SavedBooking = await response.json();
    expect(saved.bookingid).toEqual(expect.any(Number));
    try {
      await use(saved);
    } finally {
      /** The current record tells us whether the test or a server reset already removed it. */
      const current = await booker.get(saved.bookingid);
      if (current.status() !== 404) {
        expect(current.status()).toBe(200);
        /** The guest name lets us recognize this test's record if the server reuses a number. */
        const owner: Booking = await current.json();
        if (owner.firstname === guest.firstname) {
          expect((await booker.remove(saved.bookingid, token)).status()).toBe(201);
        }
      }
    }
  },
});

export { expect };
