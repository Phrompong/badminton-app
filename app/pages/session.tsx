import EnterSessionModal from "@/components/modals/enterSessionModal";
import SessionModal from "@/components/modals/sessionFormModal";
import { KeyRound, Plus, Sparkles } from "lucide-react";
import { useState } from "react";

const Session = () => {
  const [isSessionModalOpen, setIsSessionModalOpen] = useState<boolean>(false);
  const [isEnterSessionModalOpen, setIsEnterSessionModalOpen] =
    useState<boolean>(false);

  const handleClickCreateSession = () => {
    setIsSessionModalOpen(true);
  };

  const handleClickEnterSession = () => {
    setIsEnterSessionModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center gap-12 mt-32">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 mb-6 shadow-xl shadow-emerald-500/20">
          <Sparkles className="w-10 h-10 text-white" />
        </div>

        <span className="text-5xl text-white">เริ่มต้นเซสชันใหม่</span>
        <span className="text-2xl text-white text-center">
          สร้างเซสชันเพื่อเริ่มจัดการการเล่นแบดมินตัน
        </span>

        <div className="flex gap-6">
          <button
            onClick={handleClickCreateSession}
            className="flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg p-6 gap-2 w-46 cursor-pointer hover:from-emerald-600 hover:to-teal-700 shadow-xl transition"
          >
            <Plus className="w-5 h-5 text-white" />
            <span className="text-white text-md">สร้างเซสชันใหม่</span>
          </button>
          <button
            onClick={handleClickEnterSession}
            className="flex items-center justify-center px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition w-46 gap-2 cursor-pointer"
          >
            <KeyRound className="w-5 h-5" />
            <span className="text-md">เข้าสู่เซสชันที</span>
          </button>
        </div>
      </div>

      <SessionModal
        open={isSessionModalOpen}
        onCancel={() => setIsSessionModalOpen(false)}
      />

      <EnterSessionModal
        open={isEnterSessionModalOpen}
        onCancel={() => setIsEnterSessionModalOpen(false)}
      />
    </>
  );
};

export default Session;
