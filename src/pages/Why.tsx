import React from "react";
import { motion } from "framer-motion";
import { Award, Shield, Zap, Globe, TrendingUp, Users, Rocket, Cpu, LifeBuoy, ArrowRight, CheckCircle2 } from "lucide-react";
import { useTranslation, Trans } from "react-i18next";

const Why = () => {
  const { t } = useTranslation();
  const icons = [Award, Shield, Zap, Globe, TrendingUp, Users, Rocket, Cpu, LifeBuoy, Rocket];

  const reasons = [
    { title: t("reasons.reason_1.title"), desc: t("reasons.reason_1.desc") },
    { title: t("reasons.reason_2.title"), desc: t("reasons.reason_2.desc") },
    { title: t("reasons.reason_3.title"), desc: t("reasons.reason_3.desc") },
    { title: t("reasons.reason_4.title"), desc: t("reasons.reason_4.desc") },
    { title: t("reasons.reason_5.title"), desc: t("reasons.reason_5.desc") },
    { title: t("reasons.reason_6.title"), desc: t("reasons.reason_6.desc") },
    { title: t("reasons.reason_7.title"), desc: t("reasons.reason_7.desc") },
    { title: t("reasons.reason_8.title"), desc: t("reasons.reason_8.desc") },
    { title: t("reasons.reason_9.title"), desc: t("reasons.reason_9.desc") },
    { title: t("reasons.reason_10.title"), desc: t("reasons.reason_10.desc") },
  ];

  return (
    <div className="bg-black text-white py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 uppercase tracking-tight"
          >
            <Trans i18nKey="why.title"> <br /> du <span className="text-orange-500"></span></Trans>
          </motion.h1>
          <p className="text-base text-gray-400 max-w-3xl leading-relaxed font-medium">
            {t("why.description")}
          </p>
        </div>

        {/* Detailed Reasons */}
        <div className="space-y-20 mb-24">
          {reasons.map((reason, idx) => {
            const Icon = icons[idx];
            const isEven = idx % 2 === 0;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-10 items-center`}
              >
                <div className="flex-1 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-lg">
                      <Icon size={20} />
                    </div>
                    <span className="text-orange-500 font-bold text-3xl opacity-60 md:opacity-20">{(idx + 1).toString().padStart(2, '0')}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight leading-tight">{reason.title}</h2>
                  <p className="text-base text-gray-400 leading-relaxed font-medium">
                    {reason.desc}
                  </p>
                  <div className="flex items-center gap-2.5 p-2.5 bg-zinc-900 rounded-lg border border-white/5 w-fit">
                    <CheckCircle2 className="text-orange-500" size={14} />
                    <span className="font-bold text-[10px] text-gray-300">{t("why.strategic_value")}</span>
                  </div>
                </div>
                <div className="flex-1 w-full aspect-video bg-zinc-900 rounded-[1.5rem] border border-white/10 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-30 transition-opacity">
                     <Icon size={100} className="text-orange-500" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Schema Section */}
        <div className="bg-zinc-950 border border-white/5 rounded-[2.5rem] p-8 md:p-14 mb-20 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-[80px] -z-10"></div>
          <h2 className="text-2xl font-bold mb-12 text-center uppercase tracking-tight">{t("why.model")}</h2>
          
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Traditional Model */}
            <div className="flex flex-col items-center">
              <div className="text-gray-600 font-bold mb-6 text-[9px] uppercase tracking-[0.4em]">{t("why.traditional_model")}</div>
              <div className="space-y-3 w-full max-w-xs text-center relative">
                <div className="p-5 bg-zinc-900 border border-white/10 rounded-xl font-bold text-gray-500 uppercase tracking-widest text-xs">VISA</div>
                <div className="flex justify-center"><ArrowRight className="rotate-90 text-zinc-800" size={20} /></div>
                <div className="p-5 bg-zinc-900 border border-white/10 rounded-xl font-bold text-gray-500 uppercase tracking-widest text-xs">{t("why.banks")}</div>
                <div className="flex justify-center"><ArrowRight className="rotate-90 text-zinc-800" size={20} /></div>
                <div className="p-5 bg-zinc-900 border border-white/10 rounded-xl font-bold text-gray-500 uppercase tracking-widest text-xs">{t("why.individual_clients")}</div>
              </div>
            </div>

            {/* Helloopass Model */}
            <div className="flex flex-col items-center">
              <div className="text-orange-500 font-bold mb-6 text-[9px] uppercase tracking-[0.4em]">{t("why.hello_infrastructure")}</div>
              <div className="space-y-3 w-full max-w-xs text-center relative">
                <div className="p-5 bg-orange-500 border border-orange-400 rounded-xl font-bold text-white uppercase tracking-widest text-xs shadow-lg shadow-orange-500/20">Helloopass OS</div>
                <div className="flex justify-center"><ArrowRight className="rotate-90 text-orange-500" size={20} /></div>
                <div className="p-5 bg-zinc-900 border border-orange-500/30 rounded-xl font-bold text-white uppercase tracking-widest text-xs">Communautés (Union/ONG)</div>
                <div className="flex justify-center"><ArrowRight className="rotate-90 text-orange-500" size={20} /></div>
                <div className="p-5 bg-zinc-900 border border-orange-500/30 rounded-xl font-bold text-white uppercase tracking-widest text-xs">{t("why.active_members")}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Contract Excerpt */}
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="p-8 md:p-10 bg-zinc-950 border-l-4 border-orange-500 rounded-r-2xl relative shadow-xl"
          >
            <h3 className="text-lg font-bold mb-4 text-orange-500 flex items-center gap-3 uppercase tracking-widest">
              <Shield size={18} /> {t("why.contract.title")}
            </h3>
            <p className="text-gray-300 italic text-lg md:text-xl leading-relaxed font-medium">
              {t("why.contract.quote")}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Why;