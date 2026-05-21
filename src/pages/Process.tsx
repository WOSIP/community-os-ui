import React from "react";
import { useTranslation } from "react-i18next";

const Process = () => {
  const { t } = useTranslation();
  const steps = t("process.steps_data", { returnObjects: true }) as any[];

  return (
    <div className="py-32 px-4 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-12 pt-20">
        {t("process.title")} <span className="text-orange-500">{t("process.title_accent")}</span>
      </h1>
      <p className="text-xl text-gray-400 max-w-2xl leading-relaxed mb-20">{t("process.description")}</p>
      
      <div className="mt-20 space-y-12">
        {Array.isArray(steps) && steps.map((step: any, idx: number) => (
          <div key={idx} className="flex gap-8 items-start">
            <div className="w-16 h-16 rounded-2xl bg-orange-500 flex items-center justify-center text-white text-2xl font-black flex-shrink-0">
              {idx + 1}
            </div>
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h3 className="text-2xl font-bold uppercase">{step.title}</h3>
                <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-bold text-orange-500 uppercase tracking-widest">{step.time}</span>
              </div>
              <p className="text-gray-400 max-w-xl">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Process;