"use client";
import { TextInput } from "@/components/textInput";
import { Copy, Users } from "lucide-react";
import Card from "@/components/card";
import { getSessionByRoomCode } from "../actions/session";
import { FC, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { message } from "antd";
import { Skeleton } from "antd";
import { ResponseSession } from "../actions/models/session.model";
import Table from "@/components/table";
import TableMobile from "@/components/tableMobile";
import PaymentModal from "@/components/modals/paymentModal";
import EditPlayerModal from "@/components/modals/editPlayerModal";
import { copyText } from "@/utils/general";
import { getPlayersBySessionId } from "../actions/player";

interface IMainProps {
  refresh?: number;
}

const Main: FC<IMainProps> = ({ refresh }) => {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const router = useRouter();
  const [sessionData, setSessionData] = useState<ResponseSession | null>(null);
  const [playersData, setPlayersData] = useState<any[]>([]);
  const [cardData, setCardData] = useState<any[]>();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [isEditPlayerModalOpen, setIsEditPlayerModalOpen] =
    useState<boolean>(false);

  const initSession = async (code: string) => {
    const session = await getSessionByRoomCode(code);

    if (!session) {
      message.info("Session not found");

      setTimeout(() => {
        router.replace("?code=");
      }, 1000);

      return;
    }

    const players = await getPlayersBySessionId(session.id);

    const cards = [
      { title: "Total Players", total: players.length },
      { title: "Present", total: players.filter((p) => p.isOnline).length },
      { title: "Paid", total: players.filter((p) => p.isPaid).length },
      { title: "Unpaid", total: players.filter((p) => !p.isPaid).length },
      { title: "Courts", total: 10 },
    ];

    setCardData(cards);
    setSessionData(session);
    setPlayersData(players);
  };

  const handleClickPayment = () => {
    setIsPaymentModalOpen(true);
  };

  const handleClickEditPlayer = () => {
    setIsEditPlayerModalOpen(true);
  };

  const handleCopyRoomCode = async (roomCode: string) => {
    const isCopied = await copyText(roomCode);
    if (isCopied) {
      message.success("Room code copied to clipboard");
    } else {
      message.error("Failed to copy room code");
    }
  };

  useEffect(() => {
    if (!code) return;

    initSession(code);
  }, [code, refresh]);

  return (
    <>
      {!sessionData ? (
        <Skeleton active className="w-full" />
      ) : (
        <>
          <div className="flex justify-center h-[56px]">
            <TextInput className="w-[50%]" />
          </div>
          <div className="flex justify-center">
            <div className="flex items-center gap-4 flex border border-slate-200 border-2 p-2 rounded-xl hover:shadow-lg">
              <div className="flex gap-2 items-center">
                <Users className="w-4 h-4 text-slate-500" />
                <span className="text-[#62748E]">
                  {playersData.filter((player) => player.isOnline).length}/
                  {playersData.length}
                </span>
              </div>
              <span className="text-[#62748E]">|</span>
              <div className="flex gap-4 items-center">
                <div className="flex gap-2 items-center">
                  <span className="text-[#62748E]">#</span>
                  <span className="text-[#62748E]">{sessionData.roomCode}</span>
                </div>
                <Copy
                  className="w-3.5 h-3.5 text-slate-500 hover:text-slate-700 cursor-pointer"
                  onClick={() => handleCopyRoomCode(sessionData.roomCode)}
                />
              </div>
            </div>
          </div>
          <section className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8 justify-stretch">
            {cardData?.map(({ title, total }) => (
              <Card key={title} title={title} total={total} />
            ))}
          </section>

          {/* Table Section */}
          <Table
            data={playersData}
            className="hidden lg:table"
            handleClickPayment={handleClickPayment}
            handleClickEditPlayer={handleClickEditPlayer}
          />
          <TableMobile
            data={playersData}
            className="block lg:hidden"
            handleClickPayment={handleClickPayment}
            handleClickEditPlayer={handleClickEditPlayer}
          />

          <PaymentModal
            open={isPaymentModalOpen}
            onCancel={() => setIsPaymentModalOpen(false)}
          />

          <EditPlayerModal
            open={isEditPlayerModalOpen}
            onCancel={() => setIsEditPlayerModalOpen(false)}
          />
        </>
      )}
    </>
  );
};

export default Main;
