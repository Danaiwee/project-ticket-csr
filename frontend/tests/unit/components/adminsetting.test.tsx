import { screen, render, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import AdminSetting from "@/components/AdminSetting";
import { mockRouter, mockToast, resetAllMocks } from "@/tests/mocks";
import { format, addDays } from "date-fns";
import { api } from "@/lib/api";

const user = userEvent.setup();

describe("Admin Setting", () => {
  beforeEach(() => {
    resetAllMocks();
  });

  const locationId = "1234";
  const limitBooking = 10;

  describe("Redndering", () => {
    it("should render all the fields", async () => {
      render(
        <AdminSetting locationId={locationId} limitBooking={limitBooking} />
      );

      expect(screen.getByLabelText(/กรุณาเลือกวันที่/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/จำนวนสูงสุดต่อวัน:/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /แก้ไข/i }));
    });
  });

  describe("URL state management", () => {
    it("should update the url date with selected date", () => {
      render(
        <AdminSetting locationId={locationId} limitBooking={limitBooking} />
      );

      const triggerButton = screen.getByRole("button", {
        name: /กรุณาเลือกวันที่/i,
      });
      fireEvent.click(triggerButton);

      const dayButton = screen.getByText("15");
      fireEvent.click(dayButton);

      expect(mockRouter.push).toHaveBeenCalled();

      expect(mockRouter.push).toHaveBeenCalledWith(
        expect.stringContaining("mocked-url-with-date="),
        expect.any(Object)
      );
    });
  });

  describe("Form Submission", () => {
    it("should call onSubmit with valid data", async () => {
      const mockUpdateLimit = api.admin.updateLimit as jest.Mock;

      render(
        <AdminSetting locationId={locationId} limitBooking={limitBooking} />
      );

      const limitInput = screen.getByLabelText(/จำนวนสูงสุดต่อวัน:/i);
      const submitButton = screen.getByRole("button", { name: /แก้ไข/i });

      fireEvent.change(limitInput, { target: { value: 50 } });
      await user.click(submitButton);

      expect(mockUpdateLimit).toHaveBeenCalled();
      expect(mockUpdateLimit).toHaveBeenCalledWith(locationId, 50);
    });
  });

  describe("Form Success Hanling", () => {
    it("should show a toast message when succeed", async () => {
      const mockUpdateLimit = api.admin.updateLimit as jest.Mock;
      mockUpdateLimit.mockResolvedValueOnce({ success: true });

      render(
        <AdminSetting locationId={locationId} limitBooking={limitBooking} />
      );

      const limitInput = screen.getByLabelText(/จำนวนสูงสุดต่อวัน:/i);
      const submitButton = screen.getByRole("button", { name: /แก้ไข/i });

      fireEvent.change(limitInput, { target: { value: 50 } });
      await user.click(submitButton);

      expect(mockUpdateLimit).toHaveBeenCalled();
      expect(mockToast).toHaveBeenCalledWith("สำเร็จ", {
        description: "ทำการอัพเดทข้อมูลในระบบสำเร็จ",
      });
      expect(mockRouter.refresh).toHaveBeenCalled();
    });
  });

  describe("Form Failure Hanling", () => {
    it("should show a toast message when succeed", async () => {
      const mockUpdateLimit = api.admin.updateLimit as jest.Mock;
      mockUpdateLimit.mockResolvedValueOnce({
        success: false,
        error: { message: "ะบบไม่สามารถอัพเดทข้อมูลนี้" },
      });

      render(
        <AdminSetting locationId={locationId} limitBooking={limitBooking} />
      );

      const limitInput = screen.getByLabelText(/จำนวนสูงสุดต่อวัน:/i);
      const submitButton = screen.getByRole("button", { name: /แก้ไข/i });

      fireEvent.change(limitInput, { target: { value: 1 } });
      await user.click(submitButton);

      expect(mockUpdateLimit).toHaveBeenCalled();
      expect(mockToast).toHaveBeenCalledWith("ขออภัย", {
        description: "ะบบไม่สามารถอัพเดทข้อมูลนี้",
      });
      expect(mockRouter.refresh).not.toHaveBeenCalled();
    });
  });
});
