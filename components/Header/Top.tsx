import React from "react";

interface HeaderTopProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

const HeaderTop: React.FC<HeaderTopProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-4 gap-4">
      <div className="text-left w-full md:w-1/3">
        <p className="font-bold text-xl">{title}</p>
        {description && (
          <p className="font-light text-sm text-gray-500">{description}</p>
        )}
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
};

export default HeaderTop;
