import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-zinc-950 border-t border-white/5 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <span className="text-2xl font-black tracking-tighter text-white">
                HELLOOPASS<span className="text-orange-500">.</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed font-medium">
              {t("footer.desc")}
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">
              {t("footer.nav_title")}
            </h4>
            <ul className="space-y-4">
              <li><Link to="/pourquoi" className="text-gray-500 hover:text-orange-500 text-sm transition-colors">{t("footer.nav_items.why")}</Link></li>
              <li><Link to="/modele-economique" className="text-gray-500 hover:text-orange-500 text-sm transition-colors">{t("footer.nav_items.model")}</Link></li>
              <li><Link to="/territoires" className="text-gray-500 hover:text-orange-500 text-sm transition-colors">{t("footer.nav_items.territories")}</Link></li>
              <li><Link to="/prix" className="text-gray-500 hover:text-orange-500 text-sm transition-colors">{t("footer.nav_items.pricing")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">
              {t("footer.partnership_title")}
            </h4>
            <ul className="space-y-4">
              <li><Link to="/processus" className="text-gray-500 hover:text-orange-500 text-sm transition-colors">{t("footer.partnership_items.process")}</Link></li>
              <li><Link to="/candidature" className="text-gray-500 hover:text-orange-500 text-sm transition-colors">{t("footer.partnership_items.application")}</Link></li>
              <li><Link to="/modeles-contrat" className="text-gray-500 hover:text-orange-500 text-sm transition-colors">{t("footer.partnership_items.models")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">
              {t("footer.contact_title")}
            </h4>
            <ul className="space-y-4">
              <li><Link to="/contact" className="text-gray-500 hover:text-orange-500 text-sm transition-colors">{t("nav.contact")}</Link></li>
              <li><Link to="/dashboard" className="text-gray-500 hover:text-orange-500 text-sm transition-colors">{t("footer.admin_access")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-600 text-xs font-medium">
            {t("footer.rights")}
          </p>
          <div className="flex gap-8">
            <Link to="#" className="text-gray-600 hover:text-white text-xs font-medium uppercase tracking-widest transition-colors">{t("footer.legal")}</Link>
            <Link to="#" className="text-gray-600 hover:text-white text-xs font-medium uppercase tracking-widest transition-colors">{t("footer.privacy")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;