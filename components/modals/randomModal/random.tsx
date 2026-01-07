import { getAllOnlinePlayers, updatePlayStatus } from "@/app/actions/player";
import { Divider, Dropdown, MenuProps, Space } from "antd";
import { FC, useEffect, useState } from "react";

interface IRandom {
  session: any;
  data: {
    court: string;
    teamA: any[];
    teamB: any[];
  }[];
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

const Random: FC<IRandom> = ({ session, data }) => {
  const [dataItems, setDataItems] = useState<any[]>(data);
  const [onlinePlayers, setOnlinePlayers] = useState<any[]>([]);

  const init = async () => {
    // * update status player isPlaying = true
    for (const dataItem of dataItems) {
      for (const teamA of dataItem.teamA) {
        await updatePlayStatus(teamA.id, true);
      }

      for (const teamB of dataItem.teamB) {
        await updatePlayStatus(teamB.id, true);
      }
    }

    const resultsOnlinePlayers = await getAllOnlinePlayers(session.id);
    setOnlinePlayers(
      resultsOnlinePlayers.map((p) => ({ key: p.id, label: p.name }))
    );
  };

  useEffect(() => {
    init();
  }, [data]);

  const handleChangePlayer = (
    playerId: string,
    index: number,
    team: string
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

  return (
    <div className="flex flex-col mt-4">
      {dataItems.map(({ court, teamA, teamB }) => (
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
              <button className=" border border-[#DAB2FF] rounded-md p-1 w-22 cursor-pointer hover:opacity-80 hover:bg-[#F5E1FF]">
                <span></span>
                <span className="text-xs text-[#8200DA]">แก้ไข</span>
              </button>

              <button className="border border-[#5EEAB4] rounded-md p-1 w-22 cursor-pointer hover:bg-[#E0FFF6]">
                <span></span>
                <span className="text-[#007A55] text-xs">Shuffle</span>
              </button>

              <button className="border border-[#F64100] bg-[#F64100] rounded-md p-1 w-22 cursor-pointer hover:bg-[#d93800] hover:border-[#d93800]">
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
                  disabled={false}
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
                    className="border border-[#D2E6FF] bg-[#F0F6FF] p-2 rounded-md flex items-center gap-4 hover:border-[#2473FF] hover:shadow-md cursor-pointer"
                  >
                    <div className="rounded-full  w-6 h-6 flex items-center justify-center text-xs bg-[#1D6BFF]">
                      <span className="text-white">{index + 1}</span>
                    </div>
                    <span>{name}</span>
                  </div>
                  {/* <a onClick={(e) => e.preventDefault()}>
                    <Space>Hover me</Space>
                  </a> */}
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
      {/* {Array.from({ length: Number(session?.courtCount || 0) }).map(
        (_, courtNumber) => (
          <div
            key={courtNumber}
            className="border border-green-300 rounded-md p-2 shadow-md mb-4"
          >
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span>COURT</span>
                <span>#{courtNumber + 1}</span>
              </div>
              <div className="flex gap-2">
                <button className=" border border-[#DAB2FF] rounded-md p-1 w-22 cursor-pointer hover:opacity-80 hover:bg-[#F5E1FF]">
                  <span></span>
                  <span className="text-xs text-[#8200DA]">แก้ไข</span>
                </button>

                <button className="border border-[#5EEAB4] rounded-md p-1 w-22 cursor-pointer hover:bg-[#E0FFF6]">
                  <span></span>
                  <span className="text-[#007A55] text-xs">Shuffle</span>
                </button>

                <button className="border border-[#F64100] bg-[#F64100] rounded-md p-1 w-22 cursor-pointer hover:bg-[#d93800] hover:border-[#d93800]">
                  <span></span>
                  <span className="text-white text-xs">จบเกม</span>
                </button>
              </div>
            </div>

            <Divider style={{ borderColor: "#94a3b8" }} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ">
              <div className="flex flex-col gap-2 w-full">
                <span className="text-[#2473FF] font-bold">TEAM A</span>
                <div className="border border-[#D2E6FF] bg-[#F0F6FF] p-2 rounded-md flex items-center gap-4 hover:border-[#2473FF] hover:shadow-md cursor-pointer">
                  <div className="rounded-full  w-6 h-6 flex items-center justify-center text-xs bg-[#1D6BFF]">
                    <span className="text-white">1</span>
                  </div>
                  <span>ช้อป</span>
                </div>

                <div className="border border-[#D2E6FF] bg-[#F0F6FF] p-2 rounded-md flex items-center gap-4 hover:border-[#2473FF] hover:shadow-md cursor-pointer">
                  <div className="rounded-full  w-6 h-6 flex items-center justify-center text-xs bg-[#1D6BFF]">
                    <span className="text-white">2</span>
                  </div>
                  <span>ช้อป</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <span className="text-[#C70036] font-bold">TEAM B</span>
                <div className="border border-[#FFDCDF] bg-[#FEF1F2] p-2 rounded-md flex items-center gap-4 hover:border-[#2473FF] hover:shadow-md cursor-pointer">
                  <div className="rounded-full  w-6 h-6 flex items-center justify-center text-xs bg-[#F6004B]">
                    <span className="text-white">1</span>
                  </div>
                  <span>ช้อป</span>
                </div>

                <div className="border border-[#FFDCDF] bg-[#FEF1F2] p-2 rounded-md flex items-center gap-4 hover:border-[#2473FF] hover:shadow-md cursor-pointer">
                  <div className="rounded-full  w-6 h-6 flex items-center justify-center text-xs bg-[#F6004B]">
                    <span className="text-white">2</span>
                  </div>
                  <span>ช้อป</span>
                </div>
              </div>
            </div>
          </div>
        )
      )} */}
    </div>
  );
};

export default Random;
