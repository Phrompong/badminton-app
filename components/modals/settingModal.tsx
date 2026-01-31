"use client";

import { getSessionByRoomCode, patchSession } from "@/app/actions/session";
import { Form, FormInstance, Input, message, Modal } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import Courts from "../courts";
import {
  createCourt,
  getCourtAvailableBySessionId,
  patchNameCourt,
  removeCourt,
} from "@/app/actions/court";
import { checkPlayerInActiveCourt } from "@/app/actions/transactionRandom";
import Footer from "../footer";
import Title from "../title";
import { Settings } from "lucide-react";
interface ISettingModalProps {
  open?: boolean;
  onCancel?: () => void;
}

const formItemStyle = { marginBottom: 8 };

const SettingModal: FC<ISettingModalProps> = ({ open = false, onCancel }) => {
  const [form] = Form.useForm();
  const search = useSearchParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = search.get("code");
  const [sessionData, setSessionData] = useState<any>();
  const [courtData, setCourtData] = useState<any[]>([]);

  const handleSubmitForm = async (values: any) => {
    await patchSession({
      sessionId: sessionData.id,
      courtCount: values.courtNames.length,
      amountPerGame: values.amountPerGame,
    });

    const updateCourtData = values.courtNames.filter(
      (o: any) => o.id && !o.id.toString().startsWith("temp-"),
    );
    const newCourtData = values.courtNames.filter(
      (o: any) => !o.id || o.id.toString().startsWith("temp-"),
    );

    if (newCourtData.length > 0) {
      for (const newCourt of newCourtData) {
        await createCourt({
          no: newCourt.courtNo,
          sessionId: sessionData.id,
          name: newCourt.courtName,
          createdBy: "00000000-0000-0000-0000-000000000000",
          createdDate: new Date(),
        });
      }
    }

    if (updateCourtData.length > 0) {
      for (const court of updateCourtData) {
        await patchNameCourt(court.id, court.courtName);
      }
    }

    message.success("บันทึกการตั้งค่าเรียบร้อยแล้ว");

    setTimeout(() => {
      onCancel?.();
    }, 500);
  };

  const handleClickNewSession = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("code", "");

    router.replace(`?${params.toString()}`);

    onCancel?.();
  };

  const init = async () => {
    const session = await getSessionByRoomCode(code || "");

    if (!session) return;

    const court = await getCourtAvailableBySessionId(session.id);

    if (!court) return;

    form.setFieldsValue({
      courtCount: session.courtCount,
      amountPerGame: session.amountPerGame,
    });

    setCourtData(court);
    setSessionData(session);
  };

  useEffect(() => {
    if (!open) return;

    init();
  }, [open, form]);

  const handleRemoveCourt = async (courtId: string) => {
    // * เชคว่ามีคนเล่นอยู่มั้ยที่ court
    if (!courtId.startsWith("temp-")) {
      const playerInActiveCourt = await checkPlayerInActiveCourt(courtId);

      if (playerInActiveCourt) {
        alert("ไม่สามารถลบสนามนี้ได้ เนื่องจากมีผู้เล่นกำลังเล่นอยู่");
        return;
      }

      await removeCourt(courtId);
    }

    const updatedCourts = courtData.filter((court) => court.id !== courtId);
    setCourtData(updatedCourts);
  };

  const handleAddCourt = async () => {
    console.log("add court", courtData);
    setCourtData((prev) => {
      const newCourt = {
        id: `temp-${new Date().getTime()}`,
        no: prev.length + 1,
      };
      return [...prev, newCourt];
    });
  };

  const handleChangeCourtName = (courtId: string, value: string) => {
    setCourtData((prev) =>
      prev.map((court) => {
        if (court.id === courtId) {
          return {
            ...court,
            name: value,
          };
        }
        return court;
      }),
    );
  };

  return (
    <Modal
      title={<Title icon={<Settings />} text="ตั้งค่า" />}
      open={open}
      onCancel={onCancel}
      footer={
        <Footer
          text="บันทึกการตั้งค่า"
          isCancel={true}
          handleClickSubmit={form.submit}
          handleClickCancel={onCancel}
        />
      }
      className="overflow-y-auto"
    >
      <Form form={form} layout="vertical" onFinish={handleSubmitForm}>
        <div className="flex flex-col gap-4 mt-6">
          <span className="text-xl">Game Setting</span>

          <div className="flex flex-col">
            <Form.Item<number>
              label="ค่าเล่นต่อเกม (บาท)"
              name="amountPerGame"
              style={formItemStyle}
              rules={[
                {
                  required: true,
                  message: "Please input your amount per game!",
                },
              ]}
            >
              <Input type="number" />
            </Form.Item>

            <Courts
              data={courtData.map((court) => {
                return {
                  id: court.id,
                  courtNo: court.no,
                  courtName: court.name,
                };
              })}
              handleRemoveCourt={handleRemoveCourt}
              handleAddCourt={handleAddCourt}
              isEdit={true}
              handleChangeCourtName={handleChangeCourtName}
            />

            <div className="flex flex-col gap-4">
              <span className="text-xl text-[#82181A]">Danger Zone</span>

              <div className="border border-[#FFCACA] rounded-md bg-[#FFF3F0] p-4 flex flex-col gap-4">
                <span className="text-[#82181A] font-bold">
                  เริ่มเซสชันใหม่
                </span>
                <span className="text-[#DB6362] text-xs">
                  การดำเนินการนี้จะลบข้อมูลทั้งหมด รวมถึงรายชื่อผู้เล่น,
                  การเช็คอิน, ข้อมูลการชำระเงิน และผลการแข่งขันทั้งหมด
                  ไม่สามารถกู้คืนได้
                </span>

                <button
                  onClick={handleClickNewSession}
                  className="w-full p-2 border border-[#DB6362] rounded-md hover:bg-[#FFEBEB] transition cursor-pointer"
                >
                  <span className="text-[#DB6362] font-bold">
                    เริ่มเซสชันใหม่
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default SettingModal;
