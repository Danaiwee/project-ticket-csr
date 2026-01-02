import "@testing-library/jest-dom";
import {
  MockImage,
  MockLink,
  mockToast,
  mockUseRouter,
  mockUserPathname,
  mockUseSearchParams,
} from "./tests/mocks";

jest.mock("next/navigation", () => ({
  useRouter: mockUseRouter,
  useSearchParams: mockUseSearchParams,
  usePathname: mockUserPathname,
}));
jest.mock("sonner", () => ({ toast: mockToast }));
jest.mock("next/link", () => MockLink);
jest.mock("next/image", () => MockImage);

jest.mock("@/lib/api", () => ({
  api: {
    auth: {
      signUp: jest.fn(),
      signIn: jest.fn(),
      logout: jest.fn(),
      getLoggedInUser: jest.fn(),
    },
    locations: {
      getAll: jest.fn(),
      getLocation: jest.fn(),
    },
    booking: {
      createBooking: jest.fn(),
      cancelBooking: jest.fn(),
      getAvaliable: jest.fn(),
      getUserBookings: jest.fn(),
    },
    admin: {
      getLocationBookings: jest.fn(),
      updateLimit: jest.fn(),
    },
  },
}));

jest.mock("@/lib/url", () => ({
  formUrlQuery: jest.fn(({ value }) => `?mocked-url-with-date=${value}`),
}));


jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(() => ({
    user: null,
    loading: false,
    setUser: jest.fn(),
    refreshUser: jest.fn().mockResolvedValue(undefined)
  })),
}));

