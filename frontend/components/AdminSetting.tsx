"use client";

import { ChevronDownIcon, Loader2 } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { useCallback, useState } from "react";
import { Input } from "./ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/lib/url";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface AdminSettingProps {
  locationId: string;
  limitBooking: number;
}

function AdminSetting({ locationId, limitBooking }: AdminSettingProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const dateParam = searchParams.get("date");
  const date = dateParam ? new Date(dateParam) : new Date();

  const [open, setOpen] = useState(false);
  const [limitNumber, setLimitNumber] = useState<number>(limitBooking || 10);
  const [isLoading, setIsLoading] = useState(false);

  const handleDateSelect = useCallback(
    async (selectedDate: Date | undefined) => {
      if (selectedDate) {
        const formattedDate = format(selectedDate, "yyyy-MM-dd");

        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "date",
          value: formattedDate,
        });

        router.push(newUrl, { scroll: false });
        setOpen(false);
      }
    },
    [searchParams, router, setOpen]
  );

  const handleUpdateLimit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.admin.updateLimit(locationId, limitNumber);

      if (res.success) {
        toast("สำเร็จ", { description: "ทำการอัพเดทข้อมูลในระบบสำเร็จ" });

        router.refresh();
        return;
      }

      throw new Error(res.error?.message || "เกิดข้อผิดพลาด");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast("ขออภัย", {
        description: error.message || "ระบบไม่สามารถอัพเดทข้อมูลนี้",
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <label
        htmlFor="selected-date"
        className="text-md font-semibold text-gray-700 flex"
      >
        กรุณาเลือกวันที่
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="selected-date"
            className="w-64 justify-between font-normal py-6 text-md font-kanit -mt-0.5"
          >
            {format(date, "d MMMM yyyy", { locale: th })}
            <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar mode="single" selected={date} onSelect={handleDateSelect} />
        </PopoverContent>
      </Popover>

      <div className="flex items-center justify-end font-kanit mt-3">
        <form className="flex items-center gap-1" onSubmit={handleUpdateLimit}>
          <label
            className="text-md text-gray-700 font-semibold"
            htmlFor="limitNumber"
          >
            จำนวนสูงสุดต่อวัน:
          </label>
          <Input
            id="limitNumber"
            name="limitNumber"
            type="number"
            value={limitNumber}
            className="text-md py-4 w-20"
            onChange={(e) => setLimitNumber(Number(e.target.value))}
          />

          <Button
            className="bg-blue-gradient text-white"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : "แก้ไข"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default AdminSetting;
