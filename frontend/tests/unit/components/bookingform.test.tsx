import { screen, render, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import BookingForm from "@/components/BookingForm";
import { api } from "@/lib/api";
import { mockRouter, mockToast, resetAllMocks } from "@/tests/mocks";
import { AUTHUSER, LOCATIONS } from "@/constants";
import { format } from "date-fns";

import { useAuth } from "@/context/AuthContext";
jest.mock("@/context/AuthContext");

const userClient = userEvent.setup();

describe("Create Booking Form", () => {
  beforeEach(() => {
    resetAllMocks();

    (useAuth as jest.Mock).mockReturnValue({
      user: AUTHUSER,
      loading: false,
    });
  });

  const location = LOCATIONS[0];

  describe("Rendering", () => {
    it("should display all the required field", async () => {
      render(<BookingForm location={location} />);

      const openButton = screen.getByRole("button", { name: /จองตั๋วเข้าชม/i });
      await userClient.click(openButton);

      expect(screen.getByLabelText(/วันที่ต้องการเข้าชม/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/จำนวนผู้เข้าชม/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/ราคารวมทั้งสิ้น/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/หมายเหตุเพิ่มเติม/i)).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /ยืนยันการจอง/i })
      ).toBeInTheDocument();
    });
  });

  describe("Form Validation", () => {
    it("should render the error message if invalid input", async () => {
      render(<BookingForm location={location} />);

      const openButton = screen.getByRole("button", { name: /จองตั๋วเข้าชม/i });
      await userClient.click(openButton);

      const numOfPeopleInput = screen.getByLabelText(/จำนวนผู้เข้าชม/i);
      const submitButton = screen.getByRole("button", {
        name: /ยืนยันการจอง/i,
      });

      await userClient.type(numOfPeopleInput, "1500");
      await userClient.click(submitButton);

      expect(
        await screen.findByText(/Maximum 50 people per booking/i)
      ).toBeInTheDocument();

      await userClient.clear(numOfPeopleInput);
      await userClient.click(submitButton);

      expect(
        await screen.findByText(/At least 1 person is required/i)
      ).toBeInTheDocument();
    });
  });

  describe("Form Submission", () => {
    it("should call onSubmit with valid data", async () => {
      (api.booking.getAvaliable as jest.Mock).mockResolvedValue({
        success: true,
        data: { available: 20, isFull: false },
      });

      const mockCreate = api.booking.createBooking as jest.Mock;
      mockCreate.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ success: true }), 200)
          )
      );

      const newDate = format(new Date(), "yyyy-MM-dd");

      render(<BookingForm location={location} />);

      const openButton = screen.getByRole("button", { name: /จองตั๋วเข้าชม/i });
      await userClient.click(openButton);

      const dateInput = screen.getByLabelText(/วันที่ต้องการเข้าชม/i);
      const numOfPeopleInput = screen.getByLabelText(/จำนวนผู้เข้าชม/i);
      const submitButton = screen.getByRole("button", {
        name: /ยืนยันการจอง/i,
      });

      fireEvent.change(dateInput, { target: { value: newDate } });
      fireEvent.change(numOfPeopleInput, { target: { value: 5 } });

      await userClient.click(submitButton);

      expect(await screen.findByText(/กำลังโหลด.../i)).toBeInTheDocument();
      expect(mockCreate).toHaveBeenCalled();
      expect(mockCreate).toHaveBeenCalledWith("1234", {
        bookingDate: newDate,
        numOfPeople: 5,
        totalPrice: 500,
        remarks: "",
      });
    });
  });

  describe("Form Success Handling", () => {
    it("should render a toast message and redirect to homepage", async () => {
      (api.booking.getAvaliable as jest.Mock).mockResolvedValue({
        success: true,
        data: { available: 20, isFull: false },
      });

      const mockCreate = api.booking.createBooking as jest.Mock;
      mockCreate.mockRejectedValueOnce({ success: true });

      const newDate = format(new Date(), "yyyy-MM-dd");

      render(<BookingForm location={location} />);

      const openButton = screen.getByRole("button", { name: /จองตั๋วเข้าชม/i });
      await userClient.click(openButton);

      const dateInput = screen.getByLabelText(/วันที่ต้องการเข้าชม/i);
      const numOfPeopleInput = screen.getByLabelText(/จำนวนผู้เข้าชม/i);
      const submitButton = screen.getByRole("button", {
        name: /ยืนยันการจอง/i,
      });

      fireEvent.change(dateInput, { target: { value: newDate } });
      fireEvent.change(numOfPeopleInput, { target: { value: 5 } });

      await userClient.click(submitButton);

      expect(mockToast).toHaveBeenCalledWith("สำเร็จ", {
        description: "ระบบได้จองตั๋วให้คุณแล้ว",
      });
      expect(mockRouter.refresh).toHaveBeenCalled();
    });
  });

  describe("Form Failure Handling", () => {
    it("should show the toast message if numOfPeople > available", async () => {
      (api.booking.getAvaliable as jest.Mock).mockResolvedValue({
        success: true,
        data: { available: 1, isFull: false },
      });

      const mockCreate = api.booking.createBooking as jest.Mock;
      mockCreate.mockRejectedValueOnce({ success: true });

      const newDate = format(new Date(), "yyyy-MM-dd");

      render(<BookingForm location={location} />);

      const openButton = screen.getByRole("button", { name: /จองตั๋วเข้าชม/i });
      await userClient.click(openButton);

      const dateInput = screen.getByLabelText(/วันที่ต้องการเข้าชม/i);
      const numOfPeopleInput = screen.getByLabelText(/จำนวนผู้เข้าชม/i);
      const submitButton = screen.getByRole("button", {
        name: /ยืนยันการจอง/i,
      });

      fireEvent.change(dateInput, { target: { value: newDate } });
      fireEvent.change(numOfPeopleInput, { target: { value: 5 } });

      await userClient.click(submitButton);

      expect(mockToast).toHaveBeenCalledWith("ขออภัย", {
        description: "จำนวนที่ว่างไม่พอสำหรับการจอง",
      });
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it("should show the toast message if failed", async () => {
      (api.booking.getAvaliable as jest.Mock).mockResolvedValue({
        success: true,
        data: { available: 10, isFull: false },
      });

      const mockCreate = api.booking.createBooking as jest.Mock;
      mockCreate.mockRejectedValueOnce({
        success: false,
        error: { message: "ไม่สามารถเชื่อมต่อกับระบบได้ กรุณาลองใหม่ภายหลัง" },
      });

      const newDate = format(new Date(), "yyyy-MM-dd");

      render(<BookingForm location={location} />);

      const openButton = screen.getByRole("button", { name: /จองตั๋วเข้าชม/i });
      await userClient.click(openButton);

      const dateInput = screen.getByLabelText(/วันที่ต้องการเข้าชม/i);
      const numOfPeopleInput = screen.getByLabelText(/จำนวนผู้เข้าชม/i);
      const submitButton = screen.getByRole("button", {
        name: /ยืนยันการจอง/i,
      });

      fireEvent.change(dateInput, { target: { value: newDate } });
      fireEvent.change(numOfPeopleInput, { target: { value: 5 } });

      await userClient.click(submitButton);

      expect(mockToast).toHaveBeenCalledWith("ขออภัย", {
        description: "ไม่สามารถเชื่อมต่อกับระบบได้ กรุณาลองใหม่ภายหลัง",
      });
      expect(mockCreate).toHaveBeenCalled();
    });
  });
});
