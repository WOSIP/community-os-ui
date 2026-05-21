import React, { useState } from "react";
import { motion } from "framer-motion";
import { PieChart, TrendingUp, Calculator, ArrowRightLeft, Globe2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation, Trans } from "react-i18next";

const EconomicModel = () => {
  const { t } = useTranslation();
  const [nbTC, setNbTC] = useState(10);
  const [volume, setVolume] = useState(1000000);
  const commissionRate = 0.015; // 1.5% commission
  const franchiseShare = 0.25; // 25% of the 1.5%

  const monthlyRevenue = nbTC * volume * commissionRate * franchiseShare;

  const tables = t("economic_model.tables", { returnObjects: true }) as Array<{
    title: string;
    desc: string;
    data: Array<{ label: string; val: string }>;
  }>;

  const revenueSources = t("economic_model.revenue_sources", { returnObjects: true }) as Array<{
    title: string;
    val: string;
    desc: string;
  }>;

  const icons = [ArrowRightLeft, PieChart, Globe2];

  return (
    <div className="bg-black text-white py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 pt-20">
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-black mb-8 uppercase tracking-tighter leading-[0.9]">{t("economic_model.title")} <span className="text-orange-500">{t("economic_model.title_accent")}</span></h1>
          <p className="text-xl text-gray-400 max-w-3xl leading-relaxed font-medium">
            {t("economic_model.description")}
          </p>
        </div>

        {/* Distribution Tables */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {Array.isArray(tables) && tables.map((table, idx) => {
            const Icon = icons[idx] || ArrowRightLeft;
            return (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-zinc-950 border border-white/10 rounded-[2rem] p-10 hover:border-orange-500/40 transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-8 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <Icon size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-2 uppercase tracking-tight">{table.title}</h3>
                <p className="text-gray-500 mb-8 text-[10px] font-bold uppercase tracking-widest">{table.desc}</p>
                <div className="space-y-4">
                  {table.data.map((item, i) => (
                    <div key={i} className="flex justify-between items-center pb-4 border-b border-white/5">
                      <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">{item.label}</span>
                      <span className="text-orange-500 font-bold text-lg">{item.val}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Revenue Sources */}
        <div className="bg-zinc-950 border border-white/5 rounded-[3rem] p-10 md:p-20 mb-20 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 blur-[120px] -z-10"></div>
          <h2 className="text-3xl font-black mb-16 uppercase tracking-tighter">{t("economic_model.revenue_sources_title")}</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {Array.isArray(revenueSources) && revenueSources.map((source, idx) => (
              <div key={idx} className="relative group">
                <div className="text-orange-500 text-4xl font-black mb-4">{source.val}</div>
                <h4 className="text-xl font-bold mb-4 uppercase tracking-tight leading-tight">{source.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed font-medium">{source.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Simulator */}
        <div className="bg-orange-500 rounded-[3rem] p-8 md:p-20 text-white shadow-2xl shadow-orange-500/20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-black mb-8 uppercase tracking-tighter">{t("economic_model.simulator_title")}</h2>
              <div className="space-y-8">
                <div className="space-y-3">
                  <Label className="text-white text-xs font-black uppercase tracking-[0.2em]">{t("economic_model.nb_tc_label")}</Label>
                  <Input 
                    type="number" 
                    value={nbTC} 
                    onChange={(e) => setNbTC(Number(e.target.value))}
                    className="bg-black/20 border-white/20 text-white h-14 text-xl font-bold rounded-2xl px-6 focus:bg-black/30"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-white text-xs font-black uppercase tracking-[0.2em]">{t("economic_model.volume_label")}</Label>
                  <Input 
                    type="number" 
                    value={volume} 
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="bg-black/20 border-white/20 text-white h-14 text-xl font-bold rounded-2xl px-6 focus:bg-black/30"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-black/20 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-12 text-center shadow-2xl">
              <div className="text-white/80 text-xs mb-4 font-black uppercase tracking-[0.3em]">{t("economic_model.estimated_revenue")}</div>
              <div className="text-5xl md:text-7xl font-black mb-8 tracking-tighter">
                ${monthlyRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </div>
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest mb-10">
                <Calculator size={14} /> {t("economic_model.calc_info")}
              </div>
              
              <div className="p-8 bg-black/40 rounded-3xl text-left border border-white/5">
                <h4 className="font-black mb-4 flex items-center gap-3 text-orange-300 uppercase tracking-[0.2em] text-[10px]">
                  <TrendingUp size={16} /> {t("economic_model.example_title")}
                </h4>
                <p className="text-white/90 text-xl font-medium leading-relaxed">
                  <Trans 
                    i18nKey="economic_model.example_desc"
                    components={{ highlight: <span className="text-orange-300 font-black italic" /> }}
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EconomicModel;