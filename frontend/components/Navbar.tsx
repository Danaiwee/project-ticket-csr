import Image from "next/image";
import NavLinks from "./NavLinks";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import MobileNavbar from "./MobileNavbar";

interface NavbarProps {
  user: User | null | undefined;
}

const Navbar = ({ user }: NavbarProps) => {
  return (
    <section className="w-full flex justify-between items-center max-w-7xl mx-auto">
      <Link href={ROUTES.HOME} className="flex items-center gap-1">
        <Image src="/icons/logo.png" alt="Logo icon" width={35} height={35} />
        <div className="flex">
          <h1 className="font-roboto text-2xl font-bold text-gray-900">
            Ticket
          </h1>
          <h1 className="font-roboto text-2xl font-bold text-sky-500">Space</h1>
        </div>
      </Link>

      <div>
        <NavLinks user={user} />
        <MobileNavbar user={user} />
      </div>
    </section>
  );
};

export default Navbar;
