"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";

interface CancelBookingProps {
  bookingId: string;
  onSuccess: () => void; 
}

const CancelBooking = ({ bookingId, onSuccess }: CancelBookingProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteBooking = async () => {
    setIsLoading(true);
    try {
      const res = (await api.booking.cancelBooking(
        bookingId
      )) as ActionResponse;

      if (res.success) {
        toast("สำเร็จ", { description: "ยกเลิกการจองสำเร็จ" });

        router.refresh();
        onSuccess();
        return;
      }

      throw new Error(
        res.error?.message || "มีข้อผิดพลาดเกิดขึ้น กรุณาลองใหม่ภายหลัง"
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast("เกิดข้อผิดพลาด", {
        description:
          error?.message || "ไม่สามารถเชื่อมต่อกับระบบได้ กรุณาลองใหม่ภายหลัง",
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="p-4 bg-red-400 hover:bg-red-500 text-white rounded-lg text-md font-bold">
          ยกเลิกการจอง
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>คุณต้องการที่จะยกเลิกการจอง?</AlertDialogTitle>
          <AlertDialogDescription>
            กรุณากดยืนยันหากต้องการที่จะยกเลิกการจอง
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteBooking}
            disabled={isLoading}
            className="bg-red-400 text-white! font-semibold"
          >
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : "ยืนยัน"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CancelBooking;
