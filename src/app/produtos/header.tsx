"use client";

import Image from "next/image";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import useUserStore from "@/store/user";

export default function Header() {
  const user = useUserStore((state) => state.user);

  return (
    <header className="flex flex-row bg-[#59BC04] text-white py-4 px-4 md:px-20 items-center justify-between gap-2 min-h-20 max-h-20">
      <Image
        src="/logobanner.png"
        alt="Logo da Innovation Brindes"
        width={100}
        height={100}
        className="brightness-200"
      />

      <div className="flex flex-row gap-4 items-center">
        <div className="flex relative w-8 h-8 items-center my-auto">
          <div className="absolute text-[#59BC04] bg-white rounded-full top-0 right-0 w-5 h-5 flex items-center justify-center text-xs">
            11
          </div>
          <FaEnvelope />
        </div>

        <div className="flex relative w-8 h-8 items-center my-auto">
          <div className="absolute text-[#59BC04] bg-white rounded-full top-0 right-0 w-5 h-5 flex items-center justify-center text-xs">
            11
          </div>
          <FaPhoneAlt />
        </div>

        <div className="w-fit h-fit bg-white p-1 items-center rounded-[50%]">
          <Image
            src="/user.jpeg"
            alt="Usuário"
            width={40}
            height={40}
            className="rounded-[50%]"
          />
        </div>

        <div className="hidden md:flex flex-col">
          <p>
            {user?.nome_usuario ?? "Usuário"} <br />
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </p>
        </div>
      </div>
    </header>
  );
}
