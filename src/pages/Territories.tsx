import React, { useState } from "react";
import { Globe, AlertTriangle, CheckCircle, Search, Mail } from "lucide-react";
import { EXCLUDED_COUNTRIES, COUNTRIES, IMAGES } from "../lib/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const Territories = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [alertEmail, setAlertEmail] = useState("");

  const filteredCountries = COUNTRIES.filter(c => 
    c.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAlert = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Alerte enregistr\u00e9e ! Vous serez inform\u00e9 si un territoire se lib\u00e8re.");
    setAlertEmail("");
  };

  return (
    <div className="bg-black text-white py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 uppercase tracking-tight">Territoires <span className="text-orange-500">Disponibles</span></h1>
          <p className="text-base text-gray-400 max-w-3xl leading-relaxed font-medium">
            Bonne nouvelle : <span className="text-white font-bold">Tous les pays du globe sont autoris\u00e9s.</span> La franchise Helloopass est accessible partout, \u00e0 l'exception de {EXCLUDED_COUNTRIES.length} territoires d\u00e9j\u00e0 strat\u00e9giquement attribu\u00e9s.
          </p>
        </div>

        {/* Global Map Visual */}
        <div className="relative mb-20 rounded-[2.5rem] overflow-hidden border border-white/10 h-[300px] md:h-[450px] group shadow-xl">
          <img 
            src={IMAGES.map} 
            alt="Global Map" 
            className="w-full h-full object-cover opacity-70 transition-transform duration-[20s] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30"></div>
          
          <div className="absolute top-6 right-6 bg-black/80 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse shadow-lg shadow-orange-500/50"></div>
              <span className="font-bold text-base tracking-tight uppercase">{COUNTRIES.length - EXCLUDED_COUNTRIES.length} PAYS DISPONIBLES</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-800"></div>
              <span className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[7px]">{EXCLUDED_COUNTRIES.length} Attribu\u00e9s (Exclusions)</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 mb-20">
          {/* Exclusions */}
          <div className="bg-zinc-950 p-8 md:p-10 rounded-[2rem] border border-white/5 relative overflow-hidden shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 shadow-lg">
                <AlertTriangle size={20} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight">Exclusivit\u00e9s D\u00e9j\u00e0 <br /> Attribu\u00e9es</h2>
            </div>
            
            <p className="text-gray-400 mb-6 text-sm leading-relaxed font-medium">
              Ces territoires ont d\u00e9j\u00e0 trouv\u00e9 leurs partenaires exclusifs. Pour ces pays, nous ne prenons plus de nouvelles candidatures de franchise.
            </p>
            
            <div className="grid grid-cols-2 gap-3 mb-8">
              {EXCLUDED_COUNTRIES.map(country => (
                <div key={country} className="p-3.5 bg-zinc-900/40 rounded-xl border border-white/5 flex items-center gap-2.5 group hover:bg-zinc-900 transition-all">
                  <div className="w-1 h-1 rounded-full bg-zinc-800 group-hover:bg-red-500 transition-colors shadow-lg shadow-red-500/20"></div>
                  <span className="text-gray-500 font-bold text-sm uppercase tracking-tight group-hover:text-white transition-colors">{country}</span>
                </div>
              ))}
            </div>
            
            <div className="p-6 bg-zinc-900 rounded-2xl border border-white/5">
              <h3 className="font-bold text-base mb-5 flex items-center gap-2.5 uppercase tracking-tight">
                <Mail className="text-orange-500" size={16} /> Liste d'attente
              </h3>
              <form onSubmit={handleAlert} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <Input 
                    type="email" 
                    placeholder="votre@email.com" 
                    value={alertEmail}
                    onChange={(e) => setAlertEmail(e.target.value)}
                    className="bg-black border-white/10 h-12 text-base rounded-xl flex-grow px-5"
                    required
                  />
                  <Button type="submit" className="bg-orange-500 hover:bg-orange-600 h-12 px-6 font-bold text-sm rounded-xl transition-all">
                    M'alerter
                  </Button>
                </div>
                <p className="text-[7px] text-gray-600 font-bold uppercase tracking-widest text-center">Soyez inform\u00e9 si un territoire se lib\u00e8re.</p>
              </form>
            </div>
          </div>

          {/* Search/List */}
          <div className="bg-zinc-950 p-8 md:p-10 rounded-[2rem] border border-white/5 flex flex-col h-[600px] relative overflow-hidden shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 shadow-lg">
                <CheckCircle size={20} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight">V\u00e9rifier la <br /> Disponibilit\u00e9</h2>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <Input 
                placeholder="Rechercher votre pays..." 
                className="pl-11 bg-black border-white/10 h-14 text-base font-bold rounded-xl px-6 focus:border-orange-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex-grow overflow-y-auto pr-3 space-y-2.5 custom-scrollbar">
              {filteredCountries.length > 0 ? (
                filteredCountries.map(country => {
                  const isExcluded = EXCLUDED_COUNTRIES.includes(country);
                  return (
                    <div key={country} className="p-3.5 bg-black/40 hover:bg-white/5 rounded-xl flex justify-between items-center transition-all border border-transparent hover:border-white/10 group">
                      <span className="text-base font-bold uppercase tracking-tight group-hover:text-orange-500 transition-colors">{country}</span>
                      {isExcluded ? (
                        <span className="text-[7px] font-bold text-red-500 border border-red-500/30 bg-red-500/10 px-3 py-1.5 rounded-full uppercase tracking-widest">Occup\u00e9</span>
                      ) : (
                        <Link to={`/candidature?country=${country}`}>
                          <Button size="sm" variant="outline" className="text-[7px] font-bold text-orange-500 border-orange-500/30 hover:bg-orange-500 hover:text-white rounded-full uppercase tracking-widest px-3 h-7">
                            Disponible
                          </Button>
                        </Link>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-16 text-gray-700">
                  <Globe className="mx-auto mb-3 opacity-20" size={48} />
                  <p className="text-sm font-bold uppercase tracking-widest opacity-30">Aucun pays trouv\u00e9</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Territories;