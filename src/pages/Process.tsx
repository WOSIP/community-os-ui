import React from "react";
import { motion } from "framer-motion";
import { ClipboardList, Search, MessageSquare, FileText, PenTool, Zap, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Process = () => {
  const steps = [
    { 
      title: "Formulaire", 
      time: "5 min", 
      desc: "Remplissez votre demande initiale en ligne en précisant votre territoire d'intérêt.", 
      icon: ClipboardList 
    },
    { 
      title: "Étude", 
      time: "3-5 j", 
      desc: "Notre comité d'expansion analyse votre profil, votre expérience et la viabilité du marché local.", 
      icon: Search 
    },
    { 
      title: "Entretien", 
      time: "1 h", 
      desc: "Échange stratégique en visio avec nos directeurs régionaux pour valider l'alignement.", 
      icon: MessageSquare 
    },
    { 
      title: "Contrat", 
      time: "48 h", 
      desc: "Envoi du projet de contrat de Master Franchise adapté à votre législation nationale.", 
      icon: FileText 
    },
    { 
      title: "Signature", 
      time: "Immédiat", 
      desc: "Signature électronique sécurisée et versement de l'acompte initial de réservation.", 
      icon: PenTool 
    },
    { 
      title: "Activation", 
      time: "72 h", 
      desc: "Accès total à l'OS, remise du kit marketing et démarrage du cycle de formation intensive.", 
      icon: Zap 
    }
  ];

  const checklist = [
    "Curriculum Vitae (CV) détaillé du porteur de projet",
    "Présentation de l'entreprise locale (si existante)",
    "Note d'intention sur le potentiel du territoire",
    "Preuve de capacité financière pour le ticket d'entrée",
    "Plan de développement sommaire sur 12 mois"
  ];

  return (
    <div className="bg-black text-white py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 uppercase tracking-tight">
            Processus <br /><span className="text-orange-500">d'Accréditation</span>
          </h1>
          <p className="text-base text-gray-400 max-w-3xl leading-relaxed font-medium">
            Devenez le prochain partenaire exclusif Helloopass. Notre processus est conçu pour être rapide, rigoureux et totalement transparent.
          </p>
        </div>

        {/* Steps Timeline */}
        <div className="relative mb-32">
          <div className="absolute top-[35px] left-0 w-full h-0.5 bg-zinc-900 hidden lg:block">
             <motion.div 
               className="h-full bg-orange-500/50"
               initial={{ width: 0 }}
               whileInView={{ width: "100%" }}
               transition={{ duration: 2, ease: "easeInOut" }}
             />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  className="group"
                >
                  <div className="w-16 h-16 rounded-xl bg-zinc-950 border border-white/10 flex items-center justify-center mb-6 shadow-xl group-hover:bg-orange-500 transition-all duration-500 group-hover:border-orange-400">
                    <Icon size={24} className="text-orange-500 group-hover:text-white transition-colors duration-500" />
                  </div>
                  
                  <div className="inline-block px-2.5 py-0.5 bg-orange-500/10 border border-orange-500/30 rounded-full text-orange-500 text-[7px] font-bold uppercase tracking-[0.3em] mb-3">
                    {step.time}
                  </div>
                  
                  <h3 className="text-lg font-bold mb-2 uppercase tracking-tight leading-tight">{step.title}</h3>
                  <p className="text-gray-500 text-[10px] leading-relaxed font-bold group-hover:text-gray-300 transition-colors">
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Requirements Section */}
        <div className="bg-zinc-950 rounded-[2.5rem] p-8 md:p-12 border border-white/5 relative overflow-hidden shadow-xl">
          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-8 uppercase tracking-tight">Checklist <br /><span className="text-orange-500">Dossier Complet</span></h2>
              <div className="space-y-3">
                {checklist.map((item, i) => (
                  <div key={i} className="flex items-center gap-5 p-4 bg-black border border-white/5 rounded-xl hover:border-orange-500/30 transition-all group">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                      <CheckCircle size={16} />
                    </div>
                    <span className="text-base font-bold uppercase tracking-tight text-gray-400 group-hover:text-white transition-colors">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-orange-500 p-8 md:p-10 rounded-[2rem] text-white shadow-xl shadow-orange-500/20 text-center">
              <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">Prêt à démarrer l'aventure ?</h3>
              <p className="text-base font-bold mb-8 text-white/90 uppercase tracking-widest">Le formulaire ne prend que 5 minutes.</p>
              <Link to="/candidature">
                <Button className="w-full h-14 text-lg font-bold bg-white text-orange-500 hover:bg-zinc-100 rounded-xl shadow-lg transition-all">
                  Lancer ma demande <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
              <p className="mt-5 text-[7px] font-bold uppercase tracking-[0.4em] text-white/60">Aucun engagement requis à cette étape.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Process;