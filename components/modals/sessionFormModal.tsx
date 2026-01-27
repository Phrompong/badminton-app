"use client";
import type { CreateSessionInput } from "@/app/actions/models/session.model";
import { createSession } from "@/app/actions/session";
import { DatePicker, Form, Input, Modal, TimePicker } from "antd";
import type { Dayjs } from "dayjs";
import { message } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import Courts from "../courts";
import Footer from "../footer";
import Title from "../title";

const formItemStyle = { marginBottom: 16 };

type SessionFormValues = {
  name: string;
  date: Dayjs;
  time?: Dayjs;
  location?: string;
  playerCount?: number | string;
  courtCount?: number | string;
  roomCode: string;
  amountPerGame: number;
  courtNames: string[];
};

interface ISessionModalProps {
  open: boolean;
  onCancel: () => void;
}

const SessionModal = ({ open, onCancel }: ISessionModalProps) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const searchParams = useSearchParams();
  const courtCount = Form.useWatch("courtCount", form);

  const handleSubmitForm = async (value: SessionFormValues) => {
    try {
      const startAt = value.date
        .hour(value.time?.hour() ?? 0)
        .minute(value.time?.minute() ?? 0)
        .second(value.time?.second() ?? 0)
        .millisecond(0)
        .toISOString();

      const payload: CreateSessionInput = {
        name: value.name.trim(),
        startAt,
        location: value.location?.trim() ?? "",
        playerCount:
          value.playerCount === undefined || value.playerCount === null
            ? 0
            : Number(value.playerCount),
        courtCount: Number(value.courtCount),
        roomCode: value.roomCode.trim(),
        amountPerGame: value.amountPerGame,
        courtNames: value.courtNames.map((name, index) => ({
          courtNo: index + 1,
          courtName: name.trim(),
        })),
      };

      await createSession(payload);

      message.success("สร้างเซสชันสำเร็จ");

      setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("code", value.roomCode);
        router.replace(`?${params.toString()}`);
        onCancel?.();
      }, 1000);
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการสร้างเซสชัน กรุณาลองใหม่อีกครั้ง");
      return;
    }
  };

  return (
    <Modal
      title={<Title text="สร้างเซสชันใหม่" />}
      open={open}
      onCancel={onCancel}
      footer={
        <Footer
          text="สร้างเซสชัน"
          isCancel={true}
          handleClickSubmit={() => {
            form.submit();
          }}
          handleClickCancel={onCancel}
        />
      }
    >
      <Form form={form} layout="vertical" onFinish={handleSubmitForm}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <Form.Item<string>
              label="ชื่อก๊วน"
              name="name"
              style={formItemStyle}
              rules={[{ required: true, message: "กรุณากรอกชื่อเซสชัน" }]}
            >
              <Input placeholder="เช่น เช้าวันเสาร์" />
            </Form.Item>
            <div className="flex gap-2">
              <Form.Item
                label="วันที่"
                name="date"
                className="w-full"
                style={formItemStyle}
                rules={[{ required: true, message: "กรุณาเลือกวันที่" }]}
              >
                <DatePicker className="w-full" placeholder="เลือกวันที่" />
              </Form.Item>

              <Form.Item
                label="เวลา"
                name="time"
                className="w-full"
                style={formItemStyle}
                rules={[{ required: true, message: "กรุณาเลือกเวลา" }]}
              >
                <TimePicker className="w-full" placeholder="เลือกเวลา" />
              </Form.Item>
            </div>

            <Form.Item<string>
              label="สถานีที่"
              name="location"
              style={formItemStyle}
              rules={[{ required: true, message: "กรุณากรอกสถานที่" }]}
            >
              <Input placeholder="เช่น สนาม A หรือ สถานี 1" />
            </Form.Item>

            <div className="flex gap-2">
              <Form.Item<number>
                label="จำนวนผู้เล่น"
                name="playerCount"
                className="w-full"
                style={formItemStyle}
                rules={[{ required: true, message: "กรุณากรอกจำนวนผู้เล่น" }]}
              >
                <Input
                  type="number"
                  min={0}
                  className="w-full"
                  placeholder="เช่น 16"
                />
              </Form.Item>

              <Form.Item<number>
                label="จำนวนสนาม"
                name="courtCount"
                className="w-full"
                style={formItemStyle}
                rules={[{ required: true, message: "กรุณากรอกจำนวนสนาม" }]}
              >
                <Input
                  type="number"
                  min={0}
                  className="w-full"
                  placeholder="เช่น 4"
                />
              </Form.Item>
            </div>

            {courtCount && (
              <Courts
                data={Array.from({
                  length: Number(courtCount) || 0,
                }).map((item, index) => {
                  return {
                    courtNo: index + 1,
                  };
                })}
              />
            )}

            <div className="flex gap-2 ">
              <Form.Item<number>
                className="w-full"
                label="ค่าเล่นต่อเกมส์ (บาท)"
                name="amountPerGame"
                style={formItemStyle}
                rules={[
                  { required: true, message: "กรุณากรอกค่าเล่นต่อเกมส์" },
                ]}
              >
                <Input placeholder="เช่น 100" />
              </Form.Item>

              <Form.Item<string>
                className="w-full"
                label="Room Code"
                name="roomCode"
                style={formItemStyle}
                rules={[{ required: true, message: "กรุณากรอก Room Code" }]}
              >
                <Input placeholder="เช่น BDM-1234" />
              </Form.Item>
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default SessionModal;
