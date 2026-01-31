import { getPlayerById, updatePlayerName } from "@/app/actions/player";
import { Form, message, Modal } from "antd";
import { FC, useEffect, useState } from "react";
import Title from "../title";
import Footer from "../footer";

interface IEditPlayerModalProps {
  playerId: string;
  open: boolean;
  onCancel: () => void;
}

const formItemStyle = { marginBottom: 12 };

const EditPlayerModal: FC<IEditPlayerModalProps> = ({
  open,
  onCancel,
  playerId,
}) => {
  const [form] = Form.useForm();
  const [playerInformation, setPlayerInformation] = useState<any>(null);

  const init = async () => {
    if (!playerId) return;
    setPlayerInformation(await getPlayerById(playerId));
  };

  useEffect(() => {
    setPlayerInformation(null);
    if (!open) return;
    init();
  }, [open, playerId]);

  if (!playerInformation) return null;

  const handleOnFinish = (vales: any) => {
    updatePlayerName(playerId, vales.name);
    message.success("บันทึกข้อมูลผู้เล่นเรียบร้อยแล้ว");
    onCancel();
  };

  return (
    <Modal
      title={<Title text="แก้ไขข้อมูลผู้เล่น" />}
      open={open}
      onCancel={onCancel}
      width={400}
      footer={
        <Footer
          text="บันททึก"
          isCancel={true}
          handleClickSubmit={() => {
            form.submit();
          }}
          handleClickCancel={onCancel}
        />
      }
    >
      <div className="mt-4">
        <Form
          form={form}
          layout="horizontal"
          initialValues={{
            name: playerInformation?.name || "",
          }}
          onFinish={handleOnFinish}
        >
          <Form.Item label="" name="name" style={formItemStyle}>
            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded-md"
              placeholder="กรอกชื่อ"
            />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default EditPlayerModal;
