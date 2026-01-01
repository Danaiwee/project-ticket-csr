import BookingDetails from "@/components/BookingDetails";
import HeaderBox from "@/components/HeaderBox";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TicketSpace | การจองของคุณ",
  description: "ดูรายละเลียดการจองและจัดการข้อมูลของคุณ",
};

const UserBookingPage = () => {
  return (
    <section className="w-full mx-auto max-w-7xl px-4">
        <div className="flex h-full max-h-screen w-full flex-col gap-8 mt-14 font-kanit">
        <HeaderBox
          title="ยินดีต้อนรับ"
          subtext="ดูรายละเอียดและจัดการการจองของคุณ"
          type="greeting"
        />
        </div>

        <BookingDetails />
    </section>
  )
}

export default UserBookingPage