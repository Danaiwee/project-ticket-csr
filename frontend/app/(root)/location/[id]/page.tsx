import Booking from "@/components/Booking";
import MapWrapper from "@/components/MapWrapper";
import { LOCATION_IMAGES, LOCATIONS } from "@/constants";
import { BadgeCheck, Map, MapPin } from "lucide-react";
import Image from "next/image";

const LocationPage = () => {
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

  return (
    <main className="w-full max-w-7xl mt-16 mx-auto px-4">
      <section className="flex flex-col-reverse gap-3 items-start justify-between sm:flex-row">
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

        <div className="w-full sm:w-fit flex items-center justify-end">
          <Booking location={location} />
        </div>
      </section>
      <section className="mt-10 flex flex-col gap-2 font-kanit max-w-2xl w-full">
        <h1 className="text-lg text-gray-500 font-semibold">
          รายละเอียดสถานที่ท่องเที่ยว :
        </h1>
        <p className="text-md text-gray-500">{details}</p>
      </section>

      <section className="mt-10 flex flex-col gap-2 font-kanit max-w-2xl w-full">
        <h1 className="text-lg text-gray-500 font-semibold">แผนที่ :</h1>
        <MapWrapper lat={latitude} lng={longitude} name={name} />
      </section>
    </main>
  );
};

export default LocationPage;
