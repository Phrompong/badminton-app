import { FormInstance } from "antd";
import { FC } from "react";

interface IFooterProps {
  text: string;
  textCancel?: string;
  handleClickSubmit: () => void;
  isCancel?: boolean;
  handleClickCancel?: () => void;
  isShowLine?: boolean;
}

const Footer: FC<IFooterProps> = ({
  text,
  textCancel,
  isCancel,
  handleClickSubmit,
  handleClickCancel,
  isShowLine = true,
}) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="border border-gray-100"></div>
      <div className="flex gap-2">
        {isCancel && (
          <button
            type="button"
            className="cursor-pointer border border-1 p-1 rounded-md w-full border-gray-400 hover:bg-gray-100"
            onClick={handleClickCancel}
          >
            {textCancel ?? "ยกเลิก"}
          </button>
        )}
        <button
          type="button"
          className="cursor-pointer border border-1 p-1 rounded-md w-full bg-[#00986E] text-white hover:bg-[#007a53]"
          onClick={handleClickSubmit}
        >
          {text}
        </button>
      </div>
    </div>
  );
};

export default Footer;
