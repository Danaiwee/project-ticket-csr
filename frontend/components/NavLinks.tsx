"use client";

import { ROUTES } from "@/constants/routes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logout from "./Logout";
import { NAV_ITEMS } from "@/constants";

interface NavLinksProps {
  user: User | null | undefined;
}

const NavLinks = ({ user }: NavLinksProps) => {
  const pathname = usePathname();

  const isAdmin = user?.role === "ADMIN" || false;

  return (
    <div className="hidden md:flex items-center gap-5 font-kanit">
      {NAV_ITEMS.map((item) => {
        if (item.adminOnly && !isAdmin) return null;
        if (item.login && !user) return null;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.id}
            href={item.href}
            className={isActive ? "text-sky-500" : "text-gray-500"}
          >
            {item.label}
          </Link>
        );
      })}

      {user ? (
        <Logout />
      ) : (
        <>
          <Link
            href={ROUTES.SIGN_IN}
            className="text-gray-500 hover:text-gray-600"
          >
            เข้าสู่ระบบ
          </Link>

          <Link
            href={ROUTES.BOOKING}
            className="text-gray-500 hover:text-gray-600"
          >
            สมัครสมาชิก
          </Link>
        </>
      )}
    </div>
  );
};

export default NavLinks;
