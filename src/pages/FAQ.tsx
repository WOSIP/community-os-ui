import React from "react";
import { motion } from "framer-motion";
import { HelpCircle, ChevronRight, Globe, Shield, Wallet, Settings, Lock } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";

const FAQ = () => {
  const { t } = useTranslation();
  const FAQ_DATA = t("faq.data", { returnObjects: true }) as Array<{
    category: string;
    questions: Array<{ q: string; a: string }>;
  }>;

  const icons = [
    <Globe className="text-orange-500" size={20} />,
    <Wallet className="text-orange-500" size={20} />,
    <Shield className="text-orange-500" size={20} />,
    <Settings className="text-orange-500" size={20} />,
    <Lock className="text-orange-500" size={20} />
  ];

  return (
    <div className="bg-black min-h-screen text-white pt-32 pb-20 selection:bg-orange-500/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full text-orange-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
            <HelpCircle size={12} /> {t("faq.badge")}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 uppercase">
            {t("faq.title")} <span className="text-orange-500">{t("faq.title_accent")}</span>
          </h1>
          <p className="text-gray-400 text-lg font-medium max-w-2xl mx-auto">
            {t("faq.description")}
          </p>
        </motion.div>

        <div className="space-y-12">
          {FAQ_DATA.map((section, sectionIdx) => (
            <motion.div
              key={section.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: sectionIdx * 0.1 }}
              className="bg-zinc-950/50 border border-white/5 rounded-3xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex items-center gap-3">
                {icons[sectionIdx] || icons[0]}
                <h2 className="text-lg font-bold uppercase tracking-widest text-white/90">
                  {section.category}
                </h2>
              </div>
              <div className="p-6">
                <Accordion type="single" collapsible className="w-full space-y-2">
                  {section.questions.map((faq, faqIdx) => (
                    <AccordionItem
                      key={faqIdx}
                      value={`${sectionIdx}-${faqIdx}`}
                      className="border-white/5"
                    >
                      <AccordionTrigger className="text-sm md:text-base font-bold text-gray-300 hover:text-white hover:no-underline transition-colors py-4">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-400 text-sm md:text-base leading-relaxed font-medium pb-4">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 p-8 rounded-3xl bg-orange-500 text-center relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-black/5 opacity-20"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white mb-4 uppercase">
              {t("faq.cta_title")}
            </h3>
            <p className="text-white/90 font-medium mb-8 max-w-lg mx-auto">
              {t("faq.cta_desc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="inline-flex items-center justify-center bg-white text-orange-500 hover:bg-zinc-100 h-14 px-8 text-base font-bold rounded-xl transition-all shadow-xl group">
                {t("faq.cta_button")} <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;