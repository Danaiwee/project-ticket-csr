import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-200 w-full">
      <Loader2 className="size-10 animate-spin text-sky-500" />
      <p className="mt-2 text-gray-500">กำลังโหลดข้อมูล...</p>
    </div>
  );
};

export default Loading;
