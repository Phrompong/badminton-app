import { Divider } from "antd";
import { Edit2, Trash2 } from "lucide-react";
import { FC } from "react";

interface TableMobileProps {
  data: any[];
  className?: string;
  handleClickPayment: (playerId: string) => void;
  handleClickEditPlayer: (playerId: string) => void;
}

const TableMobile: FC<TableMobileProps> = ({
  data,
  className,
  handleClickPayment,
  handleClickEditPlayer,
}) => {
  return (
    <div
      className={`flex flex-col border border-[#94a3b8] rounded-md ${className}`}
    >
      {data.map((row) => (
        <div
          key={row.id}
          className="border-b p-4 last:border-0 flex flex-col gap-4"
        >
          <div>
            <span className="bg-[#00BC8D] p-2 rounded-2xl text-white text-sm">
              มาแล้ว
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-bold text-xl">ช้อป</span>
            <span className="font-bold text-xs bg-[#F0FDF4] w-18 justify-center text-[#008236] border p-1 flex items-center rounded-2xl">
              ชำระแล้ว
            </span>
          </div>

          <Divider style={{ borderColor: "#94a3b8", marginBottom: 0 }} />

          <div className="grid grid-cols-[2fr_auto_auto] gap-2">
            <button
              onClick={() => handleClickPayment(row.id)}
              className="border  border-[#94a3b8] p-1 rounded-md hover:bg-[#DDF7F0] cursor-pointer"
            >
              <span className="text-[#324158] text-sm ">ดูค่าใช้จ่าย</span>
            </button>
            <button
              onClick={() => handleClickEditPlayer(row.id)}
              className="border  border-[#94a3b8] cursor-pointer p-1 hover:bg-[#DDE6FF] rounded-md"
            >
              <Edit2 className="text-[#5375EE] hover:text-[#000]" />
            </button>
            <button className="border  border-[#E7000B] cursor-pointer p-1 hover:bg-[#FAD1D1] rounded-md">
              <Trash2 className="text-[#E7000B] hover:text-[#000]" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TableMobile;
