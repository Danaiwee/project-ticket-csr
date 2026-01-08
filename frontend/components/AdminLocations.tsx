"use client";

import { DEFAULT_EMPTY } from "@/constants/empty";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import DataRenderer from "./DataRenderer";
import LocationCard from "./LocationCard";
import Pagination from "./Pagination";
import logger from "@/lib/logger";

const AdminLocations = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = searchParams.get("page");
  const query = searchParams.get("query");

  const { user, loading: authLoading } = useAuth();

  const [success, setSuccess] = useState<boolean>(false);
  const [locationData, setLocationData] = useState<
    LocationData[] | null | undefined
  >(null);
  const [isNext, setIsNext] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dataError, setDataError] = useState<any>(null);

  const fetchLocations = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const { success, data, error } = (await api.locations.getAll({
        page: Number(page) || 1,
        pageSize: 10,
        query: query || "",
      })) as ActionResponse<PaginatedLocations>;

      if (success) {
        setSuccess(success || false);
        setLocationData(data?.locations);
        setIsNext(data?.isNext || false);
      } else {
        setDataError(error);
      }
    } catch (err) {
      logger.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(ROUTES.SIGN_IN);
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    fetchLocations();
  }, [user, page,query]);


  if (authLoading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 w-full">
        <Loader2 className="size-10 animate-spin text-sky-500" />
        <p className="mt-2 text-gray-500">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  return (
    <div className="mt-10 -space-y-4">
      <h1 className="font-kanit text-gray-500 text-2xl">
        สถานที่ท่องเที่ยวทั้งหมด
      </h1>

      <DataRenderer
        success={success}
        data={locationData}
        empty={DEFAULT_EMPTY}
        error={dataError}
        render={(locationData) => (
          <div className="mt-12 flex flex-wrap gap-5">
            {locationData.map((location: LocationData) => (
              <Locatio  nCard key={location.id} location={location} isAdmin />
            ))}
          </div>
        )}
      />

      <Pagination isNext={isNext || false} page={Number(page) || 1} />
    </div>
  );
};

export default AdminLocations;
