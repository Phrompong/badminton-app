import { FC, useEffect, useRef } from "react";
import { Button, Form, Input } from "antd";
import { CloseOutlined } from "@ant-design/icons";

interface ICourtsProps {
  data: {
    id?: string;
    courtNo: number;
    courtName?: string;
  }[];
  handleRemoveCourt?: (courtId: string) => void;
  handleAddCourt?: () => void;
  handleChangeCourtName?: (courtId: string, value: string) => void;
  isEdit?: boolean;
}

const formItemStyle = { marginBottom: 16 };

const Courts: FC<ICourtsProps> = ({
  data,
  handleRemoveCourt,
  handleAddCourt,
  handleChangeCourtName,
  isEdit = false,
}) => {
  const form = Form.useFormInstance();

  useEffect(() => {
    if (!form) return;

    form.setFieldsValue({ courtNames: data });
  }, [data, form]);

  return (
    <div className="flex flex-col gap-2 bg-[#F0FDF9] p-2 rounded-md border-2 border-[#CAF9E2] mb-4">
      {data &&
        data.map((item, index) => {
          return (
            <div
              className="grid grid-cols-[1fr_auto] gap-2 items-center w-full"
              key={item.courtNo}
            >
              <Form.Item
                name={["courtNames", index, "courtNo"]}
                initialValue={item.id}
                hidden
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={["courtNames", index, "id"]}
                initialValue={item.id}
                hidden
              >
                <Input />
              </Form.Item>
              <Form.Item<string>
                key={item.courtNo}
                label={`สนามที่ ${index + 1}`}
                name={["courtNames", index, "courtName"]}
                style={formItemStyle}
                rules={[
                  {
                    required: true,
                    message: `กรุณากรอกชื่อสนามที่ ${item.courtNo}`,
                  },
                ]}
              >
                <Input
                  placeholder={`โปรดระบุชื่อสนาม`}
                  onChange={(e) =>
                    handleChangeCourtName?.(item.id || "", e.target.value)
                  }
                />
              </Form.Item>

              {isEdit && (
                <CloseOutlined
                  width={120}
                  style={{
                    cursor: "pointer",
                    color: "red",
                    width: "20px",
                  }}
                  onClick={() => {
                    if (!item.id) return;
                    handleRemoveCourt?.(item.id);
                  }}
                />
              )}
            </div>
          );
        })}
      {isEdit && <Button onClick={() => handleAddCourt?.()}>เพิ่มสนาม</Button>}
    </div>
  );
};

export default Courts;
