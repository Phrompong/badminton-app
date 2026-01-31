"use client";
import { getAllPlayers, updatePlayStatus } from "@/app/actions/player";
import {
  getSessionByRoomCode,
  updateIsRandomSession,
} from "@/app/actions/session";
import { Modal } from "antd";
import { useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { motion } from "motion/react";
import NotYetRandom from "./notYetRandom";
import Random from "./random";
import {
  createTransactionRandom,
  getTransactionRandom,
} from "@/app/actions/transactionRandom";
import { getCourtAvailable, patchUnavailableCourt } from "@/app/actions/court";
import _ from "lodash";

interface IRandomPlayerModalProps {
  open: boolean;
  onClose: () => void;
}

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

    if (session.isRandom) {
      setIsRandom(true);

      if (resultsRandom.length === 0) {
        const transactions = await getTransactionRandom(session.id);

        if (!transactions || transactions?.length === 0) {
        }
      }
    }
  };

  useEffect(() => {
    init();
  }, [code, open]);

  useEffect(() => {
    const init = async () => {
      if (resultsRandom.length === 0) return;

      for (const itemRandom of resultsRandom) {
        const bodyTransactionRandom = {
          sessionId: session!.id,
          courtId: itemRandom.courtId,
          createdDate: new Date(),
          createdBy: "00000000-0000-0000-0000-000000000000",
          updatedDate: new Date(),
          updatedBy: "00000000-0000-0000-0000-000000000000",
          playerId_A1: itemRandom.teamA[0].id,
          playerId_A2: itemRandom.teamA[1].id,
          playerId_B3: itemRandom.teamB[0].id,
          playerId_B4: itemRandom.teamB[1].id,
        };

        await createTransactionRandom([bodyTransactionRandom]);

        await patchUnavailableCourt(itemRandom.courtId);

        await updatePlayStatus(itemRandom.teamA[0].id, true);
        await updatePlayStatus(itemRandom.teamA[1].id, true);
        await updatePlayStatus(itemRandom.teamB[0].id, true);
        await updatePlayStatus(itemRandom.teamB[1].id, true);
      }
    };

    init();
  }, [resultsRandom]);

  const random = async (players: any[], courts: any[]) => {
    let results: any[] = [];

    const shuffledPlayers = _.sampleSize(players, 4);

    const court = _.sampleSize(courts, 1)[0];

    results.push({
      courtId: court?.id,
      court: court?.name,
      teamA: [shuffledPlayers[0], shuffledPlayers[1]],
      teamB: [shuffledPlayers[2], shuffledPlayers[3]],
    });

    setResultsRandom((prev: any) => [...prev, ...results]);

    // * Remove ผู้เล่นที่ถูกสุ่มออกจาก players
    const remainingPlayers = players.filter(
      (p) => !shuffledPlayers.includes(p),
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

    if (courtAvailable.length === 0) {
      alert("ไม่มีสนามว่างสำหรับการสุ่ม");
      return;
    }

    console.log("playerReady", playerReady.length);
    console.log("courtAvailable", courtAvailable.length);

    await random(playerReady, courtAvailable);

    // * อัพเดทสถานะการสุ่มใน session
    await updateIsRandomSession(session.roomCode);

    setTimeout(async () => {
      setIsRandom(true);
    }, 1000);
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
        <Random session={session} />
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
