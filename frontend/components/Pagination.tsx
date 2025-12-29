"use client";
import { useRouter, useSearchParams } from "next/navigation";

import { formUrlQuery } from "@/lib/url";
import { Button } from "./ui/button";

interface PaginationProps {
  page: number;
  isNext: boolean;
}

const Pagination = ({ page = 1, isNext }: PaginationProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleNavigation = (type: "prev" | "next") => {
    const nextPageNumber =
      type === "prev" ? Number(page) - 1 : Number(page) + 1;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: nextPageNumber.toString(),
    });

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="flex w-full items-center justify-center gap-3 mt-10">
      <Button
        className="flex h-10 w-20 items-center justify-center gap-2 border bg-blue-gradient"
        onClick={() => handleNavigation("prev")}
        disabled={Number(page) <= 1}
      >
        <p className="font-semibold text-white font-kanit">ก่อนหน้า</p>
      </Button>

      <div className="flex items-center justify-center rounded-md px-3.5 py-2">
        <p className="font-bold text-gray-500 text-md">{page}</p>
      </div>

      <Button
        className="flex h-10 w-20 items-center justify-center gap-2 border bg-blue-gradient"
        onClick={() => handleNavigation("next")}
        disabled={!isNext}
      >
        <p className="font-semibold text-white font-kanit">ถัดไป</p>
      </Button>
    </div>
  );
};

export default Pagination;
