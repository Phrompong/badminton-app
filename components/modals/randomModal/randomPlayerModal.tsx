"use client";
import { getAllPlayers } from "@/app/actions/player";
import { getSessionByRoomCode } from "@/app/actions/session";
import { Modal } from "antd";
import { useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { motion } from "motion/react";
import NotYetRandom from "./notYetRandom";
import Random from "./random";
import {
  createRandomPlayers,
  getTransactionRandom,
  getTransactionRandomByPlayerId,
} from "@/app/actions/transactionRandom";
import { getCourtAvailable } from "@/app/actions/court";
import _ from "lodash";

interface IRandomPlayerModalProps {
  open: boolean;
  onClose: () => void;
}

const court = [1, 2, 3, 4, 5];

const RandomPlayerModal: FC<IRandomPlayerModalProps> = ({ open, onClose }) => {
  const [session, setSession] = useState<any>();
  const [players, setPlayers] = useState<any>();
  const [isRandom, setIsRandom] = useState(false);
  const [resultsRandom, setResultsRandom] = useState<any>([]);
  const search = useSearchParams();
  const code = search.get("code");

  const init = async () => {
    const session = await getSessionByRoomCode(code || "");

    if (!session) return;

    const allPlayers = await getAllPlayers(session.id);

    if (allPlayers.length === 0) return;

    setPlayers(allPlayers);
    setSession(session);

    // * ตรวจสอบว่ามีการสุ่มไปแล้วหรือยัง
    const transactionRandom = await getTransactionRandom(code || "");

    if (transactionRandom && transactionRandom.length > 0) {
      setIsRandom(true);
    }
  };

  useEffect(() => {
    init();
  }, [code, open]);

  useEffect(() => {
    console.log(resultsRandom);
  }, [resultsRandom]);

  const random = (players: any[], courts: any[]) => {
    let results: any[] = [];

    const shuffledPlayers = _.sampleSize(players, 4);
    const court = _.sampleSize(courts, 1)[0];

    results.push({
      court: court?.name,
      teamA: [shuffledPlayers[0], shuffledPlayers[1]],
      teamB: [shuffledPlayers[2], shuffledPlayers[3]],
    });

    setResultsRandom((prev: any) => [...prev, ...results]);

    // * Remove ผู้เล่นที่ถูกสุ่มออกจาก players
    const remainingPlayers = players.filter(
      (p) => !shuffledPlayers.includes(p)
    );

    // * Remove สนามที่ถูกสุ่มออกจาก courts
    const remainingCourts = courts.filter((c) => c.name !== court?.name);

    if (remainingPlayers.length >= 4 && remainingCourts.length > 0) {
      random(remainingPlayers, remainingCourts);
    }
  };

  const handleClickRandom = async () => {
    let playerReady =
      players?.filter((o: any) => o.isOnline && !o.isPlaying) || [];

    if (playerReady.length < 4) {
      alert("ผู้เล่นที่มาถึงสนามยังไม่เพียงพอสำหรับการสุ่ม");
      return;
    }

    // * ตรวจสอบ court ก่อนว่ามี court ไหนว่างบ้าง
    const courtAvailable = (await getCourtAvailable(session.roomCode)) ?? [];

    random(playerReady, courtAvailable);
    setIsRandom(true);

    // await createRandomPlayers(
    //   results.map((item: any) => ({
    //     sessionId: session.id,
    //     playerId_A1: item.teamA[0].id,
    //     playerId_A2: item.teamA[1].id,
    //     playerId_B3: item.teamB[0].id,
    //     playerId_B4: item.teamB[1].id,
    //     createdBy: "00000000-0000-0000-0000-000000000000",
    //     updatedBy: "00000000-0000-0000-0000-000000000000",
    //   }))
    // );
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={720}
      className="overflow-y-auto"
      footer={null}
    >
      {isRandom ? (
        <Random session={session} data={resultsRandom} />
      ) : (
        <NotYetRandom
          handleClickRandom={handleClickRandom}
          players={players}
          session={session}
          onClose={onClose}
        />
      )}
    </Modal>
  );
};

export default RandomPlayerModal;
