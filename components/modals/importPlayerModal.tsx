"use client";
import { Dropdown, MenuProps, message, Modal, Space } from "antd";
import TextArea from "antd/es/input/TextArea";
import { FC, useEffect, useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import { createPlayer } from "@/app/actions/player";
import { getSessionByRoomCode } from "@/app/actions/session";
import { useSearchParams } from "next/navigation";
import Footer from "../footer";
import Title from "../title";
import { Upload } from "lucide-react";

const levelOptions = [
  { key: "BG", label: "BG – Beginner (มือใหม่)" },
  { key: "N", label: "N – Normal (ฟอร์มมาตรฐาน)" },
  { key: "P", label: "P – Pro (นักกีฬา / โค้ช)" },
];

const levelItems: MenuProps["items"] = levelOptions.map(({ key, label }) => ({
  key,
  label,
}));

interface IImportPlayerModalProps {
  open?: boolean;
  onCancel?: () => void;
}

const title = () => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-2xl font-semibold text-gray-900">
        Import Players
      </span>
      <span className="text-xs text-gray-600">
        คัดลอกรายชื่อจาก LINE มาวางได้เลย
      </span>
    </div>
  );
};

interface IImportPlayerFooterProps {
  onClear?: () => void;
  onImport?: () => void;
}

interface IPlayer {
  name: string;
  level: string;
}

export const ImportPlayerModal: FC<IImportPlayerModalProps> = ({
  open = false,
  onCancel,
}) => {
  const search = useSearchParams();
  const code = search.get("code");
  const [players, setPlayers] = useState<string>("");
  const [previewPlayers, setPreviewPlayers] = useState<IPlayer[]>([]);

  const handleImportPlayers = async () => {
    const session = await getSessionByRoomCode(code ?? "");

    const obj = previewPlayers.map(({ name, level }) => {
      return {
        sessionId: session?.id ?? "",
        name,
        level,
        isPlaying: false,
      };
    });

    await createPlayer(obj);

    message.success("นำเข้าผู้เล่นเรียบร้อย");
    onCancel?.();
  };

  const handleChangeLevel = (index: number, level: string) => {
    setPreviewPlayers((prev) =>
      prev.map((player, i) => (i === index ? { ...player, level } : player)),
    );
  };

  const getLevelLabel = (level: string) =>
    levelOptions.find((option) => option.key === level)?.label ?? level;

  const previewImportPlayers = (value: string) => {
    const _players = value
      .split(/\r?\n/)
      .map((name) => name.replace(/^\s*\d+\s*[.)]?\s*/, "").trim())
      .filter((name) => name.length > 0);

    setPreviewPlayers(
      _players.map((name) => ({
        name,
        level: "BG",
      })),
    );
  };

  useEffect(() => {
    if (!open) {
      setPlayers("");
      setPreviewPlayers([]);
    }
  }, [open]);

  useEffect(() => {
    previewImportPlayers(players);
  }, [players]);

  return (
    <Modal
      title={
        <Title
          icon={
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Upload className="w-6 h-6 text-white" />
            </div>
          }
          text="เพิ่มผู้เล่น"
        />
      }
      open={open}
      onCancel={onCancel}
      footer={
        <Footer
          text="น้ำข้อมูลเข้า"
          isCancel={true}
          textCancel="ล้างข้อมูล"
          handleClickSubmit={() => handleImportPlayers()}
          handleClickCancel={() => setPlayers("")}
        />
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col border border-blue-300 bg-blue-50 p-4 rounded-md  ">
          <span className="text-sm font-bold text-blue-600">วิธีใช้</span>
          <ul className="list-disc p-2 flex flex-col gap-2 ml-4">
            <li className="text-sm font-bold text-blue-600">
              วางรายชื่อจาก LINE (1 ชื่อต่อ 1 บรรทัด)
            </li>
            <li className="text-sm font-bold text-blue-600">
              ระบบจะตัดหมายเลข 1. 2. 3. ออกอัตโนมัติ
            </li>
            <li className="text-sm font-bold text-blue-600">
              แก้ไขระดับแต่ละคนได้ในตัวอย่าง
            </li>
            <li className="text-sm font-bold text-blue-600">
              กด "เพิ่มผู้เล่น" เพื่อนำเข้า
            </li>
          </ul>
        </div>

        <div>
          <span className="font-bold">รายชื่อผู้เล่น</span>
        </div>

        <TextArea
          onChange={(e) => setPlayers(e.target.value)}
          value={players}
          rows={8}
        />

        {previewPlayers.length > 0 && (
          <>
            <span className="font-bold text-[#356E5D]">
              ตรวจสอบและแก้ไขระดับ ({previewPlayers.length} คน)
            </span>
            {previewPlayers.map(({ name, level }: IPlayer, index: number) => (
              <div
                key={`${name}-${index}`}
                className="flex flex-col  gap-2 border border-green-300 p-2 rounded-md bg-white items-center"
              >
                <div className="w-full flex justify-between items-center">
                  <div className="flex gap-2 ">
                    <div className="w-6 h-6 rounded-full bg-[#00AE82] flex justify-center items-center">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <span>{name}</span>
                  </div>
                  <Dropdown
                    menu={{
                      items: levelItems,
                      onClick: ({ key }) =>
                        handleChangeLevel(index, String(key)),
                    }}
                  >
                    <a
                      onClick={(e) => e.preventDefault()}
                      className="flex gap-1 items-center border border-gray-300 p-2 rounded-md hover:bg-gray-100"
                    >
                      <Space>{getLevelLabel(level)}</Space>
                      <DownOutlined />
                    </a>
                  </Dropdown>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </Modal>
  );
};
