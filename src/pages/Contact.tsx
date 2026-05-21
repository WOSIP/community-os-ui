import React from "react";
import { useTranslation, Trans } from "react-i18next";

const Br = () => <br />;

const Contact = () => {
  const { t } = useTranslation();
  return (
    <div className="py-32 px-4 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-12 pt-20">
        <Trans 
          i18nKey="contact.title"
          components={{ highlight: <span className="text-orange-500" /> }}
        />
      </h1>
      <p className="text-2xl text-gray-400 max-w-3xl leading-relaxed font-medium mb-20">{t("contact.description")}</p>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="p-10 bg-zinc-950 border border-white/10 rounded-[2.5rem] shadow-xl">
          <h3 className="text-orange-500 font-black uppercase tracking-widest text-xs mb-6">{t("contact.info.email")}</h3>
          <p className="text-xl font-bold">{t("contact.info.email_desc")}</p>
        </div>
        <div className="p-10 bg-zinc-950 border border-white/10 rounded-[2.5rem] shadow-xl">
          <h3 className="text-orange-500 font-black uppercase tracking-widest text-xs mb-6">{t("contact.info.hq")}
          </h3>
          <div className="text-xl font-bold">
            <Trans 
              i18nKey="contact.info.hq_desc"
              components={{ br: <Br /> }}
            />
          </div>
        </div>
        <div className="p-10 bg-zinc-950 border border-white/10 rounded-[2.5rem] shadow-xl">
          <h3 className="text-orange-500 font-black uppercase tracking-widest text-xs mb-6">{t("contact.info.support")}</h3>
          <div className="text-xl font-bold">
            <Trans 
              i18nKey="contact.info.support_desc"
              components={{ br: <Br /> }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;