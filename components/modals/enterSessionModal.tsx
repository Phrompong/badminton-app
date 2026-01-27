import { Divider, Form, FormInstance, Input, Modal } from "antd";
import { FC } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Footer from "../footer";
import Title from "../title";
import { KeyRound } from "lucide-react";

interface IEnterSessionModalProps {
  open: boolean;
  onCancel: () => void;
}

const EnterSessionModal: FC<IEnterSessionModalProps> = ({ open, onCancel }) => {
  const [form] = Form.useForm();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSubmitForm = (values: any) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("code", values.sessionKey);
    router.replace(`?${params.toString()}`);
    onCancel?.();
  };

  return (
    <Modal
      title={
        <Title text="เข้าสู่เซสชัน" icon={<KeyRound className="w-5 h-5" />} />
      }
      open={open}
      onCancel={onCancel}
      footer={
        <Footer text="เข้าสู่เซสชัน" handleClickSubmit={() => form.submit()} />
      }
      centered
      width={400}
    >
      <Form form={form} layout="horizontal" onFinish={handleSubmitForm}>
        <Form.Item<string>
          label=""
          name="sessionKey"
          rules={[{ required: true, message: "กรุณากรอกชื่อเซสชัน" }]}
        >
          <Input className="w-full h-14" placeholder="กรุณากรอกชื่อเซสชัน" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EnterSessionModal;
