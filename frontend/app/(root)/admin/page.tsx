"use client";

import AdminLocations from "@/components/AdminLocations";
import HeaderBox from "@/components/HeaderBox";
import Loading from "@/components/Loading";
import LocalSearchbar from "@/components/LocalSearchbar";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AdminPage = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user?.role !== "ADMIN") {
      router.push(ROUTES.HOME);
    }
  }, [user, loading, router]);

  if (loading) return <Loading />;

  if (user?.role !== "ADMIN") return null;
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
