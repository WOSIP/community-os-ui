import React from "react";
import { useTranslation } from "react-i18next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = () => {
  const { t } = useTranslation();

  const categories = t("faq.data", { returnObjects: true }) as any[];

  return (
    <div className="py-32 px-4 max-w-5xl mx-auto min-h-screen">
      <div className="text-center mb-20 pt-20">
        <div className="inline-block px-4 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-bold uppercase tracking-widest mb-6">
          {t("faq.badge")}
        </div>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8">
          {t("faq.title")} <span className="text-orange-500">{t("faq.title_accent")}</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">{t("faq.description")}</p>
      </div>

      <div className="space-y-12">
        {categories?.map((cat: any, idx: number) => (
          <div key={idx}>
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-600 mb-8 px-2 border-l-4 border-orange-500">
              {cat.category}
            </h2>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {cat.questions.map((q: any, qIdx: number) => (
                <AccordionItem key={qIdx} value={`item-${idx}-${qIdx}`} className="border border-white/5 bg-zinc-950 rounded-2xl px-6 overflow-hidden">
                  <AccordionTrigger className="text-lg font-bold text-left hover:text-orange-500 transition-colors uppercase py-6">
                    {q.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400 text-base leading-relaxed pb-8 font-medium">
                    {q.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;