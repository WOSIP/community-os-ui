import React, { useState, useEffect } from "react";
import { 
  Users, 
  FileText, 
  CheckCircle, 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  LayoutDashboard,
  ShieldCheck,
  UserPlus,
  LogOut,
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Mock data for applications
const MOCK_APPLICATIONS = [
  { id: "1", name: "Jean Dupont", email: "j.dupont@email.com", country: "France", status: "pending", date: "2024-03-20" },
  { id: "2", name: "Fatou Traoré", email: "fatou.t@email.com", country: "Sénégal", status: "accepted", date: "2024-03-18" },
  { id: "3", name: "Ahmed Mansour", email: "ahmed.m@email.com", country: "Maroc", status: "exclusive", date: "2024-03-15" },
  { id: "4", name: "Alice Johnson", email: "alice.j@email.com", country: "Canada", status: "pending", date: "2024-03-21" },
  { id: "5", name: "Koffi Mensah", email: "koffi.m@email.com", country: "Ghana", status: "non_exclusive", date: "2024-03-12" },
];

// Mock data for agents
const MOCK_AGENTS = [
  { id: "1", email: "admin1@helloopass.net", role: "admin", status: "active" },
  { id: "2", email: "reader@helloopass.net", role: "read_only", status: "active" },
  { id: "3", email: "superadmin@helloopass.net", role: "super_admin", status: "active" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("applications");

  useEffect(() => {
    const isAdmin = sessionStorage.getItem("isAdmin");
    if (isAdmin !== "true") {
      toast.error("Accès non autorisé. Veuillez vous connecter.");
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("isAdmin");
    toast.success("Déconnexion réussie");
    navigate("/");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "exclusive": return "text-orange-500 bg-orange-500/10 border-orange-500/20";
      case "accepted": return "text-green-500 bg-green-500/10 border-green-500/20";
      case "pending": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      default: return "text-zinc-500 bg-zinc-500/10 border-zinc-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10 pt-24">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="text-orange-500" size={16} />
              <span className="text-orange-500 font-bold uppercase tracking-widest text-[10px]">Espace Super Admin</span>
            </div>
            <h1 className="text-3xl font-bold uppercase tracking-tight">Tableau de Bord</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 h-10 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest" onClick={handleLogout}>
              <LogOut className="mr-2" size={14} /> Déconnexion
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Candidatures", value: "154", icon: FileText, color: "text-blue-500" },
            { label: "Approuvées", value: "42", icon: CheckCircle, color: "text-green-500" },
            { label: "En attente", value: "112", icon: Clock, color: "text-orange-500" },
            { label: "Agents Actifs", value: "12", icon: Users, color: "text-purple-500" }
          ].map((stat, i) => (
            <Card key={i} className="bg-zinc-950 border-white/5 rounded-2xl overflow-hidden shadow-xl">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-zinc-900 ${stat.color}`}>
                    <stat.icon size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="applications" className="w-full" onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <TabsList className="bg-zinc-950 border border-white/5 p-1 rounded-xl h-11">
              <TabsTrigger value="applications" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-lg px-6 text-[10px] font-bold uppercase tracking-widest">
                Candidatures
              </TabsTrigger>
              <TabsTrigger value="agents" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-lg px-6 text-[10px] font-bold uppercase tracking-widest">
                Gestion Agents
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-grow sm:flex-grow-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                <Input placeholder="Rechercher..." className="pl-9 bg-zinc-950 border-white/5 h-11 rounded-xl w-full sm:w-64 text-sm" />
              </div>
              <Button className="bg-orange-500 hover:bg-orange-600 h-11 px-4 rounded-xl shrink-0">
                <Filter size={16} />
              </Button>
            </div>
          </div>

          <TabsContent value="applications">
            <Card className="bg-zinc-950 border-white/5 rounded-2xl overflow-hidden shadow-xl">
              <CardHeader className="border-b border-white/5 p-6 flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-lg font-bold uppercase tracking-tight">Liste des Candidatures</CardTitle>
                  <CardDescription className="text-zinc-500 text-xs mt-1">Gérez les demandes de franchise internationale.</CardDescription>
                </div>
                <Button className="bg-zinc-900 border border-white/10 text-white hover:bg-zinc-800 h-10 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                  Exporter CSV
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-zinc-900/50">
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest p-4">Candidat</TableHead>
                      <TableHead className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest p-4">Territoire</TableHead>
                      <TableHead className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest p-4">Date</TableHead>
                      <TableHead className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest p-4">Status</TableHead>
                      <TableHead className="text-right text-zinc-500 text-[10px] font-bold uppercase tracking-widest p-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_APPLICATIONS.map((app) => (
                      <TableRow key={app.id} className="border-white/5 hover:bg-white/5 transition-colors">
                        <TableCell className="p-4">
                          <div className="font-bold text-sm">{app.name}</div>
                          <div className="text-[10px] text-zinc-500">{app.email}</div>
                        </TableCell>
                        <TableCell className="p-4">
                          <div className="font-bold text-sm uppercase tracking-tight">{app.country}</div>
                        </TableCell>
                        <TableCell className="p-4 text-zinc-400 text-xs">
                          {app.date}
                        </TableCell>
                        <TableCell className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest border ${getStatusColor(app.status)}`}>
                            {app.status.replace("_", " ")}
                          </span>
                        </TableCell>
                        <TableCell className="p-4 text-right">
                          <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white hover:bg-white/10 rounded-lg h-8 w-8">
                            <MoreHorizontal size={14} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agents">
            <Card className="bg-zinc-950 border-white/5 rounded-2xl overflow-hidden shadow-xl">
              <CardHeader className="border-b border-white/5 p-6 flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-lg font-bold uppercase tracking-tight">Gestion des Accès</CardTitle>
                  <CardDescription className="text-zinc-500 text-xs mt-1">Créez et gérez les comptes administrateurs.</CardDescription>
                </div>
                <Button className="bg-orange-500 hover:bg-orange-600 h-10 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                  <UserPlus className="mr-2" size={14} /> Nouvel Agent
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-zinc-900/50">
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest p-4">Utilisateur</TableHead>
                      <TableHead className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest p-4">Rôle</TableHead>
                      <TableHead className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest p-4">Status</TableHead>
                      <TableHead className="text-right text-zinc-500 text-[10px] font-bold uppercase tracking-widest p-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_AGENTS.map((agent) => (
                      <TableRow key={agent.id} className="border-white/5 hover:bg-white/5 transition-colors">
                        <TableCell className="p-4">
                          <div className="font-bold text-sm">{agent.email}</div>
                          <div className="text-[10px] text-zinc-500">ID: {agent.id}</div>
                        </TableCell>
                        <TableCell className="p-4">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                            {agent.role.replace("_", " ")}
                          </span>
                        </TableCell>
                        <TableCell className="p-4">
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-green-500">Actif</span>
                          </div>
                        </TableCell>
                        <TableCell className="p-4 text-right">
                          <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white hover:bg-white/10 rounded-lg h-8 w-8">
                            <MoreHorizontal size={14} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;