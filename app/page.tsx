"use client";

import Button from "@/components/button";
import Card from "@/components/card";
import EditPlayerModal from "@/components/modals/editPlayerModal";
import { ImportPlayerModal } from "@/components/modals/importPlayerModal";
import PaymentModal from "@/components/modals/paymentModal";
import RandomPlayerModal from "@/components/modals/randomModal/randomPlayerModal";
import SettingModal from "@/components/modals/settingModal";
import Table from "@/components/table";
import TableMobile from "@/components/tableMobile";
import { TextInput } from "@/components/textInput";
import { Copy, Settings, Shuffle, UserPlus, Users } from "lucide-react";
import Image from "next/image";
import { title } from "process";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Session from "./pages/session";
import Main from "./pages/main";

export default function Page() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") || "";
  const [isImportModalPlayerOpen, setIsImportModalPlayerOpen] =
    useState<boolean>(false);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState<boolean>(false);
  const [isRandomPlayerModalOpen, setIsRandomPlayerModalOpen] =
    useState<boolean>(false);
  const [refresh, setRefresh] = useState<number>(0);

  useEffect(() => {}, []);

  const handelCloseImportPlayerModal = () => {
    setIsImportModalPlayerOpen(false);
    setRefresh((prev) => prev + 1);
  };

  const handleCloseSettingModal = () => {
    setIsSettingModalOpen(false);
    setRefresh((prev) => prev + 1);
  };

  return (
    <>
      <div className="flex flex-col gap-8">
        <header className="bg-[#1C2638] w-screen top-0 shadow-xl p-8">
          <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-4">
            <span className="text-white">Badminton</span>
            <div className="flex justify-start gap-2">
              <Button
                text="Import"
                Icon={UserPlus}
                onClick={() => setIsImportModalPlayerOpen((prev) => !prev)}
              />
              <Button
                text="Setting"
                Icon={Settings}
                onClick={() => setIsSettingModalOpen((prev) => !prev)}
              />
              <Button
                text="Random"
                Icon={Shuffle}
                onClick={() => setIsRandomPlayerModalOpen((prev) => !prev)}
              />
            </div>
          </div>
        </header>
        <main className="p-1">
          <div className="max-w-7xl mx-20 mx-auto flex flex-col gap-6">
            {code ? <Main refresh={refresh} /> : <Session />}
          </div>
        </main>
      </div>

      <ImportPlayerModal
        open={isImportModalPlayerOpen}
        onCancel={handelCloseImportPlayerModal}
      />

      <SettingModal
        open={isSettingModalOpen}
        onCancel={handleCloseSettingModal}
      />

      <RandomPlayerModal
        open={isRandomPlayerModalOpen}
        onClose={() => setIsRandomPlayerModalOpen(false)}
      />
    </>
  );
}
