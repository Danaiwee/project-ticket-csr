"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeyFromUrlQuery } from "@/lib/url";

interface LocalSearchbarProps {
  route: string;
  placeholder: string;
}

const LocalSearchbar = ({ route, placeholder }: LocalSearchbarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get("query");

  const [searchQuery, setSearchQuery] = useState(query || "");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "query",
          value: searchQuery,
        });

        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeKeyFromUrlQuery({
            params: searchParams.toString(),
            keysToRemove: ["query"],
          });

          router.push(newUrl, { scroll: false });
        }
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, searchParams, router, route, pathname]);

  return (
    <div className="bg-gray-50 flex min-h-16 grow items-center gap-4 rounded-[10px] px-4 border shadow-xl">
      <Search className="size-6 text-gray-500" />

      <Input
        type="text"
        placeholder={placeholder}
        className="text-lg! focus:outline-none! focus:ring-0! outline-0 ring-0 focus:border-0 border-0  text-gray-700 font-kanit"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default LocalSearchbar;
