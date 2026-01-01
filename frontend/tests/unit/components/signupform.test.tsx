import { screen, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SignUpForm from "@/components/SignUpForm";
import { mockRouter, mockToast, resetAllMocks } from "@/tests/mocks";
import { api } from "@/lib/api";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/context/AuthContext";

const user = userEvent.setup();

describe("Signup Form Component", () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe("Rendering", () => {
    it("should display all the required field", () => {
      render(<SignUpForm />);

      expect(screen.getByLabelText(/ชื่อจริง/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/นามสกุล/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/อีเมล/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/รหัสผ่าน/i)).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /ลงทะเบียน/i })
      ).toBeInTheDocument();

      expect(screen.getByText(/หากคุณมีบัญชีอยู่แล้ว/i)).toBeInTheDocument();
    });
  });

  describe("Form Validation", () => {
    it("should render the error message if invalid input", async () => {
      render(<SignUpForm />);

      const firstNameInput = screen.getByLabelText(/ชื่อจริง/i);
      const lastNameInput = screen.getByLabelText(/นามสกุล/i);
      const emailInput = screen.getByLabelText(/อีเมล/i);
      const passwordInput = screen.getByLabelText(/รหัสผ่าน/i);
      const submitButton = screen.getByRole("button", { name: /ลงทะเบียน/i });

      await user.type(firstNameInput, "John");
      await user.type(lastNameInput, "Doe");
      await user.type(emailInput, "johndoe");
      await user.type(passwordInput, "12345");
      await user.click(submitButton);

      expect(
        await screen.findByText(/Please provide a valid email address/i)
      ).toBeInTheDocument();
      expect(
        await screen.findByText(/Password must be at least 6 characters long/i)
      ).toBeInTheDocument();

      await user.clear(firstNameInput);
      await user.clear(lastNameInput);
      await user.clear(emailInput);
      await user.clear(passwordInput);

      expect(
        await screen.findByText(/Firstname is required/i)
      ).toBeInTheDocument();
      expect(await screen.findByText(/Please provide a valid email address./i));
      expect(
        await screen.findByText(/Password must be at least 6 characters long./i)
      );
    });
  });

  describe("Form Submission", () => {
    it("should call the onSubmit with valid data", async () => {
      (api.auth.signUp as jest.Mock).mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ success: true }), 100)
          )
      );

      render(<SignUpForm />);

      const firstNameInput = screen.getByLabelText(/ชื่อจริง/i);
      const lastNameInput = screen.getByLabelText(/นามสกุล/i);
      const emailInput = screen.getByLabelText(/อีเมล/i);
      const passwordInput = screen.getByLabelText(/รหัสผ่าน/i);
      const submitButton = screen.getByRole("button", { name: /ลงทะเบียน/i });

      await user.type(firstNameInput, "John");
      await user.type(lastNameInput, "Doe");
      await user.type(emailInput, "johndoe@example.com");
      await user.type(passwordInput, "Ppassword123456!");
      await user.click(submitButton);

      expect(screen.getByText(/กำลังโหลด.../i)).toBeInTheDocument();
      expect(api.auth.signUp).toHaveBeenCalled();
      expect(api.auth.signUp).toHaveBeenCalledWith({
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@example.com",
        password: "Ppassword123456!",
      });
    });
  });

  describe("Form Success Handling", () => {
    it("should render a toast message and redirect to homepage", async () => {
      const mockRefreshUser = jest.fn().mockResolvedValue(undefined);

      (useAuth as jest.Mock).mockReturnValue({
        refreshUser: mockRefreshUser,
        // ใส่ค่าอื่นๆ ที่จำเป็นต้องใช้ใน Component
        loading: false,
        user: null,
      });

      (api.auth.signUp as jest.Mock).mockResolvedValue({ success: true });

      render(<SignUpForm />);

      const firstNameInput = screen.getByLabelText(/ชื่อจริง/i);
      const lastNameInput = screen.getByLabelText(/นามสกุล/i);
      const emailInput = screen.getByLabelText(/อีเมล/i);
      const passwordInput = screen.getByLabelText(/รหัสผ่าน/i);
      const submitButton = screen.getByRole("button", { name: /ลงทะเบียน/i });

      await user.type(firstNameInput, "John");
      await user.type(lastNameInput, "Doe");
      await user.type(emailInput, "johndoe@example.com");
      await user.type(passwordInput, "Ppassword123456!");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockRefreshUser).toHaveBeenCalledTimes(1);

        expect(mockToast).toHaveBeenCalledWith("สำเร็จ", {
          description: "ลงทะเบียนและเข้าสู่ระบบสำเร็จ",
        });
        expect(mockRouter.push).toHaveBeenCalledWith(ROUTES.HOME);
      });
    });
  });

  describe("Form Failure Handing", () => {
    it("should render a toast message and do not redirect to homepage", async () => {
      (api.auth.signUp as jest.Mock).mockResolvedValueOnce({ success: false });

      render(<SignUpForm />);

      const firstNameInput = screen.getByLabelText(/ชื่อจริง/i);
      const lastNameInput = screen.getByLabelText(/นามสกุล/i);
      const emailInput = screen.getByLabelText(/อีเมล/i);
      const passwordInput = screen.getByLabelText(/รหัสผ่าน/i);
      const submitButton = screen.getByRole("button", { name: /ลงทะเบียน/i });

      await user.type(firstNameInput, "John");
      await user.type(lastNameInput, "Doe");
      await user.type(emailInput, "johndoe@example.com");
      await user.type(passwordInput, "Ppassword123456!");
      await user.click(submitButton);

      expect(mockToast).toHaveBeenCalledWith("เกิดข้อผิดพลาด", {
        description: "กรุณาตรวจสอบข้อมูลอีกครั้ง",
      });
      expect(mockRouter.push).not.toHaveBeenCalled();
    });

    it("should display the error message from API", async () => {
      (api.auth.signUp as jest.Mock).mockResolvedValueOnce({
        success: false,
        error: {
          message: "Internal server error",
        },
      });

      render(<SignUpForm />);

      const firstNameInput = screen.getByLabelText(/ชื่อจริง/i);
      const lastNameInput = screen.getByLabelText(/นามสกุล/i);
      const emailInput = screen.getByLabelText(/อีเมล/i);
      const passwordInput = screen.getByLabelText(/รหัสผ่าน/i);
      const submitButton = screen.getByRole("button", { name: /ลงทะเบียน/i });

      await user.type(firstNameInput, "John");
      await user.type(lastNameInput, "Doe");
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
