import { adlam } from "@/config/fonts";
import "./globals.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 ">
      <main className="bg-white flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
      <Link
          href="/registro/competidor/datos-personales"
          className={`bg-boton hover:bg-boton-hover text-white ${adlam.className} py-2 px-1 rounded-full`}
        >
          Comienza el desafio
        </Link>
      </main>
    </div>
  );
}
