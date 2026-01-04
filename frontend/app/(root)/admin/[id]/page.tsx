"use client";

import AdminLocationDetails from "@/components/AdminLocationDetails";
import Loading from "@/components/Loading";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AdminBookingPage = () => {
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
    <main className="w-full max-w-7xl mt-16 mx-auto px-4">
      <AdminLocationDetails />
    </main>
  );
};

export default AdminBookingPage;
