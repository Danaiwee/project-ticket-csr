import AdminSetting from "@/components/AdminSetting";
import BookingCard from "@/components/BookingCard";
import DataRenderer from "@/components/DataRenderer";
import Pagination from "@/components/Pagination";
import { BOOKINGS, LOCATION_IMAGES, LOCATIONS } from "@/constants";
import { DEFAULT_EMPTY } from "@/constants/empty";
import { BadgeCheck, Map, MapPin } from "lucide-react";
import Image from "next/image";

const AdminBookingPage = () => {
  const location = LOCATIONS[0];

  const {
    id,
    name,
    typeName,
    province,
    district,
    importance,
    details,
    latitude,
    longitude,
  } = location;

  const imageSrc = LOCATION_IMAGES[typeName] || "/images/forest.jpg";

  const bookings = BOOKINGS;
  const success = true;
  const isNext = false;

  return (
    <main className="w-full max-w-7xl mt-16 mx-auto px-4">
      <section className="flex flex-col gap-3 items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <Image
            src={imageSrc}
            alt="Location image"
            width={200}
            height={200}
            className="rounded-full w-30 h-30"
          />

          <div className="flex flex-col font-kanit">
            <h1 className="text-xl sm:text-2xl font-kanit text-gray-900 font-bold">
              {name}
            </h1>

            <div className="flex items-center gap-1">
              <MapPin className="size-4 text-gray-500" />
              <p className="text-md text-sky-500 font-semibold">{`${district}, ${province}`}</p>
            </div>

            <div className="mt-5 flex items-center gap-5">
              <div className="flex items-center gap-1">
                <Map className="size-4 text-gray-500" />
                <p className="text-md text-gray-500">{typeName}</p>
              </div>

              <div className="flex items-center gap-1">
                <BadgeCheck className="size-4 text-gray-500" />
                <p className="text-md text-gray-500">{importance}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-fit flex items-center justify-end mt-5 sm:mt-0">
          <AdminSetting />
        </div>
      </section>

      <section className=" mt-10 flex flex-col gap-2 font-kanit w-full">
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between w-full">
          <h1 className="text-xl text-gray-500 font-semibold">
            {`รายการจองสำหรับวันที่: 29/12/2025`}
          </h1>

          <p className="text-lg text-sky-600">
            {`จำนวนการจองทั้งหมด 10/100 ที่`}
          </p>
        </div>
      </section>

      <section className="w-full max-4xl mt-5 sm:mt-20">
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
      </section>
    </main>
  );
};

export default AdminBookingPage;
