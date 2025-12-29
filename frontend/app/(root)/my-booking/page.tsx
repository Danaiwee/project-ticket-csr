import BookingCard from "@/components/BookingCard";
import DataRenderer from "@/components/DataRenderer";
import HeaderBox from "@/components/HeaderBox";
import Pagination from "@/components/Pagination";
import { AUTHUSER, BOOKINGS } from "@/constants";
import { DEFAULT_EMPTY } from "@/constants/empty";

const BookingPage = () => {
  const user = AUTHUSER;

  const bookings = BOOKINGS;
  const success = true;
  const isNext = false;

  return (
    <section className="w-full mx-auto max-w-7xl">
      <div className="flex h-full max-h-screen w-full flex-col gap-8  p-8 xl:py-12 font-kanit">
        <HeaderBox
          title="ยินดีต้อนรับ"
          user={user}
          subtext="ดูรายละเอียดและจัดการการจองของคุณ"
          type="greeting"
        />
      </div>

      <div className="w-full max-w-4xl">
        <DataRenderer
          success={success}
          data={bookings}
          empty={DEFAULT_EMPTY}
          render={(bookings) => (
            <div className="flex flex-col w-full max-w-4xl gap-5 px-4">
              {bookings.map((booking: Booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          )}
        />

        <Pagination isNext={isNext} page={1} />
      </div>
    </section>
  );
};

export default BookingPage;
