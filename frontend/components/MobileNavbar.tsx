"use client";

import Image from "next/image";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { usePathname } from "next/navigation";
import Logout from "./Logout";
import { NAV_ITEMS } from "@/constants";
import React from "react";

interface MobileNavbarProps {
  user: User | null | undefined;
}

const MobileNavbar = ({ user }: MobileNavbarProps) => {
  const pathname = usePathname();

  const isAdmin = user?.role === "ADMIN" || false;

  return (
    <div className="w-full flex md:hidden justify-end">
      <Sheet>
        <SheetTrigger className="flex justify-end">
          <Image
            src="/icons/hamburger.svg"
            width={30}
            height={30}
            alt="menu"
            className="cursor-pointer"
          />
        </SheetTrigger>
        <SheetContent
          side="left"
          className="border-none bg-white w-75 font-kanit"
        >
          <SheetTitle asChild className="mt-3 px-4">
              <Link href={ROUTES.HOME} className="flex items-center gap-1">
                <Image
                  src="/icons/logo.png"
                  alt="Logo icon"
                  width={30}
                  height={30}
                />
                <div className="flex">
                  <h1 className="font-roboto text-xl font-bold text-gray-900">
                    Ticket
                  </h1>
                  <h1 className="font-roboto text-xl font-bold text-sky-500">
                    Space
                  </h1>
                </div>
              </Link>
          </SheetTitle>
          <div className="h-screen flex flex-col items-between w-full">
            <SheetDescription className="flex flex-col gap-3 mt-10 px-4">
              {NAV_ITEMS.map((item) => {
                if (item.adminOnly && !isAdmin) return null;
                if (item.login && !user) return null;
                const isActive = pathname === item.href;

                return (
                  <React.Fragment key={item.id}>
                    <SheetClose asChild>
                      <Link
                        href={item.href}
                        className={`text-gray-500 hover:text-gray-600 px-4 py-4 rounded-lg font-semibold ${
                          isActive && "text-white bg-sky-500 hover:text-white"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  </React.Fragment>
                );
              })}

              {!user && (
                <>
                  <SheetClose asChild>
                    <Link
                      href={ROUTES.SIGN_IN}
                      className="text-gray-500 hover:text-gray-600 px-4 py-4 rounded-lg font-semibold"
                    >
                      เข้าสู่ระบบ
                    </Link>
                  </SheetClose>

                  <SheetClose asChild>
                    <Link
                      href={ROUTES.SIGN_UP}
                      className="text-gray-500 hover:text-gray-600 px-4 py-4 rounded-lg font-semibold"
                    >
                      สมัครสมาชิก
                    </Link>
                  </SheetClose>
                </>
              )}
            </SheetDescription>
            {user && (
              <SheetFooter className="flex w-full items-end">
                <Logout />
              </SheetFooter>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavbar;
