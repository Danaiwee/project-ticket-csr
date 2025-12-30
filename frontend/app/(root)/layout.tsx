export const dynamic = "force-dynamic";
import Navbar from "@/components/Navbar";
import React from "react";
import { cookies } from "next/headers";
import { getSession } from "@/lib/handler/session";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const authUser = await getSession(cookieHeader);

  return (
    <main className="w-full min-h-screen flex flex-col">
      <div className="flex h-18 w-full items-center justify-between p-5  sm:p-8 md:px-20 mx-auto border-b border-gray-200">
        <Navbar user={authUser} />
      </div>

      {children}
    </main>
  );
};

export default RootLayout;
