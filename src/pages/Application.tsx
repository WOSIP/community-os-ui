import React, { useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Building2, 
  Globe, 
  Briefcase, 
  Wallet, 
  FileText, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  Upload,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { COUNTRIES_EN, COUNTRIES_FR } from "@/lib/countries";
import { toast } from "sonner";

const Application = () => {
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    sector: "",
    targetCountry: "",
    motivations: "",
    budget: "",
    deposit: "",
    consent: false
  });

  const countries = i18n.language === "fr" ? COUNTRIES_FR : COUNTRIES_EN;
  const totalSteps = 7;
  const progress = (step / totalSteps) * 100;

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success(t("application.success.title"));
  };

  const steps = [
    { id: 1, name: t("application.steps.step1"), icon: User },
    { id: 2, name: t("application.steps.step2"), icon: Building2 },
    { id: 3, name: t("application.steps.step3"), icon: Globe },
    { id: 4, name: t("application.steps.step4"), icon: Briefcase },
    { id: 5, name: t("application.steps.step5"), icon: Wallet },
    { id: 6, name: t("application.steps.step6"), icon: FileText },
    { id: 7, name: t("application.steps.step7"), icon: CheckCircle2 },
  ];

  if (isSubmitted) {
    return (
      <div className="py-32 px-4 max-w-3xl mx-auto min-h-screen flex items-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full bg-zinc-950 border border-white/10 rounded-[3rem] p-12 text-center shadow-2xl"
        >
          <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-orange-500/20">
            <CheckCircle2 size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">{t("application.success.title")}</h1>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed font-medium">
            <Trans 
              i18nKey="application.success.desc" 
              values={{ 
                name: formData.firstName || t("application.success.default_name"), 
                country: formData.targetCountry || t("application.success.default_country") 
              }} 
              components={{ highlight: <span className="text-white font-bold" /> }} 
            />
          </p>
          <div className="p-6 bg-zinc-900 rounded-2xl border border-white/5 inline-block mb-10">
            <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px] block mb-2">{t("application.success.id_label")}</span>
            <span className="text-2xl font-black text-orange-500 tracking-wider font-mono">HP-2025-AX9</span>
          </div>
          <p className="text-gray-500 text-sm italic mb-10">{t("application.success.contact_note")}</p>
          <Button onClick={() => window.location.href = "/"} className="h-14 px-10 bg-white text-black hover:bg-gray-200 font-bold uppercase tracking-widest text-xs">
            {t("application.success.home")}
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-32 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="grid lg:grid-cols-3 gap-16">
        {/* Left Side: Steps Info */}
        <div className="lg:col-span-1 space-y-12">
          <div>
            <h1 className="text-5xl font-black uppercase tracking-tighter mb-6 pt-10 leading-[0.9]">
              <Trans 
                i18nKey="application.title"
                components={{ highlight: <span className="text-orange-500" /> }}
              />
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed font-medium">{t("application.subtitle")}</p>
          </div>

          <div className="space-y-4">
            {steps.map((s) => (
              <div 
                key={s.id} 
                className={`flex items-center gap-4 transition-all duration-300 ${
                  step === s.id ? "opacity-100 translate-x-2" : "opacity-40"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  step >= s.id ? "bg-orange-500 text-white" : "bg-zinc-800 text-gray-500"
                }`}>
                  <s.icon size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 block">{t("application.form.step_label", { count: s.id })}</span>
                  <span className="text-sm font-bold uppercase tracking-tight">{s.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:col-span-2">
          <div className="bg-zinc-950 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl relative">
            <Progress value={progress} className="h-1.5 rounded-none bg-zinc-900" />
            
            <form onSubmit={handleSubmit} className="p-8 md:p-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  {/* Step 1: Personal */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                          <User size={24} />
                        </div>
                        <div>
                          <h2 className="text-2xl font-black uppercase tracking-tight">{t("application.form.personal")}</h2>
                          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">{t("application.form.personal_desc")}</p>
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t("application.form.first_name")}</Label>
                          <Input 
                            value={formData.firstName}
                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                            className="bg-zinc-900 border-white/10 h-12 rounded-xl focus:border-orange-500" 
                            placeholder={t("application.form.placeholders.first_name")} 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t("application.form.last_name")}</Label>
                          <Input 
                            value={formData.lastName}
                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                            className="bg-zinc-900 border-white/10 h-12 rounded-xl focus:border-orange-500" 
                            placeholder={t("application.form.placeholders.last_name")} 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t("application.form.email")}</Label>
                          <Input 
                            type="email" 
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className="bg-zinc-900 border-white/10 h-12 rounded-xl focus:border-orange-500" 
                            placeholder={t("application.form.placeholders.email")} 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t("application.form.phone")}</Label>
                          <Input 
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            className="bg-zinc-900 border-white/10 h-12 rounded-xl focus:border-orange-500" 
                            placeholder={t("application.form.placeholders.phone")} 
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Business */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                          <Building2 size={24} />
                        </div>
                        <div>
                          <h2 className="text-2xl font-black uppercase tracking-tight">{t("application.form.business")}</h2>
                          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">{t("application.form.business_desc")}</p>
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t("application.form.company_name")}</Label>
                          <Input 
                            value={formData.companyName}
                            onChange={(e) => handleInputChange("companyName", e.target.value)}
                            className="bg-zinc-900 border-white/10 h-12 rounded-xl focus:border-orange-500" 
                            placeholder={t("application.form.placeholders.company_name")}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t("application.form.sector")}</Label>
                          <Input 
                            value={formData.sector}
                            onChange={(e) => handleInputChange("sector", e.target.value)}
                            className="bg-zinc-900 border-white/10 h-12 rounded-xl focus:border-orange-500" 
                            placeholder={t("application.form.placeholders.sector")}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Territory */}
                  {step === 3 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                          <Globe size={24} />
                        </div>
                        <div>
                          <h2 className="text-2xl font-black uppercase tracking-tight">{t("application.form.target")}</h2>
                          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">{t("application.form.target_desc")}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t("application.form.target_select")}</Label>
                        <Select value={formData.targetCountry} onValueChange={(val) => handleInputChange("targetCountry", val)}>
                          <SelectTrigger className="bg-zinc-900 border-white/10 h-14 rounded-xl focus:ring-orange-500">
                            <SelectValue placeholder={t("application.form.choose_country")} />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-900 border-white/10 text-white max-h-60">
                            {countries.map((c) => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="p-6 bg-zinc-900/50 rounded-2xl border border-white/5 border-dashed">
                        <p className="text-xs text-gray-400 font-medium italic">
                          <Trans i18nKey="application.form.target_note" values={{ country: formData.targetCountry || t("application.form.placeholders.territory") }} components={{ highlight: <span className="text-orange-500 font-bold" /> }} />
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Experience */}
                  {step === 4 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                          <Briefcase size={24} />
                        </div>
                        <div>
                          <h2 className="text-2xl font-black uppercase tracking-tight">{t("application.form.exp")}</h2>
                          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">{t("application.form.exp_desc")}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t("application.form.motivations")}</Label>
                        <Textarea 
                          value={formData.motivations}
                          onChange={(e) => handleInputChange("motivations", e.target.value)}
                          className="bg-zinc-900 border-white/10 rounded-2xl min-h-[150px] focus:border-orange-500" 
                          placeholder={t("application.form.motivations_placeholder")}
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 5: Finance */}
                  {step === 5 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                          <Wallet size={24} />
                        </div>
                        <div>
                          <h2 className="text-2xl font-black uppercase tracking-tight">{t("application.form.finance")}</h2>
                          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">{t("application.form.finance_desc")}</p>
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t("application.form.budget")}</Label>
                          <Input 
                            value={formData.budget}
                            onChange={(e) => handleInputChange("budget", e.target.value)}
                            className="bg-zinc-900 border-white/10 h-12 rounded-xl focus:border-orange-500" 
                            placeholder={t("application.form.placeholders.budget")} 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t("application.form.deposit")}</Label>
                          <Input 
                            value={formData.deposit}
                            onChange={(e) => handleInputChange("deposit", e.target.value)}
                            className="bg-zinc-900 border-white/10 h-12 rounded-xl focus:border-orange-500" 
                            placeholder={t("application.form.placeholders.deposit")} 
                          />
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest italic">{t("application.form.finance_note")}</p>
                    </div>
                  )}

                  {/* Step 6: CV */}
                  {step === 6 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                          <FileText size={24} />
                        </div>
                        <div>
                          <h2 className="text-2xl font-black uppercase tracking-tight">{t("application.form.cv")}</h2>
                          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">{t("application.form.cv_desc")}</p>
                        </div>
                      </div>
                      <div className="border-2 border-dashed border-white/10 rounded-3xl p-12 text-center hover:border-orange-500/50 transition-colors cursor-pointer group">
                        <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                          <Upload size={32} className="text-gray-500 group-hover:text-orange-500" />
                        </div>
                        <h3 className="font-bold uppercase tracking-tight mb-1">{t("application.form.cv_choose")}</h3>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{t("application.form.cv_max")}</p>
                      </div>
                    </div>
                  )}

                  {/* Step 7: Validation */}
                  {step === 7 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                          <CheckCircle2 size={24} />
                        </div>
                        <div>
                          <h2 className="text-2xl font-black uppercase tracking-tight">{t("application.form.consent")}</h2>
                          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">{t("application.form.consent_desc")}</p>
                        </div>
                      </div>
                      <div className="p-8 bg-zinc-900 rounded-3xl border border-white/5 space-y-6">
                        <p className="text-sm text-gray-400 font-medium leading-relaxed">
                          {t("application.form.consent_legal")}
                        </p>
                        <div className="flex items-start gap-3">
                          <Checkbox 
                            id="consent" 
                            checked={formData.consent}
                            onCheckedChange={(val) => handleInputChange("consent", val)}
                            className="mt-1 border-white/20 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500" 
                          />
                          <Label htmlFor="consent" className="text-xs font-bold leading-relaxed text-gray-300 uppercase tracking-tight cursor-pointer">
                            {t("application.form.consent_check")}
                          </Label>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/5">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={prevStep} 
                  disabled={step === 1}
                  className="h-12 px-6 font-bold uppercase tracking-widest text-[10px] text-gray-500 hover:text-white"
                >
                  <ChevronLeft size={16} className="mr-2" />
                  {t("application.form.back")}
                </Button>
                
                {step < totalSteps ? (
                  <Button 
                    type="button" 
                    onClick={nextStep}
                    className="h-12 px-10 bg-white text-black hover:bg-gray-200 font-black uppercase tracking-widest text-[10px] shadow-xl"
                  >
                    {t("application.form.next")}
                    <ChevronRight size={16} className="ml-2" />
                  </Button>
                ) : (
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="h-12 px-12 bg-orange-500 text-white hover:bg-orange-600 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-orange-500/20"
                  >
                    {isSubmitting ? ( <><Loader2 className="mr-2 animate-spin" size={16}/> {t("application.form.processing")}</> ) : t("application.form.submit")}
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Application;