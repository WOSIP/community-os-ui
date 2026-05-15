import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronRight, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const navLinks = [
    { name: t("nav.concept"), path: "/pourquoi" },
    { name: t("nav.business"), path: "/modele-economique" },
    { name: t("nav.countries"), path: "/territoires" },
    { name: t("nav.calculator"), path: "/prix" },
    { name: t("nav.steps"), path: "/processus" },
    { name: t("nav.law"), path: "/modeles-contrat" },
    { name: t("nav.faq"), path: "/faq" },
    { name: t("nav.contact"), path: "/contact" },
  ];

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
      scrolled ? "bg-black/95 backdrop-blur-xl border-b border-white/5 h-16" : "bg-transparent h-20"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-lg md:text-xl font-bold text-white flex items-center gap-1.5 group">
              <span className="text-orange-500">H</span>ELLOOPASS
              <div className="w-1 h-1 bg-orange-500 rounded-full animate-pulse"></div>
            </Link>
          </div>
          
          <div className="hidden lg:block">
            <div className="flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-[0.15em] transition-all ${
                    location.pathname === link.path 
                    ? "text-orange-500 bg-orange-500/10" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="ml-4 flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/5">
                      <Globe size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-zinc-900 border-white/10 text-white">
                    <DropdownMenuItem onClick={() => changeLanguage('fr')} className="cursor-pointer font-bold uppercase text-[10px]">
                      Français {i18n.language === 'fr' && "✓"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => changeLanguage('en')} className="cursor-pointer font-bold uppercase text-[10px]">
                      English {i18n.language === 'en' && "✓"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link to="/candidature">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white border-none rounded-lg h-9 px-4 text-[9px] font-bold uppercase tracking-widest shadow-md shadow-orange-500/10">
                    {t("nav.become_franchisee")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:hidden flex items-center gap-2">
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-white bg-white/5 rounded-lg border border-white/10">
                    <Globe size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-zinc-900 border-white/10 text-white">
                  <DropdownMenuItem onClick={() => changeLanguage('fr')} className="cursor-pointer font-bold uppercase text-[10px]">
                    Français {i18n.language === 'fr' && "✓"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeLanguage('en')} className="cursor-pointer font-bold uppercase text-[10px]">
                    English {i18n.language === 'en' && "✓"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-white bg-white/5 rounded-lg border border-white/10"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-black fixed top-0 left-0 w-full h-screen z-[90] p-6 flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <Link to="/" onClick={() => setIsOpen(false)} className="text-lg font-bold text-white">
              <span className="text-orange-500">H</span>ELLOOPASS
            </Link>
            <button onClick={() => setIsOpen(false)} className="p-2 text-white bg-white/5 rounded-lg border border-white/10">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between p-3.5 rounded-xl text-base font-bold uppercase tracking-widest transition-all ${
                  location.pathname === link.path 
                  ? "bg-orange-500 text-white" 
                  : "bg-white/5 text-gray-400 hover:text-white"
                }`}
              >
                {link.name}
                <ChevronRight size={18} />
              </Link>
            ))}
            <Link
              to="/candidature"
              onClick={() => setIsOpen(false)}
              className="mt-4"
            >
              <Button className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-base font-bold rounded-xl uppercase tracking-widest">
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