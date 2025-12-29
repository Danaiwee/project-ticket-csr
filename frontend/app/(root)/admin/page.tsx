import DataRenderer from "@/components/DataRenderer";
import HeaderBox from "@/components/HeaderBox";
import LocalSearchbar from "@/components/LocalSearchbar";
import LocationCard from "@/components/LocationCard";
import Pagination from "@/components/Pagination";
import { LOCATIONS } from "@/constants";
import { DEFAULT_EMPTY } from "@/constants/empty";
import { ROUTES } from "@/constants/routes";

const AdminPage = () => {
  const locations = LOCATIONS;

  const success = true;
  const isNext = false;

  return (
    <section className="w-full mx-auto max-w-7xl">
      <div className="flex h-full max-h-screen w-full flex-col gap-8  p-8 xl:py-12 font-kanit">
        <HeaderBox
          title="ยินดีต้อนรับ Admin"
          subtext="จัดการและดูรายละเอียดการจองทั้งหมด"
        />

        <div className="w-full max-w-4xl">
          <LocalSearchbar
            route={ROUTES.DASHBOARD}
            placeholder="ค้นหาชื่อสถานที่"
          />
        </div>

        <div className="mt-10 -space-y-4">
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
                  <LocationCard key={location.id} location={location} isAdmin />
                ))}
              </div>
            )}
          />
        </div>

        <Pagination isNext={isNext} page={1} />
      </div>
    </section>
  );
};

export default AdminPage;
