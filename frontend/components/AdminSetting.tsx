"use client";

import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { useState } from "react";
import { Input } from "./ui/input";

function AdminSetting() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [limitNumber, setLimitNumber] = useState<number>(10);

  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-64 justify-between font-normal py-6 text-md font-kanit"
          >
            {date ? format(date, "d MMMM yyyy", { locale: th }) : "เลือกวันที่"}
            <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            defaultMonth={date}
            onSelect={(selectedDate) => {
              if (selectedDate) {
                setDate(selectedDate);
                setOpen(false);
              }
            }}
          />
        </PopoverContent>
      </Popover>

      <div className="flex items-center justify-end font-kanit">
        <form className="flex items-center gap-1">
          <label
            className="text-md text-gray-700 font-semibold"
            id="limitNumber"
          >
            จำนวนสูงสุดต่อวัน: 
          </label>
          <Input 
            type="number"
            value={limitNumber}
            className='text-md py-4 w-20'
            onChange={(e) => setLimitNumber(e.target.value)}
          />

          <Button className='bg-blue-gradient text-white'>
            แก้ไข
          </Button>
        </form>
      </div>
    </div>
  );
}

export default AdminSetting;

