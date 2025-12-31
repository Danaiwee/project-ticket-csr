import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import CancelBooking from "@/components/CancelBooking";
import { mockRouter, mockToast, resetAllMocks } from "@/tests/mocks";
import { api } from "@/lib/api";

const user = userEvent.setup();

describe("Cancel Booking Component", () => {
  beforeEach(() => {
    resetAllMocks();
  });

  const bookingId = "1234";

  describe("Rendering", () => {
    it("should display the cancel button", () => {
      render(<CancelBooking bookingId={bookingId} />);

      expect(screen.getByRole("button", { name: /ยกเลิกการจอง/i }));
    });

    it("should display an alertbox", async () => {
      render(<CancelBooking bookingId={bookingId} />);

      const cancelButton = screen.getByRole("button", {
        name: /ยกเลิกการจอง/i,
      });

      await user.click(cancelButton);

      expect(
        screen.getByText(/คุณต้องการที่จะยกเลิกการจอง?/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/กรุณากดยืนยันหากต้องการที่จะยกเลิกการจอง/i)
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /ยกเลิก/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /ยืนยัน/i })
      ).toBeInTheDocument();
    });
  });

  describe("Submission", () => {
    it("should call the function with valid data", async () => {
      const mockCancelBooking = api.booking.cancelBooking as jest.Mock;

      render(<CancelBooking bookingId={bookingId} />);

      const cancelButton = screen.getByRole("button", {
        name: /ยกเลิกการจอง/i,
      });
      await user.click(cancelButton);

      const confirmButton = screen.getByRole("button", { name: /ยืนยัน/i });
      await user.click(confirmButton);

      expect(mockCancelBooking).toHaveBeenCalled();
      expect(mockCancelBooking).toHaveBeenCalledWith(bookingId);
    });
  });

  describe("Success Handling", () => {
    it("should show a toast message and call refresh router", async () => {
      const mockCancelBooking = api.booking.cancelBooking as jest.Mock;
      mockCancelBooking.mockResolvedValueOnce({ success: true });

      render(<CancelBooking bookingId={bookingId} />);

      const cancelButton = screen.getByRole("button", {
        name: /ยกเลิกการจอง/i,
      });
      await user.click(cancelButton);

      const confirmButton = screen.getByRole("button", { name: /ยืนยัน/i });
      await user.click(confirmButton);

      expect(mockCancelBooking).toHaveBeenCalledWith(bookingId);
      expect(mockToast).toHaveBeenCalledWith("สำเร็จ", {
        description: "ยกเลิกการจองสำเร็จ",
      });
      expect(mockRouter.refresh).toHaveBeenCalled();
    });
  });

  describe("Failure Handling", () => {
    it("should show a toast message and do not call refresh router", async () => {
      const mockCancelBooking = api.booking.cancelBooking as jest.Mock;
      mockCancelBooking.mockResolvedValueOnce({
        success: false,
        error: { message: "ไม่สามารถเชื่อมต่อกับระบบได้ กรุณาลองใหม่ภายหลัง" },
      });

      render(<CancelBooking bookingId={bookingId} />);

      const cancelButton = screen.getByRole("button", {
        name: /ยกเลิกการจอง/i,
      });
      await user.click(cancelButton);

      const confirmButton = screen.getByRole("button", { name: /ยืนยัน/i });
      await user.click(confirmButton);

      expect(mockCancelBooking).toHaveBeenCalledWith(bookingId);
      expect(mockToast).toHaveBeenCalledWith("เกิดข้อผิดพลาด", {
        description: "ไม่สามารถเชื่อมต่อกับระบบได้ กรุณาลองใหม่ภายหลัง",
      });
      expect(mockRouter.refresh).not.toHaveBeenCalled();
    });
  });
});
