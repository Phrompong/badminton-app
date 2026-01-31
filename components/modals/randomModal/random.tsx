import {
  getAllOnlineAndPlaying,
  getAllOnlinePlayers,
  updatePlayStatus,
} from "@/app/actions/player";
import { getSessionByRoomCode } from "@/app/actions/session";
import {
  createTransactionRandom,
  getTransactionByTransactionId,
  getTransactionRandomBySessionId,
  updateEndGameTransactionRandom,
  updateTransactionRandom,
} from "@/app/actions/transactionRandom";
import { CloseOutlined, DownOutlined } from "@ant-design/icons";
import { Divider, Dropdown, MenuProps, Space } from "antd";
import dayjs from "dayjs";
import _, { now } from "lodash";
import { useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import ConfirmModal from "../confirmModal";
import { v4 as uuidv4 } from "uuid";
import { getCourtAvailable, patchUnavailableCourt } from "@/app/actions/court";

interface IRandom {
  session: any;
}

const items: MenuProps["items"] = [
  {
    key: "1",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.antgroup.com"
      >
        1st menu item
      </a>
    ),
  },
  {
    key: "2",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.aliyun.com"
      >
        2nd menu item (disabled)
      </a>
    ),
    // icon: <SmileOutlined />,
    disabled: true,
  },
  {
    key: "3",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.luohanacademy.com"
      >
        3rd menu item (disabled)
      </a>
    ),
    disabled: true,
  },
  {
    key: "4",
    danger: true,
    label: "a danger item",
  },
];

const Random: FC<IRandom> = ({ session }) => {
  const [dataItems, setDataItems] = useState<any[]>([]);
  const [onlinePlayers, setOnlinePlayers] = useState<any[]>([]);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const search = useSearchParams();
  const roomCode = search.get("code") || "";

  const init = async () => {
    // * Get transaction random by session id
    const transactions = await getTransactionRandomBySessionId(session.id);

    const items = transactions.map((transaction) => ({
      transactionRandomId: transaction?.id,
      court: transaction?.court?.name,
      teamA: [
        {
          id: transaction.player1.id,
          name: transaction.player1.name,
        },
        {
          id: transaction.player2.id,
          name: transaction.player2.name,
        },
      ],
      teamB: [
        {
          id: transaction.player3.id,
          name: transaction.player3.name,
        },
        {
          id: transaction.player4.id,
          name: transaction.player4.name,
        },
      ],
    }));

    setDataItems(items);
  };

  useEffect(() => {
    init();
  }, []);

  const handleChangePlayer = (
    playerId: string,
    index: number,
    team: string,
  ) => {
    // * อยาก update data ของ teamA เมื่อมีการเลือก dropdown ใหม่
    setDataItems((prevDataItems) => {
      const newDataItems = [...prevDataItems];
      for (const item of newDataItems) {
        for (let i = 0; i < item[team].length; i++) {
          if (i === index) {
            const name = onlinePlayers.find((p) => p.key === playerId)?.label;
            item[team][i] = { id: playerId, name: name || "New Player Name" }; // เปลี่ยนชื่อผู้เล่นตามที่ต้องการ
          }
        }
      }
      return newDataItems;
    });
  };

  const handleClickShuffle = async (court: string) => {
    const playerOnline = await getAllOnlineAndPlaying(session.id);

    if (playerOnline.length === 0) return;

    // * Logic การสุ่มทีม
    const playerOnCourtOther = dataItems.find((item) => item.court !== court);

    // * สุ่มผู้เล่น 4 คนจาก playerOnline โดยที่เวลา playingSince ไม่เกิน 1 นาที
    const _playerOnline = playerOnline.filter((p) => {
      if (!p.playingSince) return true;
      const now = dayjs();
      const diffMinute = now.diff(dayjs(p.playingSince), "minute");

      return diffMinute <= 1;
    });

    if (_playerOnline.length < 4) {
      alert("ไม่มีผู้เล่นเพียงพอสำหรับการสุ่มใหม่ ");
      return;
    }

    // * จะไม่เอาผู้เล่นจาก court อื่น มาร่วมในการสุ่ม
    if (playerOnCourtOther) {
      for (const p of playerOnCourtOther.teamA) {
        _.remove(_playerOnline, (po) => po.id === p.id);
      }
      for (const p of playerOnCourtOther.teamB) {
        _.remove(_playerOnline, (po) => po.id === p.id);
      }
    }

    const shuffledPlayers = _.sampleSize(_playerOnline, 4);

    // * Update tranaction random
    const transactionToUpdate = dataItems.find((item) => item.court === court);

    if (!transactionToUpdate) return;

    const nowTransaction = await getTransactionByTransactionId(
      transactionToUpdate.transactionRandomId,
    );

    if (!nowTransaction) return;

    const upsertData = {
      sessionId: session.id,
      playerId_A1: shuffledPlayers[0].id,
      playerId_A2: shuffledPlayers[1].id,
      playerId_B3: shuffledPlayers[2].id,
      playerId_B4: shuffledPlayers[3].id,
      courtId: nowTransaction.courtId,
      updatedDate: new Date(),
      updatedBy: "00000000-0000-0000-0000-000000000000",
    };

    let insertId = "";

    if (nowTransaction.isEndGame) {
      insertId = uuidv4();
      await createTransactionRandom([
        {
          ...upsertData,
          id: insertId,
          createdBy: "00000000-0000-0000-0000-000000000000",
          createdDate: new Date(),
        },
      ]);

      await updateTransactionRandom(transactionToUpdate.transactionRandomId, {
        ...upsertData,
        isTemp: true,
      });
    } else {
      await updateTransactionRandom(
        transactionToUpdate.transactionRandomId,
        upsertData,
      );
    }

    setDataItems((prevDataItems) => {
      const newDataItems = prevDataItems.map((item) => {
        if (item.court === court) {
          return {
            ...item,
            transactionRandomId: insertId || item.transactionRandomId,
            teamA: [
              { id: shuffledPlayers[0].id, name: shuffledPlayers[0].name },
              { id: shuffledPlayers[1].id, name: shuffledPlayers[1].name },
            ],
            teamB: [
              { id: shuffledPlayers[2].id, name: shuffledPlayers[2].name },
              { id: shuffledPlayers[3].id, name: shuffledPlayers[3].name },
            ],
          };
        }
        return item;
      });
      return newDataItems;
    });
  };

  const handleClickEndGame = async (transactionRandomId: string) => {
    alert(`จบเกม : ${transactionRandomId}`);
    await updateEndGameTransactionRandom(transactionRandomId);
  };

  const handleConfirmModal = () => {};

  const handleCancelModal = () => {
    setIsOpenModal(false);
  };

  useEffect(() => {
    const init = async () => {
      if (dataItems.length === 0) return;

      for (const itemRandom of dataItems) {
        if (itemRandom.courtId) {
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
      }
    };

    init();
  }, [dataItems]);

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

    setDataItems((prev: any) => [...prev, ...results]);

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

  const handleClickNewCourt = async () => {
    const playerReady = await getAllOnlinePlayers(session.id);

    console.log("playerReady :", playerReady);
    if (playerReady.length === 0 || playerReady.length < 4) return;

    const courtAvailable = await getCourtAvailable(roomCode);

    console.log("courtAvailable :", courtAvailable);
    if (!courtAvailable || courtAvailable.length === 0) return;

    await random(playerReady, courtAvailable);
  };

  return (
    <>
      <div className="flex flex-col mt-12 gap-2">
        <div className="flex justify-end">
          <button
            className="border border-1 px-4 py-2 rounded-md w-auto w-32 cursor-pointer bg-green-100 border-green-300 hover:bg-green-200 hover:border-green-400"
            onClick={() => handleClickNewCourt()}
          >
            Reload
          </button>
        </div>
        {dataItems.map(({ transactionRandomId, court, teamA, teamB }) => (
          <div
            key={court}
            className="border border-green-300 rounded-md p-2 shadow-md mb-4"
          >
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span>COURT</span>
                <span># {court}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={async () => handleClickShuffle(court)}
                  className="border border-[#5EEAB4] rounded-md p-1 w-22 cursor-pointer hover:bg-[#E0FFF6]"
                >
                  <span></span>
                  <span className="text-[#007A55] text-xs">Shuffle</span>
                </button>
                <button
                  onClick={() => handleClickEndGame(transactionRandomId)}
                  className="border border-[#F64100] bg-[#F64100] rounded-md p-1 w-22 cursor-pointer hover:bg-[#d93800] hover:border-[#d93800]"
                >
                  <span></span>
                  <span className="text-white text-xs">จบเกม</span>
                </button>
              </div>
            </div>

            <Divider style={{ borderColor: "#94a3b8" }} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ">
              <div className="flex flex-col gap-2 w-full">
                <span className="text-[#2473FF] font-bold">TEAM A</span>
                {teamA.map(({ name }: any, index: number) => (
                  <Dropdown
                    menu={{
                      items: onlinePlayers,
                      onClick: (e) => handleChangePlayer(e.key, index, "teamA"),
                      selectable: false,
                      disabledOverflow: true,
                    }}
                    key={index}
                  >
                    <div
                      key={index}
                      className="border border-[#D2E6FF] bg-[#F0F6FF] p-2 rounded-md flex justify-between items-center gap-4 hover:border-[#2473FF] hover:shadow-md cursor-pointer"
                    >
                      <div className="flex gap-4">
                        <div className="rounded-full  w-6 h-6 flex items-center justify-center text-xs bg-[#1D6BFF]">
                          <span className="text-white">{index + 1}</span>
                        </div>
                        <span>{name}</span>
                      </div>
                    </div>
                  </Dropdown>
                ))}
              </div>
              <div className="flex flex-col gap-2 w-full">
                <span className="text-[#C70036] font-bold">TEAM B</span>

                {teamB.map(({ name }: any, index: number) => (
                  <div
                    key={index}
                    className="border border-[#FFDCDF] bg-[#FEF1F2] p-2 rounded-md flex items-center gap-4 hover:border-[#2473FF] hover:shadow-md cursor-pointer"
                  >
                    <div className="rounded-full  w-6 h-6 flex items-center justify-center text-xs bg-[#F6004B]">
                      <span className="text-white">{index + 1}</span>
                    </div>
                    <span>{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <ConfirmModal
        isOpenModal={isOpenModal}
        handleConfirm={handleConfirmModal}
        handleCancel={handleCancelModal}
      >
        <span>ยืนยันการจบเกม ?</span>
      </ConfirmModal>
    </>
  );
};

export default Random;
