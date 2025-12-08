"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function BreathingExercise() {
  const [active, setActive] = useState(false);
  const [text, setText] = useState("Mulai");

  useEffect(() => {
    if (!active) {
      setText("Mulai");
      return;
    }

    const phases = [
      { t: "Tarik Napas...", d: 4000 },
      { t: "Tahan...", d: 4000 },
      { t: "Hembuskan...", d: 4000 },
    ];

    let i = 0;
    const runPhase = () => {
      setText(phases[i].t);
      i = (i + 1) % phases.length;
    };

    runPhase(); // First run
    const interval = setInterval(runPhase, 4000); // Loop per 4 detik (simplified)

    return () => clearInterval(interval);
  }, [active]);

  return (
    <div className="md:col-span-1 rounded-2xl bg-linear-to-br from-teal-100 to-emerald-50 p-6 shadow-sm border border-teal-100 flex flex-col items-center justify-center text-center relative overflow-hidden">
      {/* Animasi Circle */}
      <div
        className={`absolute w-32 h-32 bg-teal-300 rounded-full blur-2xl opacity-40 transition-all duration-4000 ease-in-out ${
          active ? "scale-[2.5]" : "scale-100"
        }`}
      ></div>

      <h3 className="text-lg font-bold text-teal-900 z-10 mb-2">Latihan Napas</h3>

      <div
        className={`z-10 text-2xl font-bold text-teal-700 h-10 mb-4 transition-all ${active ? "animate-pulse" : ""}`}
      >
        {text}
      </div>

      <Button
        onClick={() => setActive(!active)}
        className={`z-10 rounded-full px-6 ${active ? "bg-red-500 hover:bg-red-600" : "bg-teal-600 hover:bg-teal-700"}`}
      >
        {active ? "Stop" : "Mulai Relaksasi"}
      </Button>
    </div>
  );
}
