import React from "react";
import { useTranslation } from "react-i18next";
import { Download, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ContractModels = () => {
  const { t } = useTranslation();

  const licenses = t("contract_models.licenses", { returnObjects: true }) as any[];
  const annexes = t("contract_models.master_annexes", { returnObjects: true }) as string[];

  return (
    <div className="py-32 px-4 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 pt-20">
        {t("contract_models.title")} <span className="text-orange-500">{t("contract_models.title_accent")}</span>
      </h1>
      <p className="text-xl text-gray-400 max-w-2xl mb-20">{t("contract_models.description")}</p>

      <div className="grid md:grid-cols-2 gap-12 mb-20">
        <div className="p-12 bg-zinc-950 border border-white/10 rounded-[3rem] shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 uppercase tracking-widest">{t("contract_models.master_title")}</h2>
          <p className="text-gray-400 mb-8">{t("contract_models.master_desc")}</p>
          <div className="space-y-4 mb-10">
            {Array.isArray(annexes) && annexes.map((annex: string, i: number) => (
              <div key={i} className="flex items-center gap-3 text-sm text-gray-300 font-medium">
                <CheckCircle2 size={16} className="text-orange-500" />
                {annex}
              </div>
            ))}
          </div>
          <Button className="w-full h-16 bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase tracking-widest">
            <Download size={18} className="mr-2" />
            {t("contract_models.master_button")}
          </Button>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-6 uppercase tracking-widest px-4">{t("contract_models.regular_title")}</h2>
          {Array.isArray(licenses) && licenses.map((license: any, idx: number) => (
            <div key={idx} className="p-8 bg-zinc-900 border border-white/5 rounded-3xl hover:border-orange-500/30 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold uppercase">{license.title}</h3>
                  <p className="text-xs text-orange-500 font-bold uppercase tracking-widest">{license.limit}</p>
                </div>
                <div className="text-2xl font-black text-white">{license.price}</div>
              </div>
              <p className="text-sm text-gray-400 mb-4">{license.desc}</p>
              <button className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors flex items-center gap-2">
                <FileText size={12} />
                View Template
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContractModels;