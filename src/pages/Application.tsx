import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { COUNTRIES, EXCLUDED_COUNTRIES } from "../lib/constants";
import { FileUp, ChevronRight, ChevronLeft, CheckCircle2, ShieldCheck, User, Briefcase, Globe, Target, Banknote, FileText, Loader2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import { supabase, submitApplication } from "@/lib/supabase";
import { useTranslation, Trans } from "react-i18next";

const Application = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [candidateId, setCandidateId] = useState("");
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    // 1. Coordonn\u00e9es personnelles
    first_name: "", last_name: "", birth_date: "", nationality: "", email: "", phone: "", address: "",
    // 2. Business
    business_name: "", business_status: "", business_country: "", business_year: "", business_address: "", business_sector: "", business_employees: "", business_ca: "",
    // 3. Territoire vis\u00e9
    country: "",
    // 4. Exp\u00e9rience
    experience_years: "", is_existing_franchisee: "Non", network_details: "", motivation: "",
    // 5. Capacit\u00e9 financi\u00e8re
    budget: "", payment_schedule: "", deposit_amount: "",
    // 6. Upload CV
    cvFile: null as File | null,
    // 7. Consentement
    consent_given: false
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const country = params.get("country");
    if (country && COUNTRIES.includes(country) && !EXCLUDED_COUNTRIES.includes(country)) {
      setFormData(prev => ({ ...prev, country: country }));
      setStep(3);
    }
  }, [location]);

  const nextStep = () => {
    if (step === 1 && (!formData.first_name || !formData.last_name || !formData.email || !formData.phone)) {
      toast.error(t("application.errors.required_coord"));
      return;
    }
    if (step === 2 && (!formData.business_name || !formData.business_sector)) {
      toast.error(t("application.errors.required_business"));
      return;
    }
    if (step === 3 && !formData.country) {
      toast.error(t("application.errors.required_territory"));
      return;
    }
    if (step === 6 && !formData.cvFile) {
      toast.error(t("application.errors.required_cv"));
      return;
    }
    if (step === 7 && !formData.consent_given) {
      toast.error(t("application.errors.required_consent"));
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

  const uploadFile = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `cvs/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('agent-assets') 
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('agent-assets')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 7) {
      nextStep();
      return;
    }

    setIsSubmitting(true);
    try {
      let cv_url = "";
      if (formData.cvFile) {
        cv_url = await uploadFile(formData.cvFile);
      }

      const { data, error } = await submitApplication({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        business_name: formData.business_name,
        business_status: formData.business_status,
        business_country: formData.business_country,
        business_year: formData.business_year ? parseInt(formData.business_year) : null,
        business_address: formData.business_address,
        business_sector: formData.business_sector,
        business_employees: formData.business_employees ? parseInt(formData.business_employees) : null,
        business_ca: formData.business_ca,
        birth_date: formData.birth_date || null,
        nationality: formData.nationality,
        address: formData.address,
        experience_years: formData.experience_years ? parseInt(formData.experience_years) : null,
        is_existing_franchisee: formData.is_existing_franchisee === "Oui",
        network_details: formData.network_details,
        motivation: formData.motivation,
        budget: formData.budget,
        payment_schedule: formData.payment_schedule,
        deposit_amount: formData.deposit_amount,
        cv_url: cv_url,
        consent_given: formData.consent_given,
        status: 'pending'
      });

      if (error) throw error;

      setCandidateId(data.candidate_id);
      setIsSubmitted(true);
      toast.success(t("application.success.toast"));
    } catch (error: any) {
      toast.error(t("application.errors.upload_failed", { message: error.message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        toast.error(t("application.errors.pdf_only"));
        return;
      }
      setFormData({ ...formData, cvFile: file });
    }
  };

  const steps = [
    { title: t("application.steps.coord"), icon: User },
    { title: t("application.steps.business"), icon: Briefcase },
    { title: t("application.steps.territory"), icon: Globe },
    { title: t("application.steps.experience"), icon: Target },
    { title: t("application.steps.finance"), icon: Banknote },
    { title: t("application.steps.cv"), icon: FileText },
    { title: t("application.steps.validation"), icon: ShieldCheck }
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
        <h1 className="text-3xl font-bold text-white mb-3 uppercase tracking-tight">{t("application.success.title")}</h1>
        <p className="text-base text-gray-400 max-w-xl mx-auto leading-relaxed font-medium">
          <Trans i18nKey="application.success.desc" values={{ name: formData.first_name, country: formData.country }}>
            F\u00e9licitations {formData.first_name}, votre dossier pour <span className="text-orange-500 font-bold underline decoration-2">{formData.country}</span> a \u00e9t\u00e9 transmis.
          </Trans>
        </p>
        <div className="mt-4 p-4 bg-zinc-900 rounded-xl border border-white/5">
          <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-1">{t("application.success.candidate_id")}</p>
          <p className="text-2xl font-mono font-bold text-orange-500">{candidateId}</p>
        </div>
        <p className="text-gray-500 mt-6 italic font-bold text-xs">{t("application.success.contact_info")}</p>
        <Button className="mt-8 bg-orange-500 hover:bg-orange-600 h-12 px-10 text-base font-bold rounded-xl" onClick={() => window.location.href = "/"}>
          {t("application.success.home_button")}
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-black text-white py-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 uppercase tracking-tight">{t("application.title")} <span className="text-orange-500">{t("application.title_accent")}</span></h1>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em]">{t("application.subtitle")}</p>
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
                  <h3 className="text-xl font-bold uppercase tracking-tight">{t("application.step1_title")}</h3>
                  <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">{t("application.step1_desc")}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1.5"><Label className="text-gray-500 font-bold uppercase tracking-widest text-[7px]">{t("application.labels.first_name")}</Label><Input required value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} className="bg-black border-white/10 h-12 text-base rounded-xl px-5" /></div>
                  <div className="space-y-1.5"><Label className="text-gray-500 font-bold uppercase tracking-widest text-[7px]">{t("application.labels.last_name")}</Label><Input required value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} className="bg-black border-white/10 h-12 text-base rounded-xl px-5" /></div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1.5"><Label className="text-gray-500 font-bold uppercase tracking-widest text-[7px]">{t("application.labels.birth_date")}</Label><Input type="date" required value={formData.birth_date} onChange={e => setFormData({...formData, birth_date: e.target.value})} className="bg-black border-white/10 h-12 text-base rounded-xl px-5" /></div>
                  <div className="space-y-1.5"><Label className="text-gray-500 font-bold uppercase tracking-widest text-[7px]">{t("application.labels.nationality")}</Label><Input required value={formData.nationality} onChange={e => setFormData({...formData, nationality: e.target.value})} className="bg-black border-white/10 h-12 text-base rounded-xl px-5" /></div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1.5"><Label className="text-gray-500 font-bold uppercase tracking-widest text-[7px]">{t("application.labels.email")}</Label><Input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="bg-black border-white/10 h-12 text-base rounded-xl px-5" /></div>
                  <div className="space-y-1.5"><Label className="text-gray-500 font-bold uppercase tracking-widest text-[7px]">{t("application.labels.phone")}</Label><Input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="bg-black border-white/10 h-12 text-base rounded-xl px-5" /></div>
                </div>
                <div className="space-y-1.5"><Label className="text-gray-500 font-bold uppercase tracking-widest text-[7px]">{t("application.labels.address")}</Label><Input required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="bg-black border-white/10 h-12 text-base rounded-xl px-5" /></div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} key="step2" className="space-y-8">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold uppercase tracking-tight">{t("application.step2_title")}</h3>
                  <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">{t("application.step2_desc")}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1.5"><Label className="text-gray-500 font-bold uppercase tracking-widest text-[7px]">{t("application.labels.company_name")}</Label><Input required value={formData.business_name} onChange={e => setFormData({...formData, business_name: e.target.value})} className="bg-black border-white/10 h-12 text-base rounded-xl px-5" /></div>
                  <div className="space-y-1.5"><Label className="text-gray-500 font-bold uppercase tracking-widest text-[7px]">{t("application.labels.legal_status")}</Label><Input required value={formData.business_status} onChange={e => setFormData({...formData, business_status: e.target.value})} className="bg-black border-white/10 h-12 text-base rounded-xl px-5" placeholder="Ex: SAS, SARL..." /></div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1.5"><Label className="text-gray-500 font-bold uppercase tracking-widest text-[7px]">{t("application.labels.reg_country")}</Label><Input required value={formData.business_country} onChange={e => setFormData({...formData, business_country: e.target.value})} className="bg-black border-white/10 h-12 text-base rounded-xl px-5" /></div>
                  <div className="space-y-1.5"><Label className="text-gray-500 font-bold uppercase tracking-widest text-[7px]">{t("application.labels.creation_year")}</Label><Input type="number" required value={formData.business_year} onChange={e => setFormData({...formData, business_year: e.target.value})} className="bg-black border-white/10 h-12 text-base rounded-xl px-5" /></div>
                </div>
                <div className="space-y-1.5"><Label className="text-gray-500 font-bold uppercase tracking-widest text-[7px]">{t("application.labels.company_address")}</Label><Input required value={formData.business_address} onChange={e => setFormData({...formData, business_address: e.target.value})} className="bg-black border-white/10 h-12 text-base rounded-xl px-5" /></div>
                <div className="grid md:grid-cols-2 gap-6">
                   <div className="space-y-1.5"><Label className="text-gray-500 font-bold uppercase tracking-widest text-[7px]">{t("application.labels.sector")}</Label><Input required value={formData.business_sector} onChange={e => setFormData({...formData, business_sector: e.target.value})} className="bg-black border-white/10 h-12 text-base rounded-xl px-5" /></div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5"><Label className="text-gray-500 font-bold uppercase tracking-widest text-[7px]">{t("application.labels.employees")}</Label><Input type="number" value={formData.business_employees} onChange={e => setFormData({...formData, business_employees: e.target.value})} className="bg-black border-white/10 h-12 text-base rounded-xl px-5" /></div>
                      <div className="space-y-1.5"><Label className="text-gray-500 font-bold uppercase tracking-widest text-[7px]">{t("application.labels.revenue")}</Label><Input value={formData.business_ca} onChange={e => setFormData({...formData, business_ca: e.target.value})} className="bg-black border-white/10 h-12 text-base rounded-xl px-5" /></div>
                   </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} key="step3" className="space-y-8">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold uppercase tracking-tight">{t("application.step3_title")}</h3>
                  <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">{t("application.step3_desc")}</p>
                </div>
                <div className="space-y-5">
                  <Label className="text-white text-lg font-bold uppercase tracking-tight">{t("application.labels.select_territory")}</Label>
                  <select 
                    className="w-full h-14 px-6 rounded-xl bg-black border border-white/10 text-white text-base font-bold appearance-none cursor-pointer focus:border-orange-500"
                    value={formData.country}
                    onChange={e => setFormData({...formData, country: e.target.value})}
                    required
                  >
                    <option value="">{t("application.labels.choose_country")}</option>
                    {COUNTRIES.filter(c => !EXCLUDED_COUNTRIES.includes(c)).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <div className="p-6 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                     <p className="text-gray-400 text-sm font-medium leading-relaxed">
                        <Trans i18nKey="application.labels.territory_info" values={{ country: formData.country || t("application.labels.choose_country") }}>
                          En devenant franchis\u00e9 pour <span className="text-white font-bold">{formData.country || "votre pays"}</span>, vous serez l'unique fournisseur de l'OS.
                        </Trans>
                     </p>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} key="step4" className="space-y-8">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold uppercase tracking-tight">{t("application.step4_title")}</h3>
                  <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">{t("application.step4_desc")}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1.5"><Label className="text-gray-500 font-bold uppercase tracking-widest text-[7px]">{t("application.labels.exp_years")}</Label><Input type="number" required value={formData.experience_years} onChange={e => setFormData({...formData, experience_years: e.target.value})} className="bg-black border-white/10 h-12 text-base rounded-xl px-5" /></div>
                  <div className="space-y-1.5"><Label className="text-gray-500 font-bold uppercase tracking-widest text-[7px]">{t("application.labels.existing_franchise")}</Label>
                    <select 
                      className="w-full h-12 px-5 rounded-xl bg-black border border-white/10 text-white text-base appearance-none cursor-pointer focus:border-orange-500"
                      value={formData.is_existing_franchisee}
                      onChange={e => setFormData({...formData, is_existing_franchisee: e.target.value})}
                    >
                      <option value="Oui">Oui</option>
                      <option value="Non">Non</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5"><Label className="text-gray-500 font-bold uppercase tracking-widest text-[7px]">{t("application.labels.current_network")}</Label><Input value={formData.network_details} onChange={e => setFormData({...formData, network_details: e.target.value})} className="bg-black border-white/10 h-12 text-base rounded-xl px-5" placeholder="Nom du r\u00e9seau, nombre de points de vente..." /></div>
                <div className="space-y-1.5"><Label className="text-gray-500 font-bold uppercase tracking-widest text-[7px]">{t("application.labels.motivations")}</Label><Textarea required value={formData.motivation} onChange={e => setFormData({...formData, motivation: e.target.value})} className="bg-black border-white/10 min-h-[120px] text-base rounded-xl px-5 py-3 resize-none" placeholder={t("application.labels.motivations")} /></div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} key="step5" className="space-y-8">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold uppercase tracking-tight">{t("application.step5_title")}</h3>
                  <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">{t("application.step5_desc")}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1.5"><Label className="text-gray-500 font-bold uppercase tracking-widest text-[7px]">{t("application.labels.global_budget")}</Label><Input required value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} className="bg-black border-white/10 h-12 text-base rounded-xl px-5" /></div>
                  <div className="space-y-1.5"><Label className="text-gray-500 font-bold uppercase tracking-widest text-[7px]">{t("application.labels.deposit")}</Label><Input required value={formData.deposit_amount} onChange={e => setFormData({...formData, deposit_amount: e.target.value})} className="bg-black border-white/10 h-12 text-base rounded-xl px-5" /></div>
                </div>
                <div className="space-y-1.5"><Label className="text-gray-500 font-bold uppercase tracking-widest text-[7px]">{t("application.labels.payment_proposal")}</Label><Textarea value={formData.payment_schedule} onChange={e => setFormData({...formData, payment_schedule: e.target.value})} className="bg-black border-white/10 min-h-[100px] text-base rounded-xl px-5 py-3 resize-none" placeholder={t("application.labels.payment_proposal")} /></div>
                <div className="p-4 bg-zinc-900/50 rounded-xl border border-white/5">
                   <p className="text-zinc-500 text-[9px] uppercase tracking-wider font-bold">{t("application.labels.confidential_note")}</p>
                </div>
              </motion.div>
            )}

            {step === 6 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} key="step6" className="space-y-8">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold uppercase tracking-tight">{t("application.step6_title")}</h3>
                  <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">{t("application.step6_desc")}</p>
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
                      <p className="text-base font-bold uppercase tracking-tight">{formData.cvFile ? formData.cvFile.name : t("application.labels.upload_click")}</p>
                      <p className="text-zinc-500 text-xs mt-1 font-medium">{t("application.labels.upload_limit")}</p>
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
                         <p className="text-[10px] text-zinc-500 uppercase">{t("application.labels.pdf_ready")}</p>
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
                        {t("application.labels.delete")}
                      </Button>
                   </div>
                )}
              </motion.div>
            )}

            {step === 7 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} key="step7" className="space-y-8">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold uppercase tracking-tight">{t("application.step7_title")}</h3>
                  <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">{t("application.step7_desc")}</p>
                </div>
                <div className="space-y-6">
                  <div className="p-6 bg-zinc-900 rounded-2xl border border-white/5 space-y-4">
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {t("application.labels.consent_text")}
                    </p>
                    <div className="flex items-start gap-4 pt-4 border-t border-white/5">
                      <input 
                        type="checkbox" 
                        id="consent-check"
                        className="mt-1 h-5 w-5 rounded border-white/10 bg-black text-orange-500 focus:ring-orange-500 cursor-pointer shrink-0" 
                        checked={formData.consent_given}
                        onChange={e => setFormData({...formData, consent_given: e.target.checked})}
                      />
                      <label htmlFor="consent-check" className="text-gray-300 text-sm leading-relaxed cursor-pointer font-medium">
                        {t("application.labels.consent_checkbox")}
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
                <ChevronLeft className="mr-2" size={18} /> {t("application.buttons.back")}
              </Button>
            ) : <div />}
            
            <Button 
              type="submit" 
              className="bg-orange-500 hover:bg-orange-600 h-12 px-8 text-base font-bold rounded-xl shadow-lg disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={18} /> {t("application.buttons.processing")}
                </>
              ) : (
                <>
                  {step === 7 ? t("application.buttons.submit") : t("application.buttons.next")} <ChevronRight className="ml-2" size={18} />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Application;