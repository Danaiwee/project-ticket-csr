import BookingCard from "@/components/BookingCard";
import DataRenderer from "@/components/DataRenderer";
import HeaderBox from "@/components/HeaderBox";
import Pagination from "@/components/Pagination";
import { DEFAULT_EMPTY } from "@/constants/empty";
import { cookies } from "next/headers";
import { getSession } from "@/lib/handler/session";
import { api } from "@/lib/api";
import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";

const BookingPage = async ({ searchParams }: RouteParams) => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const { page, pageSize } = await searchParams;

  const authUser = await getSession(cookieHeader);
  if (!authUser) redirect(ROUTES.SIGN_IN);

  const { success, data, error } = (await api.booking.getUserBookings(
    {
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 10,
    },
    { headers: { Cookie: cookieHeader } }
  )) as ActionResponse<BookingsResponse>;
  const { bookings, totalCount, isNext } = data || {};

  return (
    <section className="w-full mx-auto max-w-7xl">
      <div className="flex h-full max-h-screen w-full flex-col gap-8  p-8 xl:py-12 font-kanit">
        <HeaderBox
          title="ยินดีต้อนรับ"
          user={authUser}
          subtext="ดูรายละเอียดและจัดการการจองของคุณ"
          type="greeting"
        />
      </div>

      <h1 className="text-md text-sky-500 flex justify-end font-semibold pr-4 sm:pr-0">
        {`คุณมีรายการจองทั้งหมด ${totalCount || 0} รายการ`}
      </h1>
      <div className="w-full max-w-4xl mt-10">
        <DataRenderer
          success={success}
          data={bookings}
          error={error}
          empty={DEFAULT_EMPTY}
          render={(bookings) => (
            <div className="flex flex-col w-full max-w-4xl gap-5 px-4">
              {bookings.map((booking: Booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          )}
        />

        <Pagination isNext={isNext || false} page={Number(page) || 1} />
      </div>
    </section>
  );
};

export default BookingPage;
