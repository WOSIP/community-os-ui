import React, { useState } from "react";
import { motion } from "framer-motion";
import { Wallet, PieChart, TrendingUp, Calculator, ArrowRightLeft, Globe2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const EconomicModel = () => {
  const [nbTC, setNbTC] = useState(10);
  const [volume, setVolume] = useState(1000000);
  const commissionRate = 0.015; // 1.5% commission
  const franchiseShare = 0.25; // 25% of the 1.5%

  const monthlyRevenue = nbTC * volume * commissionRate * franchiseShare;

  return (
    <div className="bg-black text-white py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 uppercase tracking-tight">Modèle <span className="text-orange-500">Économique</span></h1>
          <p className="text-base text-gray-400 max-w-3xl leading-relaxed font-medium">
            Un écosystème de revenus partagés conçu pour la croissance mutuelle entre Helloopass, le franchisé et les Trade Communities (TC).
          </p>
        </div>

        {/* Distribution Tables */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {[
            { 
              title: "Transactions Intra", 
              desc: "Au sein d'une seule Trade Community (Closed Loop)",
              icon: ArrowRightLeft,
              data: [
                { label: "Trade Community", val: "50%" },
                { label: "Franchisé Pays", val: "25%" },
                { label: "Helloopass Global", val: "25%" }
              ]
            },
            { 
              title: "Transactions Cross", 
              desc: "Entre deux Trade Communities du même pays",
              icon: PieChart,
              data: [
                { label: "TC Émettrice", val: "25%" },
                { label: "TC Réceptrice", val: "25%" },
                { label: "Franchisé Pays", val: "25%" },
                { label: "Helloopass Global", val: "25%" }
              ]
            },
            { 
              title: "International", 
              desc: "Entre deux pays (Inter-Franchisés)",
              icon: Globe2,
              data: [
                { label: "TC Émettrice", val: "25%" },
                { label: "Franchisé Source", val: "25%" },
                { label: "Franchisé Cible", val: "12.5%" },
                { label: "Helloopass Global", val: "25%" }
              ]
            }
          ].map((table, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-950 border border-white/10 rounded-2xl p-7 hover:border-orange-500/40 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-5 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <table.icon size={20} />
              </div>
              <h3 className="text-xl font-bold mb-1.5 uppercase tracking-tight">{table.title}</h3>
              <p className="text-gray-500 mb-6 text-[10px] font-bold">{table.desc}</p>
              <div className="space-y-3">
                {table.data.map((item, i) => (
                  <div key={i} className="flex justify-between items-center pb-2.5 border-b border-white/5">
                    <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">{item.label}</span>
                    <span className="text-orange-500 font-bold text-base">{item.val}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Revenue Sources */}
        <div className="bg-zinc-950 border border-white/5 rounded-[2rem] p-8 md:p-12 mb-20 relative overflow-hidden shadow-xl">
          <h2 className="text-2xl font-bold mb-10 uppercase tracking-tight">Flux de revenus du franchisé</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { title: "Commissions Transactionnelles", val: "25%", desc: "Votre part sur la commission de 1.5% appliquée à chaque transaction dans votre territoire." },
              { title: "Frais d'activation TC", val: "70%", desc: "Vous conservez la majorité des frais d'activation payés par chaque nouvelle Trade Community." },
              { title: "Redevances Annuelles", val: "70%", desc: "Part prépondérante sur les frais de maintenance et de licence annuelle des communautés." }
            ].map((source, idx) => (
              <div key={idx} className="relative group">
                <div className="text-orange-500 text-3xl font-bold mb-3">{source.val}</div>
                <h4 className="text-base font-bold mb-2 uppercase tracking-tight leading-tight">{source.title}</h4>
                <p className="text-gray-400 text-xs leading-relaxed font-medium">{source.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Simulator */}
        <div className="bg-orange-500 rounded-[2.5rem] p-6 md:p-12 text-white shadow-xl shadow-orange-500/20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 uppercase tracking-tight">Simulateur de Revenus</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-white text-[10px] font-bold uppercase tracking-[0.2em]">Nombre de Trade Communities (TC)</Label>
                  <Input 
                    type="number" 
                    value={nbTC} 
                    onChange={(e) => setNbTC(Number(e.target.value))}
                    className="bg-black/20 border-white/20 text-white h-12 text-lg font-bold rounded-xl px-5 focus:bg-black/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white text-[10px] font-bold uppercase tracking-[0.2em]">Volume mensuel moyen par TC (USD)</Label>
                  <Input 
                    type="number" 
                    value={volume} 
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="bg-black/20 border-white/20 text-white h-12 text-lg font-bold rounded-xl px-5 focus:bg-black/30"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 text-center shadow-2xl">
              <div className="text-white/80 text-[10px] mb-2 font-bold uppercase tracking-[0.3em]">Revenu mensuel estimé</div>
              <div className="text-4xl md:text-5xl font-bold mb-6 tracking-tighter">
                ${monthlyRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-[9px] font-bold uppercase tracking-widest mb-8">
                <Calculator size={12} /> Commission 1.5% × Part Franchisé 25%
              </div>
              
              <div className="p-5 bg-black/40 rounded-xl text-left border border-white/5">
                <h4 className="font-bold mb-1.5 flex items-center gap-2 text-orange-300 uppercase tracking-widest text-[9px]">
                  <TrendingUp size={14} /> Exemple Côte d'Ivoire
                </h4>
                <p className="text-white/90 text-base font-medium leading-relaxed">
                  <span className="font-bold text-white">10 TC</span> volume <span className="font-bold text-white">$1M</span> = <span className="text-orange-300 font-bold italic">$37,500 / mois</span>
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