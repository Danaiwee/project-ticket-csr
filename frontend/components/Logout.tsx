"use client";

import { Loader2, LogOutIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

const Logout = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {};

  return (
    <Button variant="ghost" className="hover:bg-none!">
      {isLoading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <LogOutIcon className="size-4 text-gray-500" />
      )}
    </Button>
  );
};

export default Logout;
