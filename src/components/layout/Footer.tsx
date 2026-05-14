import React from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Linkedin, Twitter, ArrowUpRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/5 pt-16 pb-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-12">
          <div className="col-span-1 lg:col-span-2 space-y-5">
            <Link to="/" className="text-xl font-bold text-white group flex items-center gap-1.5">
              <span className="text-orange-500">H</span>ELLOOPASS
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm font-medium">
              L'Operating System to Trade des communautés. Nous fournissons l'infrastructure technologique pour débloquer le commerce à grande échelle.
            </p>
            <div className="flex gap-3">
               <a href="#" className="w-9 h-9 bg-zinc-900 rounded-lg flex items-center justify-center text-gray-400 hover:bg-orange-500 hover:text-white transition-all shadow-lg">
                 <Linkedin size={16} />
               </a>
               <a href="#" className="w-9 h-9 bg-zinc-900 rounded-lg flex items-center justify-center text-gray-400 hover:bg-orange-500 hover:text-white transition-all shadow-lg">
                 <Twitter size={16} />
               </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-orange-500 font-bold uppercase tracking-[0.15em] text-[9px] mb-5">Navigation</h3>
            <ul className="space-y-2.5">
              {["Pourquoi", "Modele eco", "Territoires", "Prix"].map(item => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase().replace(" ", "-").replace("é", "e")}`} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group text-[11px] font-bold">
                    {item} <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-orange-500 font-bold uppercase tracking-[0.15em] text-[9px] mb-5">Partenariat</h3>
            <ul className="space-y-2.5">
              {["Processus", "Candidature", "Modeles"].map(item => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase().replace(" ", "-").replace("é", "e") === "modeles" ? "modeles-contrat" : item.toLowerCase()}`} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group text-[11px] font-bold">
                    {item} <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-orange-500 font-bold uppercase tracking-[0.15em] text-[9px] mb-5">Contact</h3>
            <ul className="space-y-4">
              <li className="flex gap-3 text-gray-400 group">
                <Mail className="text-orange-500 shrink-0" size={14} />
                <span className="text-[11px] font-bold break-all">franchise@helloopass.net</span>
              </li>
              <li className="flex gap-3 text-gray-400">
                <MapPin className="text-orange-500 shrink-0" size={14} />
                <span className="text-[11px] font-bold leading-relaxed">
                  World Open Services R&D BV <br />
                  Amsterdam, NL
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-[9px] font-bold uppercase tracking-widest">
            © 2025 World Open Services R&D BV – All rights reserved.
          </p>
          <div className="flex gap-5 text-[8px] font-bold uppercase tracking-[0.2em] text-gray-600">
            <a href="#" className="hover:text-orange-500 transition-colors">Legal Mentions</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;