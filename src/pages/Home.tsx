import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowRight, Globe, Shield, Zap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Home = () => {
  const { t } = useTranslation();

  const stats = [
    { label: t("stats.countries.label"), value: t("stats.countries.value"), desc: t("stats.countries.desc"), icon: Globe },
    { label: t("stats.investment.label"), value: t("stats.investment.value"), desc: t("stats.investment.desc"), icon: Shield },
    { label: t("stats.revenue.label"), value: t("stats.revenue.value"), desc: t("stats.revenue.desc"), icon: TrendingUp },
  ];

  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-500/5 blur-[100px] rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                {t("hero.badge")}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
              {t("hero.title_1")} <span className="text-orange-500">{t("hero.title_highlight")}</span><br />
              {t("hero.title_2")}
            </h1>

            <p className="text-lg md:text-xl text-gray-400 leading-relaxed font-medium mb-12 max-w-2xl mx-auto">
              {t("hero.description")}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/candidature">
                <Button className="w-full sm:w-auto h-16 px-10 bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase tracking-widest text-sm shadow-xl shadow-orange-500/20">
                  {t("hero.cta_primary")}
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
              <Link to="/pourquoi">
                <Button variant="outline" className="w-full sm:w-auto h-16 px-10 border-white/10 hover:bg-white/5 text-white font-bold uppercase tracking-widest text-sm">
                  {t("hero.cta_secondary")}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 border-y border-white/5 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center text-center p-8 rounded-3xl bg-zinc-900/50 border border-white/5"
              >
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-6">
                  <stat.icon size={24} />
                </div>
                <div className="text-4xl md:text-5xl font-black mb-2 text-white">
                  {stat.value}
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-4">
                  {stat.label}
                </div>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  {stat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-orange-500 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-orange-500/40">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            
            <motion.h2
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-12 relative z-10"
            >
              {t("cta.title_part1")} <br /> {t("cta.title_part2")}
            </motion.h2>

            <div className="flex flex-col items-center gap-8 relative z-10">
              <Link to="/candidature">
                <Button className="h-16 px-12 bg-white text-orange-500 hover:bg-zinc-100 font-black uppercase tracking-widest text-sm shadow-xl">
                  {t("cta.button")}
                </Button>
              </Link>
              
              <div className="flex items-center gap-4 text-white/80">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-black">{t("cta.stats_value")}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">{t("cta.stats_label")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;