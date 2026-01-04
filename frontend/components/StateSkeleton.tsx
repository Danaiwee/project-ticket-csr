import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

interface StateSkeletonProps {
  image: {
    light: string;
    alt: string;
  };
  title: string;
  message: string;
  button?: {
    text: string;
    href: string;
  };
}

const StateSkeleton = ({
  image,
  title,
  message,
  button,
}: StateSkeletonProps) => {
  return (
    <div className="mt-16 flex w-full flex-col items-center justify-center sm:mt-10">
      <div className="relative size-60 sm:size-70">
        <Image
          src={image.light}
          alt={image.alt}
          fill
          priority
          sizes="(max-width: 640px) 240px, 320px"
          className="object-contain"
        />
      </div>

      <h2 className="h2-bold mt-8 font-kanit text-xl">{title}</h2>
      <p className="my-3.5 max-w-md text-center text-xl font-kanit">
        {message}
      </p>

      {button && (
        <Link href={button.href}>
          <Button className="paragraph-medium mt-5 min-h-11.5 rounded-lg bg-primary-500 px-4 py-3 text-light-900 hover:bg-primary-500">
            {button.text}
          </Button>
        </Link>
      )}
    </div>
  );
};

export default StateSkeleton;
