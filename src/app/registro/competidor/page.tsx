import React from "react";
import StepProgress from "@/components/registro/StepProgress";
import 'flowbite';
import 'flowbite/dist/flowbite.min.css';

export default function RegistroCompetidor() {
    return (
      <main className="min-h-screen w-full py-8 bg-background-reg flex justify-center">
      <div className="w-full max-w-4xl bg-white shadow-md px-4 sm:px-6 py-6 mb-6 rounded-2xl">
        <StepProgress />
      </div>
      
    </main>

    );
  }