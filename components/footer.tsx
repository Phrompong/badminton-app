import { FormInstance } from "antd";
import { FC } from "react";

interface IFooterProps {
  text: string;
  handleClickSubmit: () => void;
  isCancel?: boolean;
  handleClickCancel?: () => void;
}

const Footer: FC<IFooterProps> = ({
  text,
  isCancel,
  handleClickSubmit,
  handleClickCancel,
}) => {
  return (
    <div className="flex gap-2">
      {isCancel && (
        <button
          type="button"
          className="border border-1 p-1 rounded-md w-full border-gray-400 hover:bg-gray-100"
          onClick={handleClickCancel}
        >
          ยกเลิก
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
  );
};

export default Footer;
