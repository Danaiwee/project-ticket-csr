import Navbar from "@/components/Navbar";
import { AUTHUSER } from "@/constants";
import React from "react";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const loggedInUser = AUTHUSER;

  return (
    <main className="w-full min-h-screen flex flex-col">
      <div className="root-layout">
        <Navbar user={loggedInUser} />
      </div>

      {children}
    </main>
  );
};

export default RootLayout;
