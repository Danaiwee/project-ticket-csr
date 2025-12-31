const mockRouter = {
  replace: jest.fn(),
  push: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn(),
};

const mockSearchParams = {
  get: jest.fn(),
};

const mockPathname = jest.fn();

const mockUseRouter = jest.fn(() => mockRouter);
const mockUseSearchParams = jest.fn(() => mockSearchParams);
const mockUserPathname = jest.fn(() => mockPathname);

export {
  mockRouter,
  mockUseRouter,
  mockSearchParams,
  mockUseSearchParams,
  mockPathname,
  mockUserPathname,
};
