import { Modal } from "antd";
import { FC } from "react";

interface IConfirmModal {
  handleConfirm: () => void;
  handleCancel: () => void;
  children: React.ReactNode;
  isOpenModal: boolean;
}

const ConfirmModal: FC<IConfirmModal> = ({
  handleConfirm,
  handleCancel,
  children,
  isOpenModal = false,
}) => {
  return (
    <Modal open={isOpenModal} onOk={handleConfirm} onCancel={handleCancel}>
      {children}
    </Modal>
  );
};

export default ConfirmModal;
