import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, Globe, MessageSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { COUNTRIES } from "../lib/constants";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    territory: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message envoyé avec succès ! Un expert franchise vous contactera sous 24h.");
    setFormData({ name: "", email: "", phone: "", territory: "", message: "" });
  };

  return (
    <div className="bg-black text-white py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 uppercase tracking-tight">
            Contactez-<span className="text-orange-500">nous</span>
          </h1>
          <p className="text-base text-gray-400 max-w-3xl leading-relaxed font-medium">
            Une question stratégique ou besoin de précisions sur le déploiement technique ? Nos bureaux d'Amsterdam et nos experts régionaux sont à votre écoute.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10 items-start">
          {/* Info cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="p-8 bg-zinc-950 rounded-[2rem] border border-white/5 space-y-8 group hover:border-orange-500/30 transition-all shadow-xl relative overflow-hidden">
              <div className="flex gap-5 items-start relative z-10">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 shadow-lg shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-0.5 uppercase tracking-tight">Email Direct</h4>
                  <p className="text-gray-400 font-bold text-sm break-all">franchise@helloopass.net</p>
                  <p className="text-[7px] text-orange-500 font-bold uppercase tracking-[0.4em] mt-1.5">Réponse sous 24h</p>
                </div>
              </div>

              <div className="flex gap-5 items-start relative z-10">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 shadow-lg shrink-0">
                  <Globe size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-0.5 uppercase tracking-tight">Siège Social</h4>
                  <p className="text-gray-400 font-bold text-sm leading-relaxed">
                    World Open Services R&D BV <br />
                    Amsterdam, Pays-Bas
                  </p>
                </div>
              </div>

              <div className="flex gap-5 items-start relative z-10">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 shadow-lg shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-0.5 uppercase tracking-tight">Support</h4>
                  <p className="text-gray-400 font-bold text-sm leading-relaxed">
                    Lundi - Vendredi <br />
                    09:00 - 18:00 (GMT+1)
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-orange-500 rounded-2xl text-white shadow-xl transition-transform hover:scale-[1.01]">
              <MessageSquare size={36} className="mb-5 opacity-30" />
              <h3 className="text-xl font-bold mb-2 uppercase tracking-tight italic">Canal d'urgence</h3>
              <p className="font-bold mb-6 text-white/90 text-sm leading-relaxed">Investisseur institutionnel ou représentant gouvernemental ?</p>
              <Button className="bg-black text-white hover:bg-zinc-900 w-full rounded-xl h-12 font-bold uppercase tracking-widest text-[9px]">
                Accès Prioritaire
              </Button>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-zinc-950 p-8 md:p-12 rounded-[2.5rem] border border-white/5 space-y-8 relative overflow-hidden shadow-xl">
              <div className="grid md:grid-cols-2 gap-6 relative z-10">
                <div className="space-y-2">
                  <Label className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[7px]">Nom complet</Label>
                  <Input 
                    required
                    placeholder="Jean Dupont"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-black border-white/10 h-14 text-base rounded-xl px-6 focus:border-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[7px]">Email professionnel</Label>
                  <Input 
                    type="email" 
                    required
                    placeholder="contact@entreprise.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="bg-black border-white/10 h-14 text-base rounded-xl px-6 focus:border-orange-500"
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 relative z-10">
                <div className="space-y-2">
                  <Label className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[7px]">Téléphone</Label>
                  <Input 
                    type="tel" 
                    required
                    placeholder="+33 6 00 00 00 00"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="bg-black border-white/10 h-14 text-base rounded-xl px-6 focus:border-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[7px]">Territoire d'intérêt</Label>
                  <select 
                    className="w-full h-14 px-6 rounded-xl bg-black border border-white/10 text-white text-base font-bold appearance-none cursor-pointer focus:border-orange-500"
                    value={formData.territory}
                    onChange={(e) => setFormData({...formData, territory: e.target.value})}
                    required
                  >
                    <option value="">SÉLECTIONNEZ UN PAYS</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2 relative z-10">
                <Label className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[7px]">Votre message</Label>
                <Textarea 
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="bg-black border-white/10 text-base rounded-2xl p-6 focus:border-orange-500 leading-relaxed"
                  placeholder="Expliquez-nous brièvement votre projet..."
                />
              </div>

              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 h-14 text-lg font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] group relative z-10">
                Envoyer le message <Send className="ml-3 group-hover:translate-x-1 transition-transform" size={20} />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;