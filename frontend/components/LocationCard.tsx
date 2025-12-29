import { LOCATION_IMAGES } from "@/constants";
import { ROUTES } from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";

interface LocationCardProps {
  location: LocationData;
}

const LocationCard = ({ location }: LocationCardProps) => {
  const { id, name, province, typeName } = location;
  const imageSrc = LOCATION_IMAGES[typeName] || "/images/forest.jpg";

  return (
    <Link
      href={ROUTES.LOCATION(id)}
      className="bg-gray-50 w-full max-w-70 shadow-xl"
    >
      <article className="w-full flex-col items-center justify-center rounded-2xl border ">
        <Image
          src={imageSrc}
          className="w-full object-cover rounded-md h-50"
          width={200}
          height={200}
          alt="Location image"
          priority
        />

        <div className="flex flex-col pt-3 pb-3 px-4">
          <p className="text-sm font-semibold text-sky-500 font-kanit">
            {province}
          </p>

          <h1 className="h-11 text-md font-bold text-gray-700 font-kanit mt-1">
            {name}
          </h1>
          <p className="text-sm font-kanit mt-3 text-gray-500">{typeName}</p>
        </div>
      </article>
    </Link>
  );
};

export default LocationCard;
