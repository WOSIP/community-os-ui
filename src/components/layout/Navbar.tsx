import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Globe, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "fr" : "en";
    i18n.changeLanguage(newLang);
  };

  const navItems = [
    { name: t("nav.concept"), path: "/pourquoi" },
    { name: t("nav.business"), path: "/modele-economique" },
    { name: t("nav.countries"), path: "/territoires" },
    { name: t("nav.calculator"), path: "/prix" },
    { name: t("nav.steps"), path: "/processus" },
    { name: t("nav.contact"), path: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tighter text-white">
                HELLOOPASS<span className="text-orange-500">.</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-bold uppercase tracking-widest transition-colors ${
                    location.pathname === item.path
                      ? "text-orange-500"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="text-gray-400 hover:text-white flex items-center gap-2"
            >
              <Globe size={16} />
              <span className="uppercase font-bold text-xs">{i18n.language}</span>
            </Button>
            <Link to="/candidature">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase text-xs tracking-widest px-6">
                {t("nav.become_franchisee")}
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="text-gray-400 hover:text-white"
            >
              <Globe size={18} />
            </Button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-zinc-950 border-b border-white/10">
          <div className="px-4 pt-2 pb-6 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="block text-lg font-bold uppercase tracking-widest text-gray-400 hover:text-white"
              >
                {item.name}
              </Link>
            ))}
            <Link to="/candidature" onClick={() => setIsOpen(false)}>
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase tracking-widest py-6">
                {t("nav.become_franchisee")}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;