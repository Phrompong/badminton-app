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
import {
  getPlayersBySessionId,
  removePlayer,
  updateOnlineStatus,
} from "../actions/player";
import ConfirmModal from "@/components/modals/confirmModal";

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
  const [isRemovePlayerModalOpen, setIsRemovePlayerModalOpen] =
    useState<boolean>(false);
  const [refreshTicket, setRefreshTicket] = useState<number>(0);
  const [playerId, setPlayerId] = useState<string>("");

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
      {
        title: "Total Players",
        total: players.length,
        containerStyle:
          "bg-gradient-to-br from-indigo-600/90 via-blue-600/90 to-cyan-600/90 backdrop-blur-xl rounded-2xl p-5 border border-indigo-400/50 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/20 hover:scale-105 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden",
      },
      {
        title: "Present",
        total: players.filter((p) => p.isOnline).length,
        containerStyle:
          "bg-gradient-to-br from-emerald-500/90 via-teal-500/90 to-cyan-500/90 backdrop-blur-xl rounded-2xl p-5 border border-emerald-400/50 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/20 hover:scale-105 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group",
      },
      {
        title: "Paid",
        total: players.filter((p) => p.isPaid).length,
        containerStyle:
          "bg-gradient-to-br from-emerald-600/90 via-green-600/90 to-teal-600/90 backdrop-blur-xl rounded-2xl p-5 border border-emerald-400/50 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/20 hover:scale-105 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden",
      },
      {
        title: "Unpaid",
        total: players.filter((p) => !p.isPaid).length,
        containerStyle:
          "bg-gradient-to-br from-rose-500/90 via-pink-500/90 to-fuchsia-500/90 backdrop-blur-xl rounded-2xl p-5 border border-rose-400/50 shadow-xl hover:shadow-2xl hover:shadow-rose-500/20 hover:scale-105 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden",
      },
      {
        title: "Courts",
        total: session.courtCount,
        containerStyle:
          "bg-gradient-to-br from-purple-600/90 via-violet-600/90 to-indigo-600/90 backdrop-blur-xl rounded-2xl p-5 border border-purple-400/50 shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 hover:scale-105 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden",
      },
    ];

    setCardData(cards);
    setSessionData(session);
    setPlayersData(players);
  };

  const handleUpdateOnlineStatus = async (
    playerId: string,
    isOnline: boolean,
  ) => {
    await updateOnlineStatus(playerId, isOnline);
    setRefreshTicket((prev) => prev + 1);
  };

  const handleClickPayment = (playerId: string) => {
    setPlayerId(playerId);
    setIsPaymentModalOpen(true);
  };

  const handleClickEditPlayer = (playerId: string) => {
    setPlayerId(playerId);
    setIsEditPlayerModalOpen(true);
  };

  const handleClickRemovePlayer = (playerId: string) => {
    setPlayerId(playerId);
    setIsRemovePlayerModalOpen(true);
  };

  const handleConfirmRemovePlayer = () => {
    removePlayer(playerId);
    setIsRemovePlayerModalOpen(false);

    message.success("ทำการลบผู้เล่นเรียบร้อยแล้ว");
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
  }, [
    code,
    refresh,
    refreshTicket,
    isPaymentModalOpen,
    isEditPlayerModalOpen,
    isRemovePlayerModalOpen,
  ]);

  return (
    <>
      {!sessionData ? (
        <Skeleton active className="w-full" />
      ) : (
        <div className="max-w-7xl mx-auto flex flex-col gap-6 py-8 px-4">
          <section className="flex justify-center ">
            <div className="flex items-center gap-4 bg-gradient-to-br from-orange-500/90 via-orange-400/90 to-amber-400/90 backdrop-blur-xl rounded-2xl p-5 border border-orange-400/50 shadow-xl hover:shadow-2xl hover:shadow-orange-500/20 hover:scale-105 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
              <div className="flex gap-2 items-center">
                <Users className="w-4 h-4 text-white" />
                <span className="text-white text-xl">
                  {playersData.filter((player) => player.isOnline).length}/
                  {playersData.length}
                </span>
              </div>
              <span className="text-white items-center">|</span>
              <div className="flex gap-2 items-center">
                <span className="text-white text-xl">#</span>
                <span className="text-white text-xl">
                  {sessionData.roomCode}
                </span>
                <Copy
                  className="w-4 h-4 text-white hover:text-white cursor-pointer"
                  onClick={() => handleCopyRoomCode(sessionData.roomCode)}
                />
              </div>
            </div>
          </section>
          <section className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8 justify-stretch">
            {cardData?.map(({ title, total, containerStyle }) => (
              <Card
                key={title}
                title={title}
                total={total}
                containerStyle={containerStyle}
              />
            ))}
          </section>

          {/* Table Section */}
          <Table
            data={playersData}
            className="hidden lg:table"
            handleUpdateOnlineStatus={handleUpdateOnlineStatus}
            handleClickPayment={handleClickPayment}
            handleClickEditPlayer={handleClickEditPlayer}
            handleClickRemovePlayer={handleClickRemovePlayer}
          />
          <TableMobile
            data={playersData}
            className="block lg:hidden"
            handleClickPayment={handleClickPayment}
            handleClickEditPlayer={handleClickEditPlayer}
          />

          <PaymentModal
            playerId={playerId}
            open={isPaymentModalOpen}
            onCancel={() => setIsPaymentModalOpen(false)}
          />

          <EditPlayerModal
            playerId={playerId}
            open={isEditPlayerModalOpen}
            onCancel={() => setIsEditPlayerModalOpen(false)}
          />

          <ConfirmModal
            isOpenModal={isRemovePlayerModalOpen}
            handleConfirm={handleConfirmRemovePlayer}
            handleCancel={() => setIsRemovePlayerModalOpen(false)}
          >
            <span>คุณต้องการลบผู้เล่นนี้ใช่หรือไม่?</span>
          </ConfirmModal>
        </div>
      )}
    </>
  );
};

export default Main;
