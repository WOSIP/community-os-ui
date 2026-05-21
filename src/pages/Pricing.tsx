import React from "react";
import { useTranslation } from "react-i18next";

const Pricing = () => {
  const { t } = useTranslation();
  return (
    <div className="py-32 px-4 max-w-7xl mx-auto">
      <h1 className="text-5xl font-black uppercase tracking-tighter mb-8">
        {t("pricing.title")} <span className="text-orange-500">{t("pricing.title_accent")}</span>
      </h1>
      <p className="text-xl text-gray-400 max-w-2xl">{t("pricing.description")}</p>
      <div className="mt-12 p-12 bg-zinc-900 rounded-[3rem] border border-white/5 text-center">
        <h3 className="text-sm font-bold uppercase tracking-widest text-orange-500 mb-4">{t("pricing.formula_title")}</h3>
        <div className="text-6xl md:text-8xl font-black text-white mb-8">{t("pricing.formula_value")}</div>
      </div>
    </div>
  );
};

export default Pricing;