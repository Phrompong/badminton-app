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
import ConfirmModal from "@/components/modals/confirmModal";

export default function Page() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") || "";
  const [isImportModalPlayerOpen, setIsImportModalPlayerOpen] =
    useState<boolean>(false);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState<boolean>(false);
  const [isRandomPlayerModalOpen, setIsRandomPlayerModalOpen] =
    useState<boolean>(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState<boolean>(false);
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
      <div className="flex flex-col gap-8 bg-gradient-to-br from-indigo-900 via-blue-800 to-teal-700 relative overflow-hidden min-h-screen">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Animated Gradient Orbs */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute -top-48 -left-48 w-96 h-96 bg-gradient-to-br from-cyan-400/30 via-teal-400/30 to-emerald-400/30 rounded-full blur-3xl animate-pulse"></div>
            <div
              className="absolute top-1/4 -right-32 w-80 h-80 bg-gradient-to-br from-blue-400/25 via-indigo-400/25 to-purple-400/25 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute -bottom-32 left-1/4 w-96 h-96 bg-gradient-to-tr from-teal-400/30 via-cyan-400/30 to-blue-400/30 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>
            <div
              className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-bl from-emerald-400/20 via-teal-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "1.5s" }}
            ></div>
          </div>

          {/* Overlay Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>
        {code ? (
          <header className="bg-gradient-to-r from-slate-800 via-gray-800 to-slate-900 border-b border-slate-700/50 sticky w-screen top-0 shadow-xl p-8">
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
        ) : (
          <></>
        )}
        <main>{code ? <Main refresh={refresh} /> : <Session />}</main>
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
