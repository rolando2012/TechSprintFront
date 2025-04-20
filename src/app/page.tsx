import { adlam } from "@/config/fonts";
import "./globals.css";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 ">
      <main className={`flex flex-col gap-[32px] row-start-2 items-center sm:items-start text-bright-gray-950 ${adlam.className}`}>
      <h1 >inicio</h1>
      </main>
    </div>
  );
}
