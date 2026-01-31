import { updateIsPaidStatus } from "@/app/actions/player";
import { getPlayerCountInSession } from "@/app/actions/transactionRandom";
import { message, Modal } from "antd";
import React, { FC, useEffect } from "react";
import Title from "../title";
import { CreditCard } from "lucide-react";

interface IFooterProps {
  handleConfirmPayment: () => void;
  isPaid: boolean;
}

const Footer: FC<IFooterProps> = ({ handleConfirmPayment, isPaid }) => {
  return (
    <div className="flex justify-center">
      <button
        onClick={handleConfirmPayment}
        className={
          isPaid
            ? "bg-red-600 p-2 rounded-md hover:opacity-80 cursor-pointer"
            : "bg-[#00A63D] p-2 rounded-md hover:opacity-80 cursor-pointer"
        }
      >
        <span className="text-white">
          {isPaid ? "ยกเลิกการชำระ" : "ยืนยันการชำระ"}
        </span>
      </button>
    </div>
  );
};

interface IPaymentModalProps {
  playerId: string;
  open: boolean;
  onCancel: () => void;
}

const PaymentModal: React.FC<IPaymentModalProps> = ({
  playerId,
  open,
  onCancel,
}) => {
  const [playerInformation, setPlayerInformation] = React.useState<any>(null);

  const init = async () => {
    const data = await getPlayerCountInSession(playerId);

    setPlayerInformation(data);
  };

  useEffect(() => {
    if (!open) return;
    init();
  }, [open]);

  if (!playerInformation) return null;

  const handleConfirmPayment = async () => {
    await updateIsPaidStatus(
      playerId,
      !playerInformation?.playerInformation?.isPaid,
    );

    message.success(
      playerInformation?.playerInformation?.isPaid
        ? "ยกเลิกการชำระเงินเรียบร้อย"
        : "ชำระเงินเรียบร้อย",
    );

    onCancel();
  };

  if (!playerInformation) return null;

  return (
    <Modal
      title={<Title icon={<CreditCard />} text="สรุปค่าใช้จ่าย" />}
      open={open}
      onCancel={onCancel}
      footer={
        <Footer
          handleConfirmPayment={handleConfirmPayment}
          isPaid={playerInformation?.playerInformation?.isPaid}
        />
      }
    >
      <div className="mt-6 flex flex-col gap-2">
        <div className="flex justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xl font-bold">
              {playerInformation?.playerInformation?.name}
            </span>
          </div>
          <div>
            {playerInformation?.playerInformation?.isPaid === true ? (
              <span className="border border-1 w-auto rounded-md p-1 bg-green-100 text-green-700 border-green-200">
                ชำระแล้ว
              </span>
            ) : (
              <span className="border border-1 w-auto rounded-md p-1 bg-orange-100 text-orange-700 border-orange-200">
                รอชำระ
              </span>
            )}
          </div>
        </div>

        <div className="border border-gray-100"></div>

        <div className="border border-[#D4F9E7] p-2 rounded-md flex flex-col gap-4 bg-[#EBFDF5]">
          <span className="font-bold text-lg text-[#004E3B]">
            รายละเอียดค่าใช้จ่าย
          </span>

          <div className="flex justify-between">
            <span className="text-lg">จำนวนเกมที่เล่น</span>
            <span className="text-lg">
              {playerInformation?.countTransaction} เกม
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-lg">ค่าเล่นต่อเกม</span>
            <span className="text-lg">100 บาท</span>
          </div>
        </div>

        <div className="bg-[#00A150] flex justify-between items-center p-2 rounded-md w-full h-28">
          <span className="font-bold text-white text-xl">รวมทั้งหมด</span>
          <span className="font-bold text-white text-xl">
            {playerInformation?.countTransaction * 100} บาท
          </span>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentModal;
