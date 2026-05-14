import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { COUNTRIES, EXCLUDED_COUNTRIES } from "../lib/constants";
import { FileUp, ChevronRight, ChevronLeft, CheckCircle2, ShieldCheck, User, Briefcase, Globe, Target, Banknote } from "lucide-react";
import { useLocation } from "react-router-dom";

const Application = () => {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: "", birth: "", nationality: "", email: "", phone: "", address: "",
    bizName: "", status: "", bizCountry: "", year: "", bizAddress: "", sector: "", employees: "", ca: "",
    targetTerritory: "",
    expYears: "", isExistingFranchisee: "", network: "", motivation: "",
    budget: "", schedule: "", deposit: "",
    cvFile: null,
    consent: false
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const country = params.get("country");
    if (country && COUNTRIES.includes(country) && !EXCLUDED_COUNTRIES.includes(country)) {
      setFormData(prev => ({ ...prev, targetTerritory: country }));
      setStep(3);
    }
  }, [location]);

  const nextStep = () => {
    if (step === 1 && (!formData.name || !formData.email)) {
      toast.error("Veuillez remplir les informations obligatoires.");
      return;
    }
    if (step === 7 && !formData.consent) {
      toast.error("Veuillez accepter les conditions pour continuer.");
      return;
    }
    setStep(s => s + 1);
  };
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 7) {
      nextStep();
    } else {
      setIsSubmitted(true);
      toast.success("Votre dossier de candidature a été envoyé !");
    }
  };

  const steps = [
    { title: "Coordonnées", icon: User },
    { title: "Business", icon: Briefcase },
    { title: "Territoire", icon: Globe },
    { title: "Expérience", icon: Target },
    { title: "Finance", icon: Banknote },
    { title: "Documents", icon: FileUp },
    { title: "Validation", icon: ShieldCheck }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mb-6 shadow-lg"
        >
          <CheckCircle2 size={40} className="text-white" />
        </motion.div>
        <h1 className="text-3xl font-bold text-white mb-3 uppercase tracking-tight">Candidature Reçue !</h1>
        <p className="text-base text-gray-400 max-w-xl mx-auto leading-relaxed font-medium">
          Félicitations {formData.name}, votre dossier pour <span className="text-orange-500 font-bold underline decoration-2">{formData.targetTerritory}</span> a été transmis.
        </p>
        <p className="text-gray-500 mt-3 italic font-bold text-xs">Un expert franchise vous contactera sous 3 à 5 jours.</p>
        <Button className="mt-8 bg-orange-500 hover:bg-orange-600 h-12 px-10 text-base font-bold rounded-xl" onClick={() => window.location.href = "/"}>
          Retour à l'accueil
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-black text-white py-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 uppercase tracking-tight">Dossier de <span className="text-orange-500">Candidature</span></h1>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em]">Expansion Internationale Helloopass OS</p>
        </div>

        <div className="hidden md:flex justify-between items-center mb-12 px-4">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const active = i + 1 === step;
            const completed = i + 1 < step;
            return (
              <div key={i} className="flex flex-col items-center relative z-10 flex-1">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 border-2 ${
                  active ? "bg-orange-500 border-orange-500 text-white scale-110 shadow-lg" : 
                  completed ? "bg-zinc-800 border-orange-500 text-orange-500" : "bg-zinc-900 border-zinc-800 text-zinc-600"
                }`}>
                  <Icon size={18} />
                </div>
                <span className={`mt-2 text-[7px] font-bold uppercase tracking-widest ${active ? "text-orange-500" : "text-zinc-600"}`}>{s.title}</span>
                {i < steps.length - 1 && (
                  <div className={`absolute top-5 left-1/2 w-full h-[1px] -z-10 ${completed ? "bg-orange-500" : "bg-zinc-900"}`}></div>
                )}
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="bg-zinc-950 p-6 md:p-12 rounded-[2rem] border border-white/5 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-zinc-900">
            <motion.div 
              className="h-full bg-orange-500"
              initial={{ width: "0%" }}
              animate={{ width: `${(step / 7) * 100}%` }}
            />
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} key="step1" className="space-y-8">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold uppercase tracking-tight">1. Coordonnées Personnelles</h3>
                  <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">Informations porteur de projet.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1.5"><Label className="text-gray-500 font-bold uppercase tracking-widest text-[7px]">Nom & Prénom</Label><Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-black border-white/10 h-12 text-base rounded-xl px-5" /></div>
                  <div className="space-y-1.5"><Label className="text-gray-500 font-bold uppercase tracking-widest text-[7px]">Date de naissance</Label><Input type="date" required value={formData.birth} onChange={e => setFormData({...formData, birth: e.target.value})} className="bg-black border-white/10 h-12 text-base rounded-xl px-5" /></div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1.5"><Label className="text-gray-500 font-bold uppercase tracking-widest text-[7px]">Nationalité</Label><Input required value={formData.nationality} onChange={e => setFormData({...formData, nationality: e.target.value})} className="bg-black border-white/10 h-12 text-base rounded-xl px-5" /></div>
                  <div className="space-y-1.5"><Label className="text-gray-500 font-bold uppercase tracking-widest text-[7px]">Email Direct</Label><Input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="bg-black border-white/10 h-12 text-base rounded-xl px-5" /></div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                   <div className="space-y-1.5"><Label className="text-gray-500 font-bold uppercase tracking-widest text-[7px]">Téléphone</Label><Input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="bg-black border-white/10 h-12 text-base rounded-xl px-5" /></div>
                   <div className="space-y-1.5"><Label className="text-gray-500 font-bold uppercase tracking-widest text-[7px]">Adresse</Label><Input required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="bg-black border-white/10 h-12 text-base rounded-xl px-5" /></div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} key="step3" className="space-y-8">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold uppercase tracking-tight">3. Territoire Visé</h3>
                  <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">Le pays visé pour l'exclusivité.</p>
                </div>
                <div className="space-y-5">
                  <Label className="text-white text-lg font-bold uppercase tracking-tight">SÉLECTIONNEZ VOTRE TERRITOIRE</Label>
                  <select 
                    className="w-full h-14 px-6 rounded-xl bg-black border border-white/10 text-white text-base font-bold appearance-none cursor-pointer focus:border-orange-500"
                    value={formData.targetTerritory}
                    onChange={e => setFormData({...formData, targetTerritory: e.target.value})}
                    required
                  >
                    <option value="">Choisir un pays...</option>
                    {COUNTRIES.filter(c => !EXCLUDED_COUNTRIES.includes(c)).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <div className="p-6 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                     <p className="text-gray-400 text-sm font-medium leading-relaxed">En devenant franchisé pour <span className="text-white font-bold">{formData.targetTerritory || "votre pays"}</span>, vous serez l'unique fournisseur de l'OS.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {step !== 1 && step !== 3 && step !== 7 && (
               <div className="py-16 text-center">
                 <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Étape {step} en cours de configuration...</p>
                 <p className="text-[10px] text-gray-600 mt-2">Poursuivez vers l'étape suivante.</p>
               </div>
            )}

            {step === 7 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} key="step7" className="space-y-8">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold uppercase tracking-tight">7. Consentement Final</h3>
                  <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">Dernière étape.</p>
                </div>
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-6 bg-zinc-900 rounded-2xl border border-white/5">
                    <input 
                      type="checkbox" 
                      id="consent-check"
                      className="mt-1 h-5 w-5 rounded border-white/10 bg-black text-orange-500 focus:ring-orange-500 cursor-pointer shrink-0" 
                      checked={formData.consent}
                      onChange={e => setFormData({...formData, consent: e.target.checked})}
                    />
                    <label htmlFor="consent-check" className="text-gray-400 text-base leading-relaxed cursor-pointer font-medium">
                      Je certifie que les informations fournies sont exactes. J'accepte le traitement de mes données pour l'examen de ma candidature.
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between mt-12 pt-8 border-t border-white/5">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={prevStep} className="border-zinc-800 text-white h-12 px-6 rounded-xl text-sm font-bold uppercase">
                <ChevronLeft className="mr-2" size={18} /> Retour
              </Button>
            ) : <div />}
            
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600 h-12 px-8 text-base font-bold rounded-xl shadow-lg">
              {step === 7 ? "Soumettre Dossier" : "Suivant"} <ChevronRight className="ml-2" size={18} />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Application;