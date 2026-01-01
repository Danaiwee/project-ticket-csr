"use client";

import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import DataRenderer from "./DataRenderer";
import { DEFAULT_EMPTY } from "@/constants/empty";
import BookingCard from "./BookingCard";
import Pagination from "./Pagination";
import { formatAdminDate } from "@/lib/utils";
import Loading from "./Loading";

interface AdminLocationBookingsProps {
  limitBooking: number;
}

const AdminLocationBookings = ({
  limitBooking,
}: AdminLocationBookingsProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  const { user, loading: authLoading } = useAuth();

  const page = searchParams.get("page");
  const date = searchParams.get("date");
  const locationId = params.id as string;

  const dateData = date || format(new Date(), "yyyy-MM-dd");

  const [success, setSuccess] = useState(false);
  const [bookingData, setBookingData] = useState<Booking[] | null>(null);
  const [isNext, setIsNext] = useState(false);
  const [dataError, setDataError] = useState<ErrorResponse | null | undefined>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const fetchLocationBookings = async () => {
    try {
      const { success, data, error } = (await api.admin.getLocationBookings({
        page: Number(page) || 1,
        pageSize: 10,
        date: dateData,
        locationId,
      })) as ActionResponse<AdminLocationBookingsResponse>;

      if (success) {
        setSuccess(success);
        setBookingData(data?.bookings || []);
        setIsNext(data?.isNext || false);
      } else {
        setDataError(error);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(ROUTES.SIGN_IN);
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    setIsLoading(true);
    fetchLocationBookings();
  }, [user, page, date]);

  if (authLoading || isLoading) return <Loading />;

  const isAdmin = user?.role === "ADMIN";
  if (!isAdmin) router.push(ROUTES.HOME);

  const formattedDate = formatAdminDate(dateData);
  const numberOfBookings = bookingData?.length || 0;

  return (
    <>
      <section className=" mt-10 flex flex-col gap-2 font-kanit w-full">
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between w-full">
          <h1 className="text-xl text-gray-500 font-semibold">
            {`รายการจองสำหรับวันที่: ${formattedDate}`}
          </h1>

          <p className="text-lg text-sky-600">
            {`จำนวนการจองทั้งหมด ${numberOfBookings}/${limitBooking} ที่`}
          </p>
        </div>
      </section>
      <section className="w-full max-4xl mt-5 sm:mt-20">
        <DataRenderer
          success={success}
          data={bookingData}
          empty={DEFAULT_EMPTY}
          error={dataError}
          render={(bookings) => (
            <div className="flex flex-col w-full max-w-4xl gap-5 px-4">
              {bookings.map((booking: Booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onSuccess={fetchLocationBookings}
                />
              ))}
            </div>
          )}
        />

        <Pagination isNext={isNext || false} page={Number(page) || 1} />
      </section>
    </>
  );
};

export default AdminLocationBookings;
