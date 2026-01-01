/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchHandler } from "./handler/fetch";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export const api = {
  auth: {
    signUp: (data: SignUpParams) =>
      fetchHandler(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        body: JSON.stringify(data),
      }),

    signIn: (data: SignInParams) =>
      fetchHandler(`${API_BASE_URL}/auth/signin`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    logout: () =>
      fetchHandler(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
      }),
    getLoggedInUser: () => fetchHandler(`${API_BASE_URL}/auth/get-user`),
  },

  locations: {
    getAll: (params: GetAllLocationsParams) => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.append("page", params.page.toString());
      if (params?.pageSize)
        searchParams.append("pageSize", params.pageSize.toString());
      if (params?.query) searchParams.append("query", params.query);

      const queryString = searchParams.toString();
      const url = `${API_BASE_URL}/locations${
        queryString ? `?${queryString}` : ""
      }`;

      return fetchHandler(url);
    },
    getLocation: (id: string) =>
      fetchHandler(`${API_BASE_URL}/locations/${id}`),
  },

  booking: {
    getUserBookings: (params: GetUserBookingsParams, options?: any) => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.append("page", params.page.toString());
      if (params?.pageSize)
        searchParams.append("pageSize", params.pageSize.toString());

      const queryString = searchParams.toString();
      const url = `${API_BASE_URL}/bookings/user-booking${
        queryString ? `?${queryString}` : ""
      }`;

      return fetchHandler(url, options);
    },

    cancelBooking: (id: string) =>
      fetchHandler(`${API_BASE_URL}/bookings/${id}`, {
        method: "DELETE",
      }),

    getAvaliable: (id: string, date: string) =>
      fetchHandler(
        `${API_BASE_URL}/bookings/check-available/${id}?date=${date}`
      ),

    createBooking: (locationId: string, params: CreateBookingParams) =>
      fetchHandler(`${API_BASE_URL}/bookings/create/${locationId}`, {
        method: "POST",
        body: JSON.stringify(params),
      }),
  },

  admin: {
    getLocationBookings: (params: GetLocationBookingsParams, options?: any) => {
      const { locationId, date, page, pageSize } = params;

      const urlParams = new URLSearchParams({
        date,
        page: String(page || 1),
        pageSize: String(pageSize || 10),
      });

      return fetchHandler(
        `${API_BASE_URL}/admin/${locationId}?${urlParams.toString()}`,
        options
      );
    },
    updateLimit: (id: string, newLimit: number) =>
      fetchHandler(`${API_BASE_URL}/admin/${id}`, {
        method: "PUT",
        body: JSON.stringify({ limitBooking: newLimit }),
      }),
  },
};
