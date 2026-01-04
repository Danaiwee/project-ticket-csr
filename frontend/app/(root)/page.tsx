import DataRenderer from "@/components/DataRenderer";
import LocalSearchbar from "@/components/LocalSearchbar";
import LocationCard from "@/components/LocationCard";
import Pagination from "@/components/Pagination";
import { DEFAULT_EMPTY } from "@/constants/empty";
import { ROUTES } from "@/constants/routes";
import { api } from "@/lib/api";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "TicketSpace | หน้าหลัก",
  description:
    "สัมผัสประสบการณ์ใหม่ในการจองสถานที่ท่องเที่ยวกับ TicketSpace ระบบที่เชื่อมโยงคุณกับสถานที่ต่างๆ พร้อมเช็คที่ว่าง จองง่าย ได้ที่แน่นอน หมดกังวลเรื่องการจองซ้ำซ้อน",
};

const HomePage = async ({ searchParams }: RouteParams) => {
  const { page, pageSize, query } = await searchParams;

  const { success, data, error } = (await api.locations.getAll({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
  })) as ActionResponse<PaginatedLocations>;
  const { locations, isNext } = data || {};

  return (
    <section className="w-full h-full">
      <div className="relative w-full h-full">
        <div className="relative w-full h-70">
          <Image
            src="/images/background2.png"
            alt="Hero image"
            fill
            priority
            className="object-cover object-center"
          />
        </div>

        <div className="relative -top-8 w-full max-w-4xl mx-auto px-4">
          <LocalSearchbar route={ROUTES.HOME} placeholder="ค้นหาชื่อสถานที่" />
        </div>
      </div>

      <div className="mt-10 w-full max-w-7xl flex flex-col px-4 md:px-20 xl:px-0 mx-auto">
        <h1 className="font-kanit text-gray-500 text-3xl font-semibold">
          สถานที่ท่องเที่ยวทั้งหมด
        </h1>

        <DataRenderer
          success={success}
          data={locations}
          empty={DEFAULT_EMPTY}
          error={error}
          render={(locations) => (
            <div className="mt-12 flex flex-wrap gap-5">
              {locations.map((location: LocationData) => (
                <LocationCard key={location.id} location={location} />
              ))}
            </div>
          )}
        />

        <Pagination isNext={isNext || false} page={Number(page) || 1} />
      </div>
    </section>
  );
};

export default HomePage;
