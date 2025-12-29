import DataRenderer from "@/components/DataRenderer";
import LocalSearchbar from "@/components/LocalSearchbar";
import LocationCard from "@/components/LocationCard";
import Pagination from "@/components/Pagination";
import { LOCATIONS } from "@/constants";
import { DEFAULT_EMPTY } from "@/constants/empty";
import { ROUTES } from "@/constants/routes";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "TicketSpace - หน้าหลัก",
  description:
    "สัมผัสประสบการณ์ใหม่ในการจองสถานที่ท่องเที่ยวกับ TicketSpace ระบบที่เชื่อมโยงคุณกับสถานที่ต่างๆ พร้อมเช็คที่ว่างแบบเรียลไทม์ จองง่าย ได้ที่แน่นอน หมดกังวลเรื่องการจองซ้ำซ้อน",
};

const HomePage = () => {
  const locations = LOCATIONS;
  const success = true;
  const isNext = false;

  return (
    <section className="w-full h-full">
      <div className="relative w-full h-full">
        <Image
          src="/images/background2.png"
          alt="Hero image"
          width={1000}
          height={1000}
          priority
          className="w-full h-70 object-cover object-center"
        />

        <div className="relative -top-8 w-full max-w-4xl mx-auto px-4">
          <LocalSearchbar route={ROUTES.HOME} placeholder="ค้นหาชื่อสถานที่" />
        </div>
      </div>

      <div className="mt-10 w-full max-w-7xl flex flex-col p-5 sm:p-8 md:px-20 xl:px-0 mx-auto">
        <h1 className="font-kanit text-gray-500 text-2xl">
          สถานที่ท่องเที่ยวทั้งหมด
        </h1>

        <DataRenderer
          success={success}
          data={locations}
          empty={DEFAULT_EMPTY}
          render={(locations) => (
            <div className="mt-12 flex flex-wrap gap-5">
              {locations.map((location: LocationData) => (
                <LocationCard key={location.id} location={location} />
              ))}
            </div>
          )}
        />

        <Pagination isNext={isNext} page={1} />
      </div>
    </section>
  );
};

export default HomePage;
