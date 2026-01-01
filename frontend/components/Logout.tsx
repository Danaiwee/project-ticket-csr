"use client";

import { Loader2, LogOutIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const Logout = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {setUser} = useAuth();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const res = (await api.auth.logout()) as ActionResponse;

      if (res.success) {
        toast("Success", { description: "ออกจากระบบสำเร็จ" });

        setUser(null)
        router.refresh();
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
    <Button variant="ghost" className="hover:bg-none!" onClick={handleLogout}>
      {isLoading ? (
        <Loader2 className="size-5 animate-spin" />
      ) : (
        <LogOutIcon className="size-5 text-gray-500" />
      )}
    </Button>
  );
};

export default Logout;
