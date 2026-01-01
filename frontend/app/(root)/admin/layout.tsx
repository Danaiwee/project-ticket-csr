import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "TicketSpace | Admin",
  description: "ดูรายการและจัดการการจองสถานทีท่องเที่ยวทั้งหมด",
};

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default AdminLayout;
