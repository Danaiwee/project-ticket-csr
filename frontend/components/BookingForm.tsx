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
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { th } from "date-fns/locale";
import { Calendar } from "./ui/calendar";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { LOCATION_PRICES } from "@/constants";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

interface BookingProps {
  location: LocationData;
}

const BookingForm = ({ location }: BookingProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const { user, loading } = useAuth();

  const [open, setOpen] = useState(false);
  const [available, setAvailable] = useState<number>(0);
  const [isFull, setIsFull] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { typeName } = location;

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

  const selectDate = useWatch({
    control: form.control,
    name: "bookingDate",
    defaultValue: todayStr,
  });

  const watchedNumOfPeople = useWatch({
    control: form.control,
    name: "numOfPeople",
    defaultValue: 1,
  });

  const checkAvailability = useCallback(async () => {
    if (!selectDate) return;
    try {
      const { success, data } = (await api.booking.getAvaliable(
        location.id,
        selectDate
      )) as ActionResponse<AvailableBookingResponse>;

      if (success) {
        const { available, isFull } = data!;

        setAvailable(available);
        setIsFull(isFull);
        return;
      }
      throw new Error("มีข้อผิดพลาด");
    } catch (error) {
      console.log(error);
    }
  }, [selectDate, location.id]);

  useEffect(() => {
    checkAvailability();
  }, [checkAvailability]);

  useEffect(() => {
    const pricePerPerson = LOCATION_PRICES[typeName] || 0;
    const newTotal = watchedNumOfPeople * pricePerPerson;

    // อัปเดตค่าในฟอร์มโดยตรง
    form.setValue("totalPrice", newTotal);
  }, [watchedNumOfPeople, typeName, form]);

  const handleFormSubmit = async (
    data: z.infer<typeof CreateBookingSchema>
  ) => {
    const bookingNumber = form.getValues("numOfPeople");
    if (bookingNumber > available) {
      toast("ขออภัย", { description: "จำนวนที่ว่างไม่พอสำหรับการจอง" });
      return;
    }

    setIsLoading(true);
    try {
      const res = (await api.booking.createBooking(
        location.id,
        data
      )) as ActionResponse;

      if (res.success) {
        toast("สำเร็จ", { description: "ระบบได้จองตั๋วให้คุณแล้ว" });

        await checkAvailability();
        form.reset();
        setOpen(false);
        router.refresh();
        return;
      }

      throw new Error(
        res.error?.message || "เกิดข้อผิดพลาดขึ้น กรุณาลองใหม่อีกครั้งภายหลัง"
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast("ขออภัย", {
        description:
          error?.message || "ไม่สามารถเชื่อมต่อกับระบบได้ กรุณาลองใหม่ภายหลัง",
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
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
    <Dialog open={open} onOpenChange={setOpen}>
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
          <DialogDescription
            className={cn(
              "text-md -mt-2 font-bold",
              isFull ? "text-red-500" : "text-sky-500"
            )}
          >
            {isFull
              ? "ขออถัย วันที่คุณเลือกมีคนจองเต็มแล้ว!!"
              : `ขณะนี้มียังมีที่ว่างในวันที่ท่านเลือก: ${available} ที่`}
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
                  <FormLabel
                    className="font-kanit text-gray-600 text-lg"
                    htmlFor="booking-date-button"
                  >
                    วันที่ต้องการเข้าชม
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          id="booking-date-button"
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal py-6 h-12",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            // แสดงวันที่ในรูปแบบไทย
                            format(new Date(field.value), "PPP", { locale: th })
                          ) : (
                            <span className="text-lg!">เลือกวันที่</span>
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
                  <FormLabel className="font-kanit text-gray-600 text-lg">
                    จำนวนผู้เข้าชม (ท่าน)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="ระบุจำนวนคน"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="font-kanit focus-visible:ring-sky-500 h-12 text-lg!"
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
                  <FormLabel
                    className="font-kanit text-gray-600 text-lg"
                    htmlFor="totalPrice"
                  >
                    ราคารวมทั้งสิ้น (บาท)
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        readOnly
                        {...field}
                        className="font-kanit bg-gray-50 font-bold text-sky-600 h-12 text-lg!"
                        id="totalPrice"
                      />
                      <span className="absolute right-3 top-2 text-gray-400 text-lg">
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
                  <FormLabel className="font-kanit text-gray-600 text-lg">
                    หมายเหตุเพิ่มเติม (ถ้ามี)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="เช่น แพ้อาหาร, ต้องการรถเข็น เป็นต้น"
                      className="font-kanit resize-none focus-visible:ring-sky-500 text-lg! h-40"
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
              disabled={isFull || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  กำลังโหลด...
                </>
              ) : (
                "ยืนยันการจอง"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingForm;
