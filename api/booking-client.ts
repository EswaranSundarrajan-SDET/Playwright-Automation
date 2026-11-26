import type { APIRequestContext } from '@playwright/test';
import type { Booking } from '../test-data/bookings';

/** Sends requests to Restful Booker and gives tests the full HTTP response. */
export class BookingClient {
  /**
   * Set up the client with its own HTTP connection settings.
   * @param request The request context for the booking server.
   */
  constructor(private readonly request: APIRequestContext) {}

  /** Ask whether the service is running. */
  ping() {
    return this.request.get('/ping');
  }

  /**
   * Ask for a token to change or delete a booking.
   * @param username The account name used to sign in.
   * @param password The password for that account.
   */
  signIn(username: string, password: string) {
    return this.request.post('/auth', { data: { username, password } });
  }

  /**
   * Get booking numbers, optionally filtered by guest name or travel dates.
   * @param filters The search fields to send in the URL. An empty set lists every booking.
   */
  list(filters: Partial<Record<'firstname' | 'lastname' | 'checkin' | 'checkout', string>> = {}) {
    return this.request.get('/booking', { params: filters });
  }

  /**
   * Read the saved details of a single booking.
   * @param id The booking number assigned by the server.
   */
  get(id: number) {
    return this.request.get(`/booking/${id}`);
  }

  /**
   * Send the guest details and ask for a new booking number.
   * @param booking The guest details to save.
   */
  create(booking: Booking) {
    return this.request.post('/booking', { data: booking });
  }

  /**
   * Replace the saved booking with a complete set of guest details.
   * @param id The number of the booking to replace.
   * @param booking All the guest details to keep.
   * @param token The sign-in token used to approve the change.
   */
  replace(id: number, booking: Booking, token: string) {
    return this.request.put(`/booking/${id}`, { data: booking, headers: { Cookie: `token=${token}` } });
  }

  /**
   * Change just the fields supplied by the caller.
   * @param id The number of the booking to change.
   * @param changes The fields to update.
   * @param token The sign-in token used to approve the change.
   */
  update(id: number, changes: Partial<Booking>, token: string) {
    return this.request.patch(`/booking/${id}`, { data: changes, headers: { Cookie: `token=${token}` } });
  }

  /**
   * Remove a booking from the server.
   * @param id The number of the booking to remove.
   * @param token The sign-in token used to approve removal.
   */
  remove(id: number, token: string) {
    return this.request.delete(`/booking/${id}`, { headers: { Cookie: `token=${token}` } });
  }
}
