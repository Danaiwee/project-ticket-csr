import AdminLocationBookings from "@/components/AdminLocationBookings";
import AdminSetting from "@/components/AdminSetting";
import StateSkeleton from "@/components/StateSkeleton";
import { LOCATION_IMAGES } from "@/constants";
import { DEFAULT_EMPTY } from "@/constants/empty";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { BadgeCheck, Map, MapPin } from "lucide-react";
import Image from "next/image";

export async function generateMetadata({ params }: RouteParams) {
  const { id } = await params;
  const { data } = (await api.locations.getLocation(id)) as ActionResponse<{
    location: LocationData;
  }>;

  return {
    title: `TicketSpace | ${data?.location?.name || "สถานที่"} `,
    description: data?.location?.details?.slice(0, 160),
  };
}

const AdminBookingPage = async ({ params }: RouteParams) => {
  const { id: locationId } = await params;

  const { success, data } = (await api.locations.getLocation(
    locationId
  )) as ActionResponse<{ location: LocationData }>;
  const { location } = data || {};

  if (!success || !location) {
    return (
      <StateSkeleton
        image={{
          light: "/images/light-illustration.png",
          alt: "Empty state illustration",
        }}
        title={DEFAULT_EMPTY.title}
        message={DEFAULT_EMPTY.message}
      />
    );
  }

  const { name, typeName, province, district, importance, limitBooking } =
    location;
  const imageSrc = LOCATION_IMAGES[typeName] || "/images/forest.jpg";

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
          <AdminSetting locationId={locationId} limitBooking={limitBooking} />
        </div>
      </section>

      <AdminLocationBookings limitBooking={limitBooking} />
    </main>
  );
};

export default AdminBookingPage;
