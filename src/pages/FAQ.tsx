import React from "react";
import { motion } from "framer-motion";
import { HelpCircle, ChevronRight, Globe, Shield, Wallet, Settings, Lock } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_DATA = [
  {
    category: "Générales",
    icon: <Globe className="text-orange-500" size={20} />,
    questions: [
      {
        q: "Qu'est-ce qu'une Licence Master ?",
        a: "C'est le droit exclusif d'exploiter Helloopass OS sur un territoire et d'octroyer des licences régulières aux Trade Communities.",
      },
      {
        q: "Quelle est la durée de la franchise ?",
        a: "7 ans, renouvelable par accord mutuel.",
      },
      {
        q: "Puis-je revendre ma franchise ?",
        a: "Oui, avec l'approbation du Franchiseur (droit de premier refus).",
      },
    ],
  },
  {
    category: "Financières",
    icon: <Wallet className="text-orange-500" size={20} />,
    questions: [
      {
        q: "Quel est le prix minimum d'une franchise ?",
        a: "100 000 USD. Le prix est calculé selon la formule Population ÷ 200, avec un minimum à 100k et un maximum à 1M USD.",
      },
      {
        q: "Y a-t-il des frais cachés ?",
        a: "Non. Les seuls frais sont le prix d'entrée et l'obligation de consacrer 10% du Revenu de Croissance au marketing local.",
      },
      {
        q: "Quels sont les revenus potentiels ?",
        a: "Vous gagnez 25% sur chaque transaction, plus 70% des frais d'activation et redevances annuelles des Trade Communities.",
      },
    ],
  },
  {
    category: "Réglementaires",
    icon: <Shield className="text-orange-500" size={20} />,
    questions: [
      {
        q: "Ai-je besoin d'une licence de paiement ?",
        a: "Non. Helloopass fonctionne sur un système de bons d'achat (voucher). Les acheteurs ne peuvent pas 'cash out'. Aucune licence e-money requise.",
      },
      {
        q: "Le système est-il légal ?",
        a: "Oui. Le modèle de closed loops en bons d'achat est légal dans la plupart des pays. Les Trade Communities ont besoin d'une simple licence commerciale.",
      },
    ],
  },
  {
    category: "Opérationnelles",
    icon: <Settings className="text-orange-500" size={20} />,
    questions: [
      {
        q: "Dois-je avoir des compétences techniques ?",
        a: "Non. La technologie est fournie clé en main. Vous recevez une formation.",
      },
      {
        q: "Quel support est fourni ?",
        a: "Formation initiale, support technique (selon formule), assistance au recrutement.",
      },
      {
        q: "Puis-je opérer dans plusieurs pays ?",
        a: "Chaque franchise est territoriale. Vous pouvez acquérir plusieurs territoires.",
      },
    ],
  },
  {
    category: "Exclusivité",
    icon: <Lock className="text-orange-500" size={20} />,
    questions: [
      {
        q: "Que se passe-t-il si je ne vends pas assez de licences ?",
        a: "Des objectifs de performance sont définis. En cas de difficulté persistante, la licence exclusive peut devenir non exclusive.",
      },
    ],
  },
];

const FAQ = () => {
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
            <HelpCircle size={12} /> Centre d'assistance
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 uppercase">
            Questions <span className="text-orange-500">Fréquentes</span>
          </h1>
          <p className="text-gray-400 text-lg font-medium max-w-2xl mx-auto">
            Trouvez les réponses aux questions les plus courantes sur le modèle de franchise Helloopass.
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
                {section.icon}
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
              D'autres questions ?
            </h3>
            <p className="text-white/90 font-medium mb-8 max-w-lg mx-auto">
              Notre équipe d'experts est là pour vous accompagner dans votre projet de franchise nationale.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="inline-flex items-center justify-center bg-white text-orange-500 hover:bg-zinc-100 h-14 px-8 text-base font-bold rounded-xl transition-all shadow-xl group">
                Contactez-nous <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;