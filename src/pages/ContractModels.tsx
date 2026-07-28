import React from "react";
import { FileText, Download, ShieldCheck, CheckCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";

const ContractModels = () => {
  const { t } = useTranslation();
  const handleDownload = () => {
    toast.success(t("contract_models.toast_preparing"));
  };

  const annexes = t("contract_models.master_annexes", { returnObjects: true }) as string[];

  const licenses = t("contract_models.licenses", { returnObjects: true }) as Array<{
    title: string;
    limit: string;
    price: string;
    desc: string;
  }>;

  return (
    <div className="bg-black text-white py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 uppercase tracking-tight">{t("contract_models.title")} <span className="text-orange-500">{t("contract_models.title_accent")}</span></h1>
          <p className="text-base text-gray-400 max-w-3xl leading-relaxed font-medium">
            {t("contract_models.description")}
          </p>
        </div>

        {/* Disclaimer */}
        <div className="p-8 md:p-10 bg-zinc-950 border border-orange-500/30 rounded-[2rem] mb-16 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden shadow-xl">
           <div className="p-5 bg-orange-500/10 rounded-2xl shrink-0">
             <ShieldCheck className="text-orange-500" size={32} />
           </div>
           <div className="relative z-10">
             <h3 className="text-xl font-bold mb-3 uppercase tracking-tight">{t("contract_models.disclaimer_title")}</h3>
             <p className="text-gray-400 text-base leading-relaxed font-medium">
               {t("contract_models.disclaimer_text")}
             </p>
           </div>
        </div>

        {/* Grid Layout */}
        <div className="grid lg:grid-cols-2 gap-10 mb-20">
          {/* Master Franchise Agreement */}
          <div className="bg-zinc-950 p-8 md:p-10 rounded-[2rem] border border-white/5 relative group shadow-xl">
             <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center text-white mb-8 shadow-lg">
               <Lock size={24} />
             </div>
             <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight">{t("contract_models.master_title")}</h2>
             <p className="text-gray-400 mb-8 text-base leading-relaxed font-medium">
               {t("contract_models.master_desc")}
             </p>
             
             <div className="space-y-3 mb-10">
               <h4 className="text-orange-500 font-bold uppercase tracking-[0.3em] text-[7px]">{t("contract_models.master_annexes_label")}</h4>
               <div className="grid gap-2.5">
                 {annexes.map((annexe, i) => (
                   <div key={i} className="flex gap-3 items-center text-gray-400 bg-black/40 p-3.5 rounded-xl border border-white/5">
                     <CheckCircle className="text-orange-500 flex-shrink-0" size={14} />
                     <span className="font-bold uppercase tracking-tight text-sm">{annexe}</span>
                   </div>
                 ))}
               </div>
             </div>

             <Button onClick={handleDownload} className="w-full h-14 bg-orange-500 hover:bg-orange-600 font-bold text-lg rounded-xl shadow-lg transition-all active:scale-[0.98] text-white">
               {t("contract_models.master_button")} <Download className="ml-3" size={20} />
             </Button>
          </div>

          {/* Trade Community Licenses */}
          <div className="bg-zinc-950 p-8 md:p-10 rounded-[2rem] border border-white/5 relative shadow-xl">
             <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-gray-500 mb-8">
               <FileText size={24} />
             </div>
             <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight">{t("contract_models.regular_title")}</h2>
             <p className="text-gray-400 mb-8 text-base leading-relaxed font-medium">
               {t("contract_models.regular_desc")}
             </p>

             <div className="space-y-5">
                {licenses.map((lic, i) => (
                  <div key={i} className="p-6 bg-black rounded-xl border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 hover:border-orange-500/40 transition-all">
                    <div>
                      <h4 className="font-bold text-lg mb-0.5 uppercase tracking-tight">{lic.title}</h4>
                      <div className="inline-flex items-center px-2.5 py-0.5 bg-zinc-900 rounded-full text-[7px] font-bold text-orange-500 mb-3 border border-orange-500/20 uppercase tracking-widest">
                        {lic.limit}
                      </div>
                      <p className="text-gray-500 text-xs font-bold">{lic.desc}</p>
                    </div>
                    <div className="text-right w-full md:w-auto shrink-0">
                      <div className="text-2xl font-bold text-white tracking-tight">{lic.price}</div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-zinc-900 p-10 md:p-14 rounded-[2.5rem] text-center max-w-3xl mx-auto border border-white/5 shadow-xl">
          <h2 className="text-xl md:text-2xl font-bold mb-4 uppercase tracking-tight">{t("contract_models.footer_title")}</h2>
          <p className="text-gray-400 text-base mb-8 font-medium max-w-2xl mx-auto">
            {t("contract_models.footer_desc")}
          </p>
          <Link to="/contact">
            <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white h-14 px-10 text-lg font-bold rounded-xl transition-all shadow-lg">
              {t("contract_models.footer_button")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContractModels;