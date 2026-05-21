import React from "react";
import { useTranslation, Trans } from "react-i18next";

const Br = () => <br />;

const Territories = () => {
  const { t } = useTranslation();
  return (
    <div className="py-32 px-4 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-12 pt-20">
        {t("territories.title")} <span className="text-orange-500">{t("territories.title_accent")}</span>
      </h1>
      <p className="text-2xl text-gray-400 max-w-3xl leading-relaxed font-medium mb-20">
        <Trans 
          i18nKey="territories.description"
          components={{
            highlight: <span className="text-white" />
          }}
        />
      </p>
      
      <div className="p-12 bg-zinc-900 rounded-[3rem] border border-white/5 shadow-2xl">
         <h3 className="text-xl font-bold mb-8 uppercase tracking-widest text-orange-500 flex items-center gap-4">
           <Trans 
             i18nKey="territories.exclusions_title"
             components={{ br: <Br /> }}
           />
         </h3>
         <p className="text-lg text-gray-400 max-w-2xl leading-relaxed">
           {t("territories.exclusions_desc")}
         </p>
      </div>
    </div>
  );
};

export default Territories;