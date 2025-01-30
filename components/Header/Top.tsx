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
    <div className="flex items-center justify-between p-4">
      <div>
        <p className="font-bold text-xl">{title}</p>
        {description && (
          <p className="font-light text-sm text-gray-500">{description}</p>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
};

export default HeaderTop;
