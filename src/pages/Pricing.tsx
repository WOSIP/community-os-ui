import React, { useState } from "react";
import { Calculator, Info, CheckCircle, ArrowRight, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";

const Pricing = () => {
  const { t } = useTranslation();
  const [pop, setPop] = useState(25000000); 
  
  const calculatePrice = (p: number) => {
    const raw = p / 200;
    if (raw < 100000) return 100000;
    if (raw > 1000000) return 1000000;
    return raw;
  };

  const currentPrice = calculatePrice(pop);

  const examples = t("pricing.examples", { returnObjects: true }) as Array<{ country: string; pop: string; price: string }>;

  return (
    <div className="bg-black text-white py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 uppercase tracking-tight">{t("pricing.title")} <span className="text-orange-500">{t("pricing.title_accent")}</span></h1>
          <p className="text-base text-gray-400 max-w-3xl leading-relaxed font-medium">
            {t("pricing.description")}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start mb-20">
          {/* Formula */}
          <div className="space-y-8">
            <div className="p-8 bg-zinc-950 rounded-[2rem] border border-white/10 relative overflow-hidden shadow-xl">
               <h2 className="text-xl md:text-2xl font-bold mb-6 uppercase tracking-tight">{t("pricing.formula_title")}</h2>
               <div className="inline-block p-6 bg-orange-500/10 border border-orange-500/30 rounded-2xl mb-8">
                  <div className="text-3xl md:text-4xl font-bold text-orange-500 tracking-tight">{t("pricing.formula_value")}</div>
               </div>
               <ul className="space-y-4 text-gray-300 text-base font-medium">
                 <li className="flex items-center gap-3">
                   <div className="w-7 h-7 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                     <CheckCircle className="text-orange-500" size={16} />
                   </div>
                   <span>
                    <Trans i18nKey="pricing.formula_point1">
                      Ticket d'entr\u00e9e minimum : <span className="text-white font-bold italic">100 000 USD</span>
                    </Trans>
                   </span>
                 </li>
                 <li className="flex items-center gap-3">
                   <div className="w-7 h-7 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                     <CheckCircle className="text-orange-500" size={16} />
                   </div>
                   <span>
                    <Trans i18nKey="pricing.formula_point2">
                      Plafond maximum : <span className="text-white font-bold italic">1 000 000 USD</span>
                    </Trans>
                   </span>
                 </li>
                 <li className="flex items-center gap-3">
                   <div className="w-7 h-7 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                     <CheckCircle className="text-orange-500" size={16} />
                   </div>
                   <span>{t("pricing.formula_point3")}</span>
                 </li>
               </ul>
            </div>

            <div className="bg-zinc-950 p-8 rounded-[2rem] border border-white/5 shadow-xl">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-3 uppercase tracking-tight">
                <MapPin className="text-orange-500" size={18} /> {t("pricing.references_title")}
              </h3>
              <div className="grid gap-3">
                {examples.map((ex, i) => (
                  <div key={i} className="flex justify-between items-center p-5 bg-black rounded-xl border border-white/5 group hover:border-orange-500/40 transition-all">
                    <div>
                      <div className="font-bold text-lg uppercase tracking-tight">{ex.country}</div>
                      <div className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mt-1">Pop: {ex.pop}</div>
                    </div>
                    <div className="text-xl font-bold text-orange-500">${ex.price} <span className="text-[9px] text-gray-600 font-bold tracking-widest">USD</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Simulator */}
          <div className="bg-orange-500 p-8 md:p-10 rounded-[2.5rem] text-white shadow-xl shadow-orange-500/20 sticky top-28">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 uppercase tracking-tight">{t("pricing.simulator_title")}</h2>
            <div className="space-y-8">
              <div className="space-y-3">
                <Label className="text-white text-[10px] font-bold uppercase tracking-[0.3em]">{t("pricing.simulator_label")}</Label>
                <div className="relative">
                  <Input 
                    type="number" 
                    value={pop} 
                    onChange={(e) => setPop(Number(e.target.value))}
                    className="bg-black/20 border-white/30 text-white h-14 text-xl font-bold rounded-xl px-6 focus:bg-black/30"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 font-bold uppercase tracking-widest text-[7px]">
                    {t("pricing.simulator_unit")}
                  </div>
                </div>
              </div>
              
              <div className="pt-10 border-t border-white/20 text-center">
                <div className="text-white/80 text-[10px] mb-2 font-bold uppercase tracking-[0.4em]">{t("pricing.simulator_cost_label")}</div>
                <div className="text-5xl md:text-6xl font-bold mb-8 tracking-tighter">
                  ${currentPrice.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </div>
                
                <div className="bg-black/20 p-6 rounded-xl flex items-start gap-3 text-left border border-white/10 mb-8">
                  <Info className="flex-shrink-0 mt-0.5 text-orange-200" size={20} />
                  <p className="text-white/90 leading-relaxed font-bold text-sm italic">
                    {t("pricing.simulator_info")}
                  </p>
                </div>

                <Link to="/candidature" className="block">
                  <Button className="w-full h-14 text-lg font-bold bg-white text-orange-500 hover:bg-zinc-100 rounded-xl shadow-xl transition-all">
                    {t("pricing.simulator_cta")} <ArrowRight className="ml-2" size={20} />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;