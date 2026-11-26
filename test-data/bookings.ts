import { uniqueName } from '../utils/unique-name';

/** The guest details that Restful Booker saves for one stay. */
export interface Booking {
  /** The guest's first name. Tests use it to identify their own booking. */
  firstname: string;
  /** The guest's family name. */
  lastname: string;
  /** The price for the whole stay. */
  totalprice: number;
  /** Whether the guest has paid a deposit. */
  depositpaid: boolean;
  /** The first and last day of the stay. */
  bookingdates: {
    /** The day the guest arrives, written as year-month-day. */
    checkin: string;
    /** The day the guest leaves, written as year-month-day. */
    checkout: string;
  };
  /** An extra service requested by the guest. */
  additionalneeds: string;
}

/** The booking number and guest details returned after a booking is created. */
export interface SavedBooking {
  /** The number assigned to this booking by the server. */
  bookingid: number;
  /** The guest details the server saved. */
  booking: Booking;
}

/** Build a new guest record so two tests can run at the same time. */
export function makeBooking(): Booking {
  return {
    firstname: uniqueName('Playwright'),
    lastname: 'Guest',
    totalprice: 140,
    depositpaid: false,
    bookingdates: { checkin: '2030-05-10', checkout: '2030-05-12' },
    additionalneeds: 'Breakfast',
  };
}
