import React from "react";
import { useTranslation, Trans } from "react-i18next";

const Application = () => {
  const { t } = useTranslation();
  return (
    <div className="py-32 px-4 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-12 pt-20">
        <Trans 
          i18nKey="application.title"
          components={{ highlight: <span className="text-orange-500" /> }}
        />
      </h1>
      <p className="text-2xl text-gray-400 max-w-3xl leading-relaxed font-medium mb-20">{t("application.subtitle")}</p>
      
      <div className="bg-zinc-950 p-20 rounded-[4rem] border border-white/5 text-center shadow-2xl">
        <p className="text-gray-600 uppercase tracking-[0.3em] font-black text-xs">{t("application.form.processing")}</p>
      </div>
    </div>
  );
};

export default Application;