import { motion } from "motion/react";

interface INotYetRandom {
  onClose: () => void;
  players: any[];
  session: any;
  handleClickRandom: () => void;
}

const NotYetRandom: React.FC<INotYetRandom> = ({
  players,
  session,
  onClose,
  handleClickRandom,
}) => {
  return (
    <div className="flex flex-col mt-4 items-center self-center my-4 mt-12 gap-6">
      <div className="flex flex-col items-center w-[70%] gap-10 p-2">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-7xl sm:text-8xl md:text-9xl"
            >
              🏸
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute -top-2 -right-2 text-3xl sm:text-4xl"
            >
              ✨
            </motion.div>
          </div>
        </motion.div>
        <span className="text-3xl">พร้อมสุ่มคู่แข่ง!</span>
        <span className="text-[#6F7786]">
          ระบบจะสุ่มจับคู่ผู้เล่นที่มาถึงสนามแล้วให้คุณอัตโนมัติ
        </span>
        <div className="flex gap-2 w-full">
          <div className="flex border border-3 border-[#D9F7E9] bg-[#EFFDF8] flex-col p-2 w-full gap-2 rounded-md">
            <span className="font-bold text-[#00815E]">ผู้เล่นที่มาแล้ว</span>
            <span className="text-xl text-[#00815E]">
              {players?.filter((o: any) => o.isOnline).length || 0}
            </span>
            <span className="text-xs text-[#00815E]">คน</span>
          </div>
          <div className="flex border border-3 border-[#BEDBFF] bg-[#EFF4FF] flex-col p-2 w-full gap-2 rounded-md">
            <span className="font-bold text-[#1447E6]">จำนวนสนาม</span>
            <span className="text-xl text-[#1447E6]">
              {session?.courtCount || 0}
            </span>
            <span className="text-xs text-[#1447E6]">สนาม</span>
          </div>
        </div>
        <div className="flex flex-col border border-2 border-[#BEDBFF] bg-[#EFF4FF] p-2 w-full gap-2 rounded-md list-disc overflow-hidden">
          <div className="ml-4 gap-2 flex flex-col">
            <span className="font-bold text-[#1C398E]">วิธีการสุ่ม</span>
            <ul className="list-disc ml-6 gap-1 flex flex-col">
              <li className="text-[#1447E6]">
                สุ่มเฉพาะผู้เล่นที่ "มาถึงสนามแล้ว
              </li>
              <li className="text-[#1447E6]">จับคู่ 4 คน/สนาม (2v2)</li>
              <li className="text-[#1447E6]">แบ่งทีม Team A vs Team B</li>
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 w-full">
          <button
            onClick={handleClickRandom}
            className=" bg-[#00A385] rounded-md p-2 cursor-pointer hover:opacity-80 "
          >
            <span className="text-white font-bold">สุ่มตอนนี้</span>
          </button>
          <button
            onClick={onClose}
            className=" border border-[#D1D5DB] rounded-md p-2 w-full cursor-pointer hover:opacity-80 "
          >
            <span className="text-[#374151] font-bold">ปิดหน้าต่าง</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotYetRandom;
