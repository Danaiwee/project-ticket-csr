import { screen, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { mockRouter, mockToast, resetAllMocks } from "@/tests/mocks";
import { api } from "@/lib/api";
import SignInForm from "@/components/SignInForm";

const user = userEvent.setup();

const mockRefreshUser = jest.fn().mockResolvedValue(undefined);
jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(() => ({
    user: null,
    loading: false,
    refreshUser: mockRefreshUser,
  })),
}));

describe("signIn Form Component", () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe("Rendering", () => {
    it("should display all the required field", () => {
      render(<SignInForm />);

      expect(screen.getByLabelText(/อีเมล/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/รหัสผ่าน/i)).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /เข้าสู่ระบบ/i })
      ).toBeInTheDocument();

      expect(screen.getByText(/หากคุณยังไม่มีบัญชี/i)).toBeInTheDocument();
    });
  });

  describe("Form Validation", () => {
    it("should render the error message if invalid input", async () => {
      render(<SignInForm />);

      const emailInput = screen.getByLabelText(/อีเมล/i);
      const passwordInput = screen.getByLabelText(/รหัสผ่าน/i);
      const submitButton = screen.getByRole("button", { name: /เข้าสู่ระบบ/i });

      await user.type(emailInput, "johndoe");
      await user.type(passwordInput, "12345");
      await user.click(submitButton);

      expect(
        await screen.findByText(/Please provide a valid email address./i)
      ).toBeInTheDocument();
      expect(
        await screen.findByText(/Password must be at least 6 characters long/i)
      ).toBeInTheDocument();

      await user.clear(emailInput);
      await user.clear(passwordInput);

      expect(await screen.findByText(/Please provide a valid email address./i));
      expect(
        await screen.findByText(/Password must be at least 6 characters long./i)
      );
    });
  });

  describe("Form Submission", () => {
    it("should call the onSubmit with valid data", async () => {
      (api.auth.signIn as jest.Mock).mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ success: true }), 100)
          )
      );

      render(<SignInForm />);

      const emailInput = screen.getByLabelText(/อีเมล/i);
      const passwordInput = screen.getByLabelText(/รหัสผ่าน/i);
      const submitButton = screen.getByRole("button", { name: /เข้าสู่ระบบ/i });

      await user.type(emailInput, "johndoe@example.com");
      await user.type(passwordInput, "Ppassword123456!");
      await user.click(submitButton);

      expect(screen.getByText(/กำลังโหลด.../i)).toBeInTheDocument();
      expect(api.auth.signIn).toHaveBeenCalled();
      expect(api.auth.signIn).toHaveBeenCalledWith({
        email: "johndoe@example.com",
        password: "Ppassword123456!",
      });
    });
  });

  describe("Form Success Handling", () => {
    it("should render a toast message and redirect to homepage", async () => {
      (api.auth.signIn as jest.Mock).mockResolvedValueOnce({ success: true });
      render(<SignInForm />);

      const emailInput = screen.getByLabelText(/อีเมล/i);
      const passwordInput = screen.getByLabelText(/รหัสผ่าน/i);
      const submitButton = screen.getByRole("button", { name: /เข้าสู่ระบบ/i });

      await user.type(emailInput, "johndoe@example.com");
      await user.type(passwordInput, "Ppassword123456!");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith("สำเร็จ", {
          description: "เข้าสู่ระบบสำเร็จ",
        });
        expect(mockRouter.push).toHaveBeenCalled();
      });
    });
  });

  describe("Form Failure Handing", () => {
    it("should render a toast message and do not redirect to homepage", async () => {
      (api.auth.signIn as jest.Mock).mockResolvedValueOnce({ success: false });

      render(<SignInForm />);

      const emailInput = screen.getByLabelText(/อีเมล/i);
      const passwordInput = screen.getByLabelText(/รหัสผ่าน/i);
      const submitButton = screen.getByRole("button", { name: /เข้าสู่ระบบ/i });

      await user.type(emailInput, "johndoe@example.com");
      await user.type(passwordInput, "Ppassword123456!");
      await user.click(submitButton);

      expect(mockToast).toHaveBeenCalledWith("เกิดข้อผิดพลาด", {
        description: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
      });
      expect(mockRouter.push).not.toHaveBeenCalled();
    });

    it("should display the error message from API", async () => {
      (api.auth.signIn as jest.Mock).mockResolvedValueOnce({
        success: false,
        error: {
          message: "Internal server error",
        },
      });

      render(<SignInForm />);

      const emailInput = screen.getByLabelText(/อีเมล/i);
      const passwordInput = screen.getByLabelText(/รหัสผ่าน/i);
      const submitButton = screen.getByRole("button", { name: /เข้าสู่ระบบ/i });

      await user.type(emailInput, "johndoe@example.com");
      await user.type(passwordInput, "Ppassword123456!");
      await user.click(submitButton);

      expect(mockToast).toHaveBeenCalledWith("เกิดข้อผิดพลาด", {
        description: "Internal server error",
      });
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });
});
