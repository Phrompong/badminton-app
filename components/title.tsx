import { FC } from "react";

interface ITitleProps {
  icon?: React.ReactNode;
  text: string;
}

const Title: FC<ITitleProps> = ({ icon, text }) => {
  return (
    <div className="flex flex-col gap-4 mb-8 ">
      <div className="flex flex-row gap-2 items-center">
        {icon}
        <span className="text-xl">{text}</span>
      </div>
      <div className="border border-gray-100"></div>
    </div>
  );
};

export default Title;
