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
  },

  users: {
    getLoggedInUser: () => fetchHandler(`${API_BASE_URL}/users/get-user`),
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
};
