"use client";

import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import DataRenderer from "./DataRenderer";
import { DEFAULT_EMPTY } from "@/constants/empty";
import BookingCard from "./BookingCard";
import Pagination from "./Pagination";
import { Loader2 } from "lucide-react";

const BookingDetails = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = searchParams.get("page") || 1;  
  const {user, loading: authLoading} = useAuth();  

  const [bookingsData, setbookingsData] = useState<Booking[] | null | undefined>(null);
  const [success, setSuccess] = useState(false);
  const [isNext, setIsNext] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dataError, setDataError] = useState<any>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchBooking = async () => {
    if(!user) return;
    setIsLoading(true);
    try {
        const { success, data, error } = await api.booking.getUserBookings({ 
            page: Number(page) || 1,
            pageSize: 10
        }) as ActionResponse<BookingsResponse>;

        if(success) {
            setbookingsData(data?.bookings);
            setIsNext(data?.isNext || false);
            setTotalCount(data?.totalCount || 0);
            setSuccess(true);
        } else {
            setDataError(error);
        }
    } catch (err) {
        console.log(err);
    } finally {
        setIsLoading(false);
    }
};
  
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(ROUTES.SIGN_IN);
    }
  },[user, authLoading, router])

  useEffect(() => {
    fetchBooking();
  }, [user, page])

  if (authLoading || isLoading) {
  return (
    <div className="flex flex-col items-center justify-center min-h-100 w-full">
      <Loader2 className="size-10 animate-spin text-sky-500" />
      <p className="mt-2 text-gray-500">กำลังโหลดข้อมูล...</p>
    </div>
  );
}

  return (
    <>
        <h1 className="text-md text-sky-500 flex justify-end font-semibold pr-4 sm:pr-0">
        {`คุณมีรายการจองทั้งหมด ${totalCount || 0} รายการ`}
      </h1>
      <div className="w-full max-w-4xl mt-10">
        <DataRenderer
          success={success}
          data={bookingsData}
          error={dataError}
          empty={DEFAULT_EMPTY}
          render={(bookingsData) => (
            <div className="flex flex-col w-full max-w-4xl gap-5 px-4">
              {bookingsData.map((booking: Booking) => (
                <BookingCard key={booking.id} booking={booking} onSuccess={fetchBooking} />
              ))}
            </div>
          )}
        />

        <Pagination isNext={isNext || false} page={Number(page) || 1} />
      </div>
    </>
  )
}

export default BookingDetails