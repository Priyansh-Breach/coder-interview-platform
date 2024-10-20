import { BatteryMedium, Cpu, Database, Volume1 } from "lucide-react";

interface ProgressBarData {
  label: string;
  value: number;
  max: number;
  icon?: JSX.Element;
}

const progressBarsData: ProgressBarData[] = [
  {
    label: "Technical Skills",
    value: 25,
    max: 100,
    icon: (
      <BatteryMedium
        size={10}
        className="text-zinc-400 transition-colors group-hover:text-zinc-300"
      />
    ),
  },
  {
    label: "Communication",
    value: 50,
    max: 100,
    icon: (
      <Volume1
        size={10}
        className="text-zinc-400 transition-colors group-hover:text-zinc-300"
      />
    ),
  },
  {
    label: "Problem Solving",
    value: 75,
    max: 100,
    icon: (
      <Cpu
        size={10}
        className="text-zinc-400 transition-colors group-hover:text-zinc-300"
      />
    ),
  },
  {
    label: "Efficiancy",
    value: 90,
    max: 100,
    icon: (
      <Database
        size={10}
        className="text-zinc-400 transition-colors group-hover:text-zinc-300"
      />
    ),
  },
];

export default function MobileDetail() {
  return (
    <div className="grid size-52 grid-cols-2 grid-rows-2 gap-4  shadow-sm shadow-black/15  rounded-3xl bg-muted p-4 dark:border-zinc-700">
      {progressBarsData.map((bar) => {
        const percentage = (bar.value / bar.max) * 100;

        return (
          <div
            key={`item-${bar.label}`}
            className="group relative flex flex-col-reverse overflow-hidden border rounded-2xl dark:bg-zinc-800 bg-zinc-300"
          >
            <div
              className="w-full dark:bg-stone-700 bg-stone-400"
              style={{ height: `${percentage}%` }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              
              <p className="text-[10px] m-2 mb-0 font-bold  dark:text-zinc-400 transition-colors dark:group-hover:text-zinc-300">
                {bar.label}
              </p>
              <p className="text-[10px] font-bold dark:text-zinc-400 transition-colors dark:group-hover:text-zinc-300">
                {percentage}%
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
