import React from "react";
import { Button } from "./ui/button";

interface CancelBookingProps {
  bookingId: string;
}

const CancelBooking = ({ bookingId }: CancelBookingProps) => {
  return (
    <Button className="p-ภ bg-red-400 hover:bg-red-500 text-white rounded-lg text-md font-bold">
      ยกเลิกการจอง
    </Button>
  );
};

export default CancelBooking;
