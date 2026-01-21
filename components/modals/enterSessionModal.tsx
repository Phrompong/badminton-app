import { Form, FormInstance, Input, Modal } from "antd";
import { FC } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const title = () => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xl">เข้าสู่เซสชัน</span>
      <span className="text-xs">
        เข้าสู่เซสชัน กรอก Session Key เพื่อกลับเข้าสู่เซสชันของคุณ
      </span>
    </div>
  );
};

const footer = (form: FormInstance, onCancel: () => void) => {
  return (
    <>
      <div className="flex gap-2">
        <button
          type="button"
          className="border border-1 p-1 rounded-md w-full border-gray-400 hover:bg-gray-100"
          onClick={onCancel}
        >
          ยกเลิก
        </button>
        <button
          type="button"
          className="border border-1 p-1 rounded-md w-full bg-[#00986E] text-white hover:bg-[#007a53]"
          onClick={() => {
            form.submit();
          }}
        >
          เข้าสู่เซสชัน
        </button>
      </div>
    </>
  );
};

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
      title={title()}
      open={open}
      onCancel={onCancel}
      footer={footer(form, onCancel)}
    >
      <div className="flex mt-12 w-full ">
        <Form
          form={form}
          className="w-full"
          layout="vertical"
          onFinish={handleSubmitForm}
        >
          <Form.Item<string>
            label="Session Key"
            name="sessionKey"
            rules={[{ required: true, message: "กรุณากรอกชื่อเซสชัน" }]}
          >
            <Input className="w-full" />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default EnterSessionModal;
