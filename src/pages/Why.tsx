import React from "react";
import { motion } from "framer-motion";
import { Award, Shield, Zap, Globe, TrendingUp, Users, Rocket, Cpu, LifeBuoy, ArrowRight, CheckCircle2 } from "lucide-react";
import { useTranslation, Trans } from "react-i18next";

const Br = () => <br />;

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
        {/* Hero Section */}
        <div className="mb-20 pt-20">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 uppercase tracking-tighter leading-[0.9]"
          >
            <Trans 
              i18nKey="why.title" 
              components={{ 
                br: <Br />, 
                highlight: <span className="text-orange-500" /> 
              }} 
            />
          </motion.h1>
          <p className="text-xl text-gray-400 max-w-3xl leading-relaxed font-medium">
            {t("why.description")}
          </p>
        </div>

        {/* Comparison Section (Visa vs Helloopass) */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">{t("comparison.title")}</h2>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">{t("comparison.subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* Visa Card */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-950 border border-white/5 rounded-[2.5rem] p-12 flex flex-col shadow-2xl"
            >
              <div className="mb-10">
                <div className="text-blue-500 font-black text-5xl italic tracking-tighter mb-2">VISA</div>
                <div className="text-gray-600 font-bold uppercase tracking-widest text-xs">{t("comparison.visa.subtitle")}</div>
              </div>
              <ul className="space-y-8 flex-grow">
                {[1, 2, 3].map((i) => (
                  <li key={i} className="flex items-start gap-5 text-gray-500 font-medium">
                    <div className="mt-2 w-2 h-2 rounded-full bg-gray-800 flex-shrink-0" />
                    <p className="text-lg leading-relaxed">
                      <Trans 
                        i18nKey={`comparison.visa.item_${i}`}
                        components={{ highlight: <span className="text-gray-300 font-black" /> }}
                      />
                    </p>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Helloopass Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-900 border border-orange-500/20 rounded-[2.5rem] p-12 flex flex-col shadow-2xl shadow-orange-500/5"
            >
              <div className="mb-10 flex justify-between items-start">
                <div>
                  <div className="text-orange-500 font-black text-5xl tracking-tighter mb-2">HELLOOPASS<span className="text-white">.</span></div>
                  <div className="text-orange-500/60 font-bold uppercase tracking-widest text-xs">{t("comparison.hello.subtitle")}</div>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-xl shadow-orange-500/20">
                  <Zap size={28} fill="currentColor" />
                </div>
              </div>
              <ul className="space-y-8 flex-grow">
                {[1, 2, 3].map((i) => (
                  <li key={i} className="flex items-start gap-5 text-gray-300 font-medium">
                    <div className="mt-2 w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
                    <p className="text-lg leading-relaxed">
                      <Trans 
                        i18nKey={`comparison.hello.item_${i}`}
                        components={{ highlight: <span className="text-white font-black" /> }}
                      />
                    </p>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* Detailed Reasons Section */}
        <div className="text-center mb-24">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6">{t("reasons.title")}</h2>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">{t("reasons.subtitle")}</p>
        </div>

        <div className="space-y-32 mb-40">
          {reasons.map((reason, idx) => {
            const Icon = icons[idx];
            const isEven = idx % 2 === 0;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-16 md:gap-24 items-center`}
              >
                <div className="flex-1 space-y-8">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-xl shadow-orange-500/20">
                      <Icon size={28} />
                    </div>
                    <span className="text-orange-500 font-black text-5xl opacity-20">{(idx + 1).toString().padStart(2, '0')}</span>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight">{reason.title}</h3>
                  <p className="text-xl text-gray-400 leading-relaxed font-medium">
                    {reason.desc}
                  </p>
                  <div className="inline-flex items-center gap-4 px-5 py-2.5 bg-zinc-900 rounded-2xl border border-white/5 shadow-lg">
                    <CheckCircle2 className="text-orange-500" size={20} />
                    <span className="font-black text-xs text-gray-300 uppercase tracking-[0.2em]">{t("why.strategic_value")}</span>
                  </div>
                </div>
                <div className="flex-1 w-full aspect-video bg-zinc-950 border border-white/10 rounded-[3rem] relative overflow-hidden group shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-5 group-hover:opacity-10 transition-opacity duration-700 scale-90 group-hover:scale-110">
                     <Icon size={220} className="text-orange-500" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 backdrop-blur-md transform transition-transform duration-700 group-hover:scale-110">
                      <Icon size={40} />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Schema Section */}
        <div className="bg-zinc-950 border border-white/5 rounded-[4rem] p-12 md:p-24 mb-32 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-orange-500/5 blur-[150px] -z-10"></div>
          <h2 className="text-4xl md:text-6xl font-black mb-20 text-center uppercase tracking-tighter">{t("why.model")}</h2>
          
          <div className="grid md:grid-cols-2 gap-20 items-center">
            {/* Traditional Model */}
            <div className="flex flex-col items-center">
              <div className="text-gray-600 font-black mb-12 text-xs uppercase tracking-[0.5em]">{t("why.traditional_label")}</div>
              <div className="space-y-6 w-full max-w-sm text-center relative">
                <div className="p-8 bg-zinc-900 border border-white/10 rounded-3xl font-black text-gray-600 uppercase tracking-widest text-sm shadow-xl">VISA</div>
                <div className="flex justify-center"><ArrowRight className="rotate-90 text-zinc-800" size={32} /></div>
                <div className="p-8 bg-zinc-900 border border-white/10 rounded-3xl font-black text-gray-600 uppercase tracking-widest text-sm shadow-xl">{t("why.banks")}</div>
                <div className="flex justify-center"><ArrowRight className="rotate-90 text-zinc-800" size={32} /></div>
                <div className="p-8 bg-zinc-900 border border-white/10 rounded-3xl font-black text-gray-600 uppercase tracking-widest text-sm shadow-xl">{t("why.individual_clients")}</div>
              </div>
            </div>

            {/* Helloopass Model */}
            <div className="flex flex-col items-center">
              <div className="text-orange-500 font-black mb-12 text-xs uppercase tracking-[0.5em]">{t("why.hellopass_label")}</div>
              <div className="space-y-4 w-full max-w-sm text-center relative">
                <div className="p-8 bg-orange-500 border border-orange-400 rounded-3xl font-black text-white uppercase tracking-widest text-sm shadow-2xl shadow-orange-500/30">Helloopass OS</div>
                <div className="flex justify-center"><ArrowRight className="rotate-90 text-orange-500" size={32} /></div>
                <div className="p-8 bg-zinc-900 border border-orange-500/30 rounded-3xl font-black text-white uppercase tracking-widest text-sm shadow-2xl">Communaut\u00e9s (Union/ONG)</div>
                <div className="flex justify-center"><ArrowRight className="rotate-90 text-orange-500" size={32} /></div>
                <div className="p-8 bg-zinc-900 border border-orange-500/30 rounded-3xl font-black text-white uppercase tracking-widest text-sm shadow-2xl">{t("why.active_members")}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Contract Excerpt */}
        <div className="max-w-5xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="p-12 md:p-24 bg-zinc-950 border-l-[12px] border-orange-500 rounded-r-[4rem] relative shadow-2xl"
          >
            <h3 className="text-2xl font-black mb-12 text-orange-500 flex items-center gap-5 uppercase tracking-widest">
              <Shield size={32} /> {t("why.contract.title")}
            </h3>
            <p className="text-gray-300 italic text-3xl md:text-4xl leading-relaxed font-medium">
              "{t("why.contract.quote")}"
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Why;