import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { COUNTRIES, EXCLUDED_COUNTRIES } from "../lib/constants";
import { FileUp, ChevronRight, ChevronLeft, CheckCircle2, ShieldCheck, User, Briefcase, Globe, Target, Banknote, FileText } from "lucide-react";
import { useLocation } from "react-router-dom";

const Application = () => {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    // 1. Coordonnées personnelles
    name: "", birth: "", nationality: "", email: "", phone: "", address: "",
    // 2. Business
    bizName: "", bizStatus: "", bizCountry: "", bizYear: "", bizAddress: "", bizSector: "", bizEmployees: "", bizCA: "",
    // 3. Territoire visé
    targetTerritory: "",
    // 4. Expérience
    expYears: "", isExistingFranchisee: "", network: "", motivation: "",
    // 5. Capacité financière
    budget: "", schedule: "", deposit: "",
    // 6. Upload CV
    cvFile: null as File | null,
    // 7. Consentement
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
    if (step === 1 && (!formData.name || !formData.email || !formData.phone)) {
      toast.error("Veuillez remplir les informations obligatoires (Nom, Email, Téléphone).");
      return;
    }
    if (step === 2 && (!formData.bizName || !formData.bizSector)) {
      toast.error("Veuillez renseigner au moins le nom et le secteur de votre business.");
      return;
    }
    if (step === 3 && !formData.targetTerritory) {
      toast.error("Veuillez sélectionner un territoire.");
      return;
    }
    if (step === 6 && !formData.cvFile) {
      toast.error("Veuillez télécharger votre CV au format PDF.");
      return;
    }
    if (step === 7 && !formData.consent) {
      toast.error("Veuillez accepter les conditions pour continuer.");
      return;
    }
    if (step < 7) {
      setStep(s => s + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const prevStep = () => {
    setStep(s => s - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 7) {
      nextStep();
    } else {
      setIsSubmitted(true);
      toast.success("Votre dossier de candidature a été envoyé !");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        toast.error("Seuls les fichiers PDF sont acceptés.");
        return;
      }
      setFormData({ ...formData, cvFile: file });
    }
  };

  const steps = [
    { title: "Coordonnées", icon: User },
    { title: "Business", icon: Briefcase },
    { title: "Territoire", icon: Globe },
    { title: "Expérience", icon: Target },
    { title: "Finance", icon: Banknote },
    { title: "CV", icon: FileText },
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

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} key="step2" className="space-y-8">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold uppercase tracking-tight">2. Informations Business</h3>
                  <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">Détails de votre structure actuelle.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1.5"><Label className="text-gray-500 font-bold uppercase tracking-widest text-[7px]">Nom de l'entreprise</Label><Input required value={formData.bizName} onChange={e => setFormData({...formData, bizName: e.target.value})} className="bg-black border-white/10 h-12 text-base rounded-xl px-5" /></div>
                  <div className="space-y-1.5"><Label className="text-gray-500 font-bold uppercase tracking-widest text-[7px]">Statut Juridique</Label><Input required value={formData.bizStatus} onChange={e => setFormData({...formData, bizStatus: e.target.value})} className="bg-black border-white/10 h-12 text-base rounded-xl px-5" placeholder="Ex: SAS, SARL..." /></div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1.5"><Label className="text-gray-500 font-bold uppercase tracking-widest text-[7px]">Pays d'immatriculation</Label><Input required value={formData.bizCountry} onChange={e => setFormData({...formData, bizCountry: e.target.value})} className="bg-black border-white/10 h-12 text-base rounded-xl px-5" /></div>
                  <div className="space-y-1.5"><Label className="text-gray-500 font-bold uppercase tracking-widest text-[7px]">Année de création</Label><Input type="number" required value={formData.bizYear} onChange={e => setFormData({...formData, bizYear: e.target.value})} className="bg-black border-white/10 h-12 text-base rounded-xl px-5" /></div>
                </div>
                <div className="space-y-1.5"><Label className="text-gray-500 font-bold uppercase tracking-widest text-[7px]">Adresse de l'entreprise</Label><Input required value={formData.bizAddress} onChange={e => setFormData({...formData, bizAddress: e.target.value})} className="bg-black border-white/10 h-12 text-base rounded-xl px-5" /></div>
                <div className="grid md:grid-cols-2 gap-6">
                   <div className="space-y-1.5"><Label className="text-gray-500 font-bold uppercase tracking-widest text-[7px]">Secteur d'activité</Label><Input required value={formData.bizSector} onChange={e => setFormData({...formData, bizSector: e.target.value})} className="bg-black border-white/10 h-12 text-base rounded-xl px-5" /></div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5"><Label className="text-gray-500 font-bold uppercase tracking-widest text-[7px]">Employés</Label><Input type="number" value={formData.bizEmployees} onChange={e => setFormData({...formData, bizEmployees: e.target.value})} className="bg-black border-white/10 h-12 text-base rounded-xl px-5" /></div>
                      <div className="space-y-1.5"><Label className="text-gray-500 font-bold uppercase tracking-widest text-[7px]">CA Annuel</Label><Input value={formData.bizCA} onChange={e => setFormData({...formData, bizCA: e.target.value})} className="bg-black border-white/10 h-12 text-base rounded-xl px-5" /></div>
                   </div>
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

            {step === 4 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} key="step4" className="space-y-8">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold uppercase tracking-tight">4. Expérience & Motivations</h3>
                  <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">Votre parcours et votre intérêt pour Helloopass.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1.5"><Label className="text-gray-500 font-bold uppercase tracking-widest text-[7px]">Années d'expérience</Label><Input type="number" required value={formData.expYears} onChange={e => setFormData({...formData, expYears: e.target.value})} className="bg-black border-white/10 h-12 text-base rounded-xl px-5" /></div>
                  <div className="space-y-1.5"><Label className="text-gray-500 font-bold uppercase tracking-widest text-[7px]">Franchise existante ?</Label>
                    <select 
                      className="w-full h-12 px-5 rounded-xl bg-black border border-white/10 text-white text-base appearance-none cursor-pointer focus:border-orange-500"
                      value={formData.isExistingFranchisee}
                      onChange={e => setFormData({...formData, isExistingFranchisee: e.target.value})}
                    >
                      <option value="">Choisir...</option>
                      <option value="Oui">Oui</option>
                      <option value="Non">Non</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5"><Label className="text-gray-500 font-bold uppercase tracking-widest text-[7px]">Réseau actuel (si applicable)</Label><Input value={formData.network} onChange={e => setFormData({...formData, network: e.target.value})} className="bg-black border-white/10 h-12 text-base rounded-xl px-5" placeholder="Nom du réseau, nombre de points de vente..." /></div>
                <div className="space-y-1.5"><Label className="text-gray-500 font-bold uppercase tracking-widest text-[7px]">Vos motivations</Label><Textarea required value={formData.motivation} onChange={e => setFormData({...formData, motivation: e.target.value})} className="bg-black border-white/10 min-h-[120px] text-base rounded-xl px-5 py-3 resize-none" placeholder="Pourquoi souhaitez-vous rejoindre le réseau Helloopass ?" /></div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} key="step5" className="space-y-8">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold uppercase tracking-tight">5. Capacité Financière</h3>
                  <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">Évaluation des ressources pour le déploiement.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1.5"><Label className="text-gray-500 font-bold uppercase tracking-widest text-[7px]">Budget Global (USD/EUR)</Label><Input required value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} className="bg-black border-white/10 h-12 text-base rounded-xl px-5" /></div>
                  <div className="space-y-1.5"><Label className="text-gray-500 font-bold uppercase tracking-widest text-[7px]">Acompte disponible immédiatement</Label><Input required value={formData.deposit} onChange={e => setFormData({...formData, deposit: e.target.value})} className="bg-black border-white/10 h-12 text-base rounded-xl px-5" /></div>
                </div>
                <div className="space-y-1.5"><Label className="text-gray-500 font-bold uppercase tracking-widest text-[7px]">Proposition d'échelonnement</Label><Textarea value={formData.schedule} onChange={e => setFormData({...formData, schedule: e.target.value})} className="bg-black border-white/10 min-h-[100px] text-base rounded-xl px-5 py-3 resize-none" placeholder="Précisez vos besoins ou propositions d'échelonnement..." /></div>
                <div className="p-4 bg-zinc-900/50 rounded-xl border border-white/5">
                   <p className="text-zinc-500 text-[9px] uppercase tracking-wider font-bold">Note: Ces informations sont confidentielles et servent uniquement à évaluer la faisabilité du projet.</p>
                </div>
              </motion.div>
            )}

            {step === 6 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} key="step6" className="space-y-8">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold uppercase tracking-tight">6. Upload CV</h3>
                  <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">Fichier au format PDF exclusivement.</p>
                </div>
                <div 
                  className="border-2 border-dashed border-white/10 rounded-2xl p-12 text-center cursor-pointer hover:border-orange-500/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".pdf" 
                    onChange={handleFileChange} 
                  />
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center">
                      <FileUp size={28} className={formData.cvFile ? "text-orange-500" : "text-zinc-600"} />
                    </div>
                    <div>
                      <p className="text-base font-bold uppercase tracking-tight">{formData.cvFile ? formData.cvFile.name : "Cliquez pour choisir un fichier"}</p>
                      <p className="text-zinc-500 text-xs mt-1 font-medium">Maximum 5MB • PDF uniquement</p>
                    </div>
                  </div>
                </div>
                {formData.cvFile && (
                   <div className="flex items-center gap-3 p-4 bg-zinc-900 rounded-xl border border-white/5">
                      <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                         <FileText size={20} className="text-orange-500" />
                      </div>
                      <div className="flex-1">
                         <p className="text-sm font-bold truncate">{formData.cvFile.name}</p>
                         <p className="text-[10px] text-zinc-500 uppercase">PDF prêt pour l'envoi</p>
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        className="text-zinc-500 hover:text-white" 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setFormData({...formData, cvFile: null});
                        }}
                      >
                        Supprimer
                      </Button>
                   </div>
                )}
              </motion.div>
            )}

            {step === 7 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} key="step7" className="space-y-8">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold uppercase tracking-tight">7. Consentement Final</h3>
                  <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">Dernière étape.</p>
                </div>
                <div className="space-y-6">
                  <div className="p-6 bg-zinc-900 rounded-2xl border border-white/5 space-y-4">
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      En soumettant ce formulaire, vous reconnaissez que les informations fournies sont exactes et véridiques. Helloopass OS s'engage à traiter vos données de manière confidentielle conformément à sa politique de confidentialité.
                    </p>
                    <div className="flex items-start gap-4 pt-4 border-t border-white/5">
                      <input 
                        type="checkbox" 
                        id="consent-check"
                        className="mt-1 h-5 w-5 rounded border-white/10 bg-black text-orange-500 focus:ring-orange-500 cursor-pointer shrink-0" 
                        checked={formData.consent}
                        onChange={e => setFormData({...formData, consent: e.target.checked})}
                      />
                      <label htmlFor="consent-check" className="text-gray-300 text-sm leading-relaxed cursor-pointer font-medium">
                        Je certifie que les informations fournies sont exactes. J'accepte le traitement de mes données pour l'examen de ma candidature.
                      </label>
                    </div>
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
            
            <Button type="button" onClick={step === 7 ? undefined : nextStep} className="bg-orange-500 hover:bg-orange-600 h-12 px-8 text-base font-bold rounded-xl shadow-lg">
              {step === 7 ? "Soumettre Dossier" : "Suivant"} <ChevronRight className="ml-2" size={18} />
            </Button>
            {/* Note: In step 7, the button click is handled by the form submit or an onClick that triggers submission */}
            {step === 7 && (
               <button type="submit" className="hidden" id="hidden-submit-btn" />
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Application;