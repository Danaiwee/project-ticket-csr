export const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  DASHBOARD: "/admin",
  BOOKING: "/my-booking",

  LOCATION: (id: string) => `/location/${id}`,
  ADMIN_LOCATION: (id: string) => `/admin/${id}`,
};
