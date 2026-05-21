import React from "react";
import { useTranslation } from "react-i18next";
import { LayoutDashboard, Users, FileText, CheckCircle } from "lucide-react";

const Dashboard = () => {
  const { t } = useTranslation();

  const stats = [
    { label: t("dashboard.stats.applications"), value: "1,248", icon: FileText, color: "text-blue-500" },
    { label: t("dashboard.stats.approved"), value: "142", icon: CheckCircle, color: "text-green-500" },
    { label: t("dashboard.stats.pending"), value: "856", icon: Users, color: "text-orange-500" },
    { label: t("dashboard.stats.agents"), value: "24", icon: LayoutDashboard, color: "text-purple-500" },
  ];

  return (
    <div className="py-32 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="flex justify-between items-end mb-12 pt-20">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">{t("dashboard.title")}</h1>
          <p className="text-gray-500 font-medium uppercase tracking-widest text-xs">{t("dashboard.role.super")}</p>
        </div>
        <button className="px-6 py-2 bg-zinc-900 border border-white/10 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-white/5 transition-colors">
          {t("dashboard.logout")}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="p-8 bg-zinc-950 border border-white/5 rounded-[2rem] shadow-xl">
            <div className={`w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center mb-6 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div className="text-3xl font-black mb-1">{stat.value}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-zinc-950 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <h3 className="font-bold uppercase tracking-widest">{t("dashboard.table.list_title")}</h3>
          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{t("dashboard.table.list_desc")}</div>
        </div>
        <div className="p-20 text-center">
           <LayoutDashboard size={48} className="mx-auto text-zinc-800 mb-6" />
           <p className="text-gray-500 font-medium uppercase tracking-widest text-sm">{t("dashboard.table.empty")}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;