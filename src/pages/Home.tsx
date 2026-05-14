import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Globe, Shield, Zap, TrendingUp, Smartphone, Clock, CheckCircle, Lock, User, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { REASONS, IMAGES } from "../lib/constants";
import { toast } from "sonner";

const Home = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Hardcoded credentials per request
    if (loginData.username === "superadmin" && loginData.password === "1Fsadmin1966") {
      setTimeout(() => {
        sessionStorage.setItem("isAdmin", "true");
        sessionStorage.setItem("userRole", "super_admin");
        toast.success("Connexion réussie ! Bienvenue superadmin.");
        navigate("/dashboard");
        setIsLoading(false);
      }, 1000);
    } else {
      setTimeout(() => {
        toast.error("Identifiants incorrects. Veuillez réessayer.");
        setIsLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="bg-black text-white selection:bg-orange-500/30">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={IMAGES.hero} 
            alt="Global Trade Infrastructure World Map" 
            className="w-full h-full object-cover opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_90%)]"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full text-orange-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
              <Globe size={12} /> Global Trade Infrastructure
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-tight">
              Devenez le <br />
              <span className="text-orange-500">Représentant Exclusif</span> <br />
              Helloopass OS pour votre pays
            </h1>
            <p className="text-base md:text-lg text-gray-300 mb-10 leading-relaxed max-w-2xl font-medium">
              Vous détenez la Master Licence. Vous donnez accès aux communautés de votre territoire en leur fournissant les licences régulières. Comme Visa donne les outils aux banques, vous donnez les outils aux communautés.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/candidature">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white h-14 px-8 text-base font-bold rounded-xl border-none shadow-lg shadow-orange-500/20 group">
                  Devenir franchisé <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/pourquoi">
                <Button size="lg" variant="outline" className="text-white border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 h-14 px-8 text-base font-bold rounded-xl">
                  Le concept
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <div className="w-0.5 h-10 rounded-full bg-gradient-to-b from-orange-500 to-transparent"></div>
        </div>
      </section>

      {/* Key Figures */}
      <section className="py-20 bg-zinc-950 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Pays disponibles", val: "238", desc: "Une exclusivité nationale disponible sur 238 territoires du globe." },
              { label: "Investissement", val: "+100k USD", desc: "Prix indexé sur la population (Population ÷ 200)." },
              { label: "Part revenus", val: "25%", desc: "Commissions récurrentes sur chaque transaction du territoire." }
            ].map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative p-8 rounded-[2rem] bg-black border border-white/5 group hover:border-orange-500/30 transition-all duration-300"
              >
                <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">{stat.val}</div>
                <div className="text-lg font-bold mb-2 text-white uppercase tracking-tight">{stat.label}</div>
                <p className="text-gray-400 text-sm leading-relaxed">{stat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 uppercase tracking-tight">Visa vs Helloopass</h2>
          <p className="text-gray-400 text-base font-medium">Le changement de paradigme de l'infrastructure financière</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-px bg-white/10 rounded-[1.5rem] overflow-hidden border border-white/10 shadow-xl">
          <div className="bg-zinc-950 p-8 md:p-12 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20 shrink-0">
                <Shield className="text-blue-500" size={20} />
              </div>
              <span className="text-xl font-bold text-blue-500 uppercase">Visa</span>
              <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest mt-1">Infrastructure Banques</span>
            </div>
            <ul className="space-y-6">
              <li className="flex gap-4 items-start">
                <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 text-[10px] font-bold shrink-0">1</div>
                <p className="text-base text-gray-400">Fournit l'infrastructure aux <span className="text-white font-bold">Banques</span> uniquement.</p>
              </li>
              <li className="flex gap-4 items-start">
                <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 text-[10px] font-bold shrink-0">2</div>
                <p className="text-base text-gray-400">Cible les <span className="text-white font-bold">Clients bancarisés</span> individuels.</p>
              </li>
              <li className="flex gap-4 items-start">
                <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 text-[10px] font-bold shrink-0">3</div>
                <p className="text-base text-gray-400">Nécessite des <span className="text-white font-bold">Licences e-money</span> lourdes et complexes.</p>
              </li>
            </ul>
          </div>

          <div className="bg-zinc-950 p-8 md:p-12 relative text-center md:text-left">
            <div className="absolute inset-0 bg-orange-500/5 pointer-events-none"></div>
            <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0">
                <Zap className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold text-orange-500 uppercase">Helloopass</span>
              <span className="text-[9px] font-bold text-orange-400 uppercase tracking-widest mt-1">Infrastructure Communautés</span>
            </div>
            <ul className="space-y-6">
              <li className="flex gap-4 items-start">
                <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">1</div>
                <p className="text-base text-white">Fournit l'infrastructure aux <span className="text-orange-500 font-bold underline decoration-2">Communautés</span>.</p>
              </li>
              <li className="flex gap-4 items-start">
                <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">2</div>
                <p className="text-base text-white">Cible les <span className="text-orange-500 font-bold">Membres</span> de ces écosystèmes.</p>
              </li>
              <li className="flex gap-4 items-start">
                <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">3</div>
                <p className="text-base text-white">Système de <span className="text-orange-500 font-bold">Vouchers</span> – Aucune licence e-money.</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Closed Loops Section */}
      <section className="py-20 bg-zinc-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 uppercase tracking-tight">Écosystème de <br /><span className="text-orange-500">Closed Loops</span></h2>
            <p className="text-base text-gray-400 mb-8 leading-relaxed font-medium">
              Les members tradent entre eux avec des bons d'achat (vouchers) prépayés. Seuls les commerçants agréés peuvent "cash out", sécurisant totalement le circuit.
            </p>
            <div className="space-y-3">
              {[
                "Inter-connexion via ACH (Automated Clearing House)",
                "Global Hpass Clearing House pour le trading cross-border",
                "Traçabilité totale en temps réel de chaque unité de valeur"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-3.5 bg-black border border-white/5 rounded-xl">
                  <div className="w-7 h-7 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle className="text-orange-500" size={14} />
                  </div>
                  <span className="text-sm font-bold text-gray-200">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 bg-orange-500/10 blur-3xl rounded-full"></div>
            <img 
              src={IMAGES.trade} 
              alt="Successful African Investor in Modern Office" 
              className="relative rounded-[1.5rem] border border-white/10 shadow-xl transition-transform duration-500 group-hover:scale-[1.01]" 
            />
            <div className="absolute -bottom-4 -left-4 bg-orange-500 p-6 rounded-2xl shadow-xl hidden md:block">
              <TrendingUp size={32} className="text-white" />
            </div>
          </div>
        </div>
      </section>

      {/* BNPL Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="bg-zinc-900 p-6 rounded-2xl border border-white/10 relative overflow-hidden group hover:border-orange-500/30 transition-all">
                <h3 className="text-lg font-bold mb-2 uppercase tracking-tight">BNPL Traditionnel</h3>
                <p className="text-gray-400 font-medium text-[11px]">Modèle de crédit adapté aux besoins de consommation de la communauté.</p>
                <Clock className="mt-4 text-orange-500/30" size={24} />
              </div>
              <div className="bg-orange-500 p-6 rounded-2xl text-white shadow-lg shadow-orange-500/20 group hover:scale-[1.02] transition-transform">
                <h3 className="text-lg font-bold mb-2 uppercase tracking-tight">BNPL Marchand</h3>
                <p className="text-white/90 font-bold text-[11px]">Financement direct via le réseau de commerçants agréés.</p>
                <Smartphone className="mt-4 text-white/50" size={24} />
              </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 uppercase tracking-tight">BNPL <span className="text-orange-500">100% Profits</span></h2>
            <p className="text-base text-gray-400 mb-6 leading-relaxed font-medium">
              Contrairement aux modèles classiques, les revenus Buy Now Pay Later appartiennent à <span className="text-white font-bold">100% à la Trade Community</span>. Helloopass fournit l'outil, vous récoltez la valeur.
            </p>
            <Link to="/modele-economique">
              <Button variant="link" className="text-orange-500 p-0 h-auto text-base font-bold hover:text-orange-400 uppercase tracking-widest">
                Modèle Économique <ArrowRight className="ml-2" size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 10 Reasons Grid */}
      <section className="py-20 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 uppercase tracking-tight">Pourquoi nous rejoindre ?</h2>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">10 raisons stratégiques</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {REASONS.map((reason, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="p-5 bg-black border border-white/5 rounded-xl hover:border-orange-500/40 transition-all duration-300 group flex flex-col justify-between h-full"
              >
                <div>
                  <div className="text-orange-500/60 md:text-orange-500/20 font-bold text-2xl mb-3 group-hover:text-orange-500 transition-colors">{(idx + 1).toString().padStart(2, '0')}</div>
                  <h3 className="font-bold text-base mb-1.5 uppercase tracking-tight leading-tight">{reason.title}</h3>
                  <p className="text-gray-500 font-medium text-[10px] leading-relaxed">{reason.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Admin Login Section */}
      <section id="admin-login" className="py-24 bg-zinc-950 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-from),_transparent_50%)] from-orange-500/5"></div>
        <div className="max-w-md mx-auto px-4 relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500 mb-4">
              <Lock size={20} />
            </div>
            <h2 className="text-2xl font-bold uppercase tracking-tight mb-2">Accès Backend</h2>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">Réservé aux administrateurs</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-gray-500 font-bold uppercase tracking-widest text-[7px]">Identifiant</label>
              </div>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                <Input 
                  type="text" 
                  placeholder="Username" 
                  className="bg-black border-white/10 h-12 pl-12 rounded-xl text-sm focus:border-orange-500 transition-all"
                  value={loginData.username}
                  onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-gray-500 font-bold uppercase tracking-widest text-[7px]">Mot de passe</label>
              </div>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  className="bg-black border-white/10 h-12 pl-12 rounded-xl text-sm focus:border-orange-500 transition-all"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-orange-500 hover:bg-orange-600 h-12 text-sm font-bold rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-orange-500/10"
              disabled={isLoading}
            >
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          <div className="mt-8 p-4 bg-orange-500/5 border border-orange-500/10 rounded-xl">
            <p className="text-[8px] text-zinc-500 text-center uppercase tracking-widest leading-relaxed">
              En accédant à cet espace, vous acceptez les conditions de sécurité et de confidentialité de World Open Services BV.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-orange-500 relative overflow-hidden group">
        <div className="absolute inset-0 bg-black/5 opacity-20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 tracking-tight uppercase leading-tight">
            Votre territoire <br /> vous attend
          </h2>
          <div className="flex flex-col md:flex-row gap-5 justify-center items-center">
             <Link to="/candidature">
              <Button size="lg" className="bg-white text-orange-500 hover:bg-zinc-100 h-14 px-10 text-lg font-bold rounded-xl border-none shadow-xl group">
                Postuler maintenant <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <div className="text-white font-bold flex flex-col items-start md:items-center text-left md:text-center">
               <span className="text-2xl font-bold text-white">238 PAYS</span>
               <span className="uppercase tracking-[0.2em] text-[9px] opacity-80">disponibilité mondiale</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;