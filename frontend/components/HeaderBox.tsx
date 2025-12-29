interface HeaderBoxProps {
  title: string;
  subtext: string;
  type?: string;
  user?: User | null;
}

const HeaderBox = ({ type, title, user = null, subtext }: HeaderBoxProps) => {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-3xl lg:text-5xl font-semibold text-gray-900">
        {title}
        {type === "greeting" && (
          <span className="text-sky-500">&nbsp;{`คุณ${user?.firstName}`}</span>
        )}
      </h1>
      <p className="font-semibold text-gray-600 text-md lg:text-xl">
        {subtext}
      </p>
    </div>
  );
};

export default HeaderBox;
