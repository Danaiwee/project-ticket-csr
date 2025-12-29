"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { ROUTES } from "@/constants/routes";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";
import { CreateBookingSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { th } from "date-fns/locale";
import { Calendar } from "./ui/calendar";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { LOCATION_PRICES } from "@/constants";
import { useEffect } from "react";

interface BookingProps {
  location: LocationData;
}

const Booking = ({ location }: BookingProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const { typeName } = location;
  const available = 5;
  const user = true;

  const todayStr = format(new Date(), "yyyy-MM-dd");

  const form = useForm<z.infer<typeof CreateBookingSchema>>({
    resolver: zodResolver(CreateBookingSchema),
    defaultValues: {
      numOfPeople: 1,
      bookingDate: todayStr,
      totalPrice: LOCATION_PRICES[typeName] || 0,
      remarks: "",
    },
  });

  const watchedNumOfPeople = useWatch({
    control: form.control,
    name: "numOfPeople",
    defaultValue: 1,
  });
  useEffect(() => {
    const pricePerPerson = LOCATION_PRICES[typeName] || 0;
    const newTotal = watchedNumOfPeople * pricePerPerson;

    // อัปเดตค่าในฟอร์มโดยตรง
    form.setValue("totalPrice", newTotal);
  }, [watchedNumOfPeople, typeName, form]);

  const handleFormSubmit = (data: z.infer<typeof CreateBookingSchema>) => {
    console.log(data);
  };

  const handleSignInRedirect = () => {
    router.push(
      `${ROUTES.SIGN_IN}?callbackUrl=${encodeURIComponent(pathname)}`
    );
  };

  if (!user) {
    return (
      <Button
        className="bg-blue-gradient rounded-lg text-white font-kanit text-lg px-6 py-6"
        onClick={handleSignInRedirect}
      >
        เข้าสู่ระบบเพื่อจอง
      </Button>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-gradient rounded-lg text-white font-kanit text-lg px-6 py-6">
          จองตั๋วเข้าชม
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-kanit text-lg text-gray-700">
            รายละเอียดการจอง
          </DialogTitle>
          <DialogDescription className="text-md text-sky-500 -mt-2">
            {`ขณะนี้มียังมีที่ว่างในวันที่ท่านเลือก: ${available} ที่`}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="w-full"
          >
            <FormField
              control={form.control}
              name="bookingDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-kanit text-gray-600 text-lg font-bold">
                    วันที่ต้องการเข้าชม
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal py-6",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            // แสดงวันที่ในรูปแบบไทย
                            format(new Date(field.value), "PPP", { locale: th })
                          ) : (
                            <span className="text-md">เลือกวันที่</span>
                          )}
                          <CalendarIcon className="ml-auto size-5 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-10" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        defaultMonth={
                          field.value ? new Date(field.value) : new Date()
                        }
                        onSelect={(date) => {
                          if (date) {
                            const formattedDate = format(date, "yyyy-MM-dd");
                            field.onChange(formattedDate);
                          }
                        }}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numOfPeople"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel className="font-kanit text-gray-600">
                    จำนวนผู้เข้าชม (ท่าน)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="ระบุจำนวนคน"
                      {...field}
                      // แปลงค่าจาก String เป็น Number ทันทีที่เปลี่ยน
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="font-kanit focus-visible:ring-sky-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="totalPrice"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel className="font-kanit text-gray-600">
                    ราคารวมทั้งสิ้น (บาท)
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        readOnly
                        {...field}
                        className="font-kanit bg-gray-50 font-bold text-sky-600"
                      />
                      <span className="absolute right-3 top-2 text-sm text-gray-400">
                        บาท
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel className="font-kanit text-gray-600">
                    หมายเหตุเพิ่มเติม (ถ้ามี)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="เช่น แพ้อาหาร, ต้องการรถเข็น เป็นต้น"
                      className="font-kanit resize-none focus-visible:ring-sky-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-blue-gradient mt-8 py-6 text-lg font-kanit"
            >
              ยืนยันการจอง
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default Booking;
