import { screen, render } from "@testing-library/react";

import BookingCard from "@/components/BookingCard";
import { resetAllMocks } from "@/tests/mocks";
import { BOOKINGS } from "@/constants";
import { formatBookingDate } from "@/lib/utils";
import userEvent from "@testing-library/user-event";

const user = userEvent.setup();

describe("Booking Card Component", () => {
  beforeEach(() => {
    resetAllMocks();
  });

  const bookingData = BOOKINGS[0];
  const onSuccess = jest.fn();

  describe("Rendering", () => {
    it("should render the trigger field", () => {
      render(<BookingCard booking={bookingData} onSuccess={onSuccess} />);

      const id = bookingData.id.slice(-7).toUpperCase();
      const expectedDate = formatBookingDate(bookingData.bookingDate);

      expect(screen.getByText(id)).toBeInTheDocument();
      expect(screen.getByText(expectedDate)).toBeInTheDocument();
      expect(screen.getByText(/ถ้ำหลวงขุนน้ำนางนอน/i)).toBeInTheDocument();
    });

    it("should render the content field", async () => {
      render(<BookingCard booking={bookingData} onSuccess={onSuccess} />);

      const trigger = screen.getByRole("button", { name: /เลขที่จอง/i });
      await user.click(trigger);

      expect(screen.getByText("2 คน")).toBeInTheDocument();
      expect(screen.getByText("200 บาท")).toBeInTheDocument();
      expect(
        screen.getByText(/ขอไกด์นำเที่ยวที่พูดภาษาอังกฤษได้/i)
      ).toBeInTheDocument();
    });
  });
});
