import { formatBookingDate } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import CancelBooking from "./CancelBooking";

interface BookingProps {
  booking: Booking;
}

const BookingCard = ({ booking }: BookingProps) => {
  const { id, location, bookingDate, numOfPeople, totalPrice, remarks } =
    booking;
  const { name } = location;

  const dateBooking = formatBookingDate(bookingDate);
  const formattedRemarks = remarks ? remarks : "-";

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full border-b border-gray-100"
    >
      <AccordionItem value={id} className="border px-4 rounded-lg">
        <AccordionTrigger>
          <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between font-kanit">
            <div className="flex-1 flex gap-1">
              <h3 className="text-gray-900 text-[17px] font-semibold">
                เลขที่จอง:{" "}
              </h3>
              <p className="text-gray-500 text-[17px] uppercase">{id}</p>
            </div>

            <div className="flex-1 flex gap-1">
              <h3 className="text-gray-900 text-[17px] font-semibold">
                วันที่:{" "}
              </h3>
              <p className="text-gray-500 text-[17px] uppercase">
                {dateBooking}
              </p>
            </div>

            <div className="flex-2 flex gap-1">
              <h3 className="text-gray-900 text-[17px] font-semibold">
                สถานที่:{" "}
              </h3>
              <p className="text-gray-500 text-[17px] uppercase">{name}</p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="sm:mt-3">
          <div className="flex flex-col">
            <div className="w-full flex flex-col sm:flex-row sm:items-center justify-evenly px-0 font-kanit gap-1 pr-8">
              <div className="flex-1 flex gap-1">
                <h3 className="text-gray-900 text-[17px] font-semibold">
                  จำนคน:{" "}
                </h3>
                <p className="text-gray-500 text-[17px] uppercase">{`${numOfPeople} คน`}</p>
              </div>

              <div className="flex-1 flex gap-1">
                <h3 className="text-gray-900 text-[17px] font-semibold">
                  ราคารวม:{" "}
                </h3>
                <p className="text-gray-500 text-[17px] uppercase">{`${totalPrice} บาท`}</p>
              </div>

              <div className="flex-2 flex gap-1">
                <h3 className="text-gray-900 text-[17px] font-semibold">
                  หมายเหตุ:{" "}
                </h3>
                <p className="text-gray-500 text-[17px] uppercase">
                  {formattedRemarks}
                </p>
              </div>
            </div>

            <div className="flex-1 w-full flex items-center justify-end mt-5 pr-4">
              <CancelBooking bookingId={id} />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default BookingCard;
