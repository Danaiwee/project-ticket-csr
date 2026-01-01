import AdminLocations from "@/components/AdminLocations";
import HeaderBox from "@/components/HeaderBox";
import LocalSearchbar from "@/components/LocalSearchbar";
import { ROUTES } from "@/constants/routes";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TicketSpace | Admin",
  description: "ดูรายการและจัดการการจองสถานทีท่องเที่ยวทั้งหมด",
};

const AdminPage = async () => {
  return (
    <section className="w-full mx-auto max-w-7xl">
      <div className="flex h-full w-full flex-col gap-8 mt-14 font-kanit">
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

        <AdminLocations />
      </div>
    </section>
  );
};

export default AdminPage;
