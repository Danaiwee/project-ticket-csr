"use client";

import StateSkeleton from "./StateSkeleton";
import { DEFAULT_EMPTY } from "@/constants/empty";
import { LOCATION_IMAGES } from "@/constants";
import Image from "next/image";
import { MapPin, BadgeCheck, Map } from "lucide-react";
import AdminLocationBookings from "./AdminLocationBookings";
import AdminSetting from "./AdminSetting";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Loading from "./Loading";
import { ROUTES } from "@/constants/routes";
import logger from "@/lib/logger";

const AdminLocationDetails = () => {
  const params = useParams();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [limitBookingData, setLimitBookingData] = useState(0);

  const locationId = params.id;
  if (!locationId) router.push(ROUTES.HOME);

  const getLocation = async () => {
    setIsLoading(true);
    try {
      const { success, data } = (await api.locations.getLocation(
        locationId as string
      )) as ActionResponse<{ location: LocationData }>;

      if (success) {
        setLocation(data?.location || null);
        setSuccess(success);
        setLimitBookingData(data?.location.limitBooking || 0);
      }
    } catch (error) {
      logger.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getLocation();
  }, []);

  if (isLoading) return <Loading />;

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
    <>
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
          <AdminSetting
            locationId={locationId as string}
            limitBooking={limitBooking}
            setLimitBooking={setLimitBookingData}
          />
        </div>
      </section>

      <AdminLocationBookings limitBooking={limitBookingData} />
    </>
  );
};

export default AdminLocationDetails;
