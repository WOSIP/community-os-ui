import React, { useState, useEffect, useRef } from "react";
import { 
  Users, 
  FileText, 
  CheckCircle, 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  ShieldCheck,
  UserPlus,
  LogOut,
  Edit2,
  Power,
  Trash2,
  RefreshCcw,
  Check,
  User,
  Phone,
  Hash,
  Briefcase,
  Upload,
  Image as ImageIcon,
  FileSearch,
  Camera,
  Eye
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
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface Application {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  country: string;
  status: string;
  created_at: string;
}

interface Agent {
  id: string;
  email: string;
  role: 'read_only' | 'admin' | 'super_admin';
  is_active: boolean;
  first_name?: string;
  last_name?: string;
  phone?: string;
  gender?: string;
  age?: number;
  profile_picture_url?: string;
  id_picture_url?: string;
  id_type?: string;
  passport_id?: string;
  national_id?: string;
  agent_id?: string;
  created_at: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("applications");
  const [applications, setApplications] = useState<Application[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  
  // Agent Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [agentForm, setAgentForm] = useState({
    email: "",
    password: "",
    role: "read_only" as Agent['role'],
    first_name: "",
    last_name: "",
    phone: "",
    gender: "",
    age: "",
    profile_picture_url: "",
    id_picture_url: "",
    id_type: "passport"
  });
  
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [idPreview, setIdPreview] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const idInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const isAdmin = sessionStorage.getItem("isAdmin");
    const userRole = sessionStorage.getItem("userRole");
    
    if (isAdmin !== "true") {
      toast.error("Acc\u00e8s non autoris\u00e9. Veuillez vous connecter.");
      navigate("/");
      return;
    }

    if (userRole === "super_admin") {
      setIsSuperAdmin(true);
    }

    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Applications
      const { data: apps, error: appsError } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (appsError) throw appsError;
      setApplications(apps || []);

      // Fetch Agents (Profiles)
      const { data: profs, error: profsError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (profsError) throw profsError;
      setAgents(profs || []);
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("isAdmin");
    sessionStorage.removeItem("userRole");
    toast.success("D\u00e9connexion r\u00e9ussie");
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

  const openCreateDialog = () => {
    setEditingAgent(null);
    setAgentForm({ 
      email: "", 
      password: "", 
      role: "read_only",
      first_name: "",
      last_name: "",
      phone: "",
      gender: "",
      age: "",
      profile_picture_url: "",
      id_picture_url: "",
      id_type: "passport"
    });
    setProfileFile(null);
    setIdFile(null);
    setProfilePreview(null);
    setIdPreview(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (agent: Agent) => {
    setEditingAgent(agent);
    setAgentForm({ 
      email: agent.email, 
      password: "", 
      role: agent.role,
      first_name: agent.first_name || "",
      last_name: agent.last_name || "",
      phone: agent.phone || "",
      gender: agent.gender || "",
      age: agent.age?.toString() || "",
      profile_picture_url: agent.profile_picture_url || "",
      id_picture_url: agent.id_picture_url || "",
      id_type: agent.id_type || "passport"
    });
    setProfileFile(null);
    setIdFile(null);
    setProfilePreview(agent.profile_picture_url || null);
    setIdPreview(agent.id_picture_url || null);
    setIsDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'id') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    if (type === 'profile') {
      setProfileFile(file);
      setProfilePreview(previewUrl);
    } else {
      setIdFile(file);
      setIdPreview(previewUrl);
    }
  };

  const uploadFile = async (file: File, bucket: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error(`Erreur lors de l'upload du fichier ${file.name}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleAgentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      toast.error("Seuls les Super Admins peuvent g\u00e9rer les agents.");
      return;
    }

    setIsSubmitting(true);
    try {
      let profileUrl = agentForm.profile_picture_url;
      let idUrl = agentForm.id_picture_url;

      // Upload files if present
      if (profileFile) {
        profileUrl = await uploadFile(profileFile, 'agent-assets');
      }
      if (idFile) {
        idUrl = await uploadFile(idFile, 'agent-assets');
      }

      const action = editingAgent ? 'update' : 'create';
      const payload = {
        action,
        id: editingAgent?.id,
        email: agentForm.email,
        password: agentForm.password || undefined,
        role: agentForm.role,
        is_active: editingAgent ? editingAgent.is_active : true,
        first_name: agentForm.first_name,
        last_name: agentForm.last_name,
        phone: agentForm.phone,
        gender: agentForm.gender,
        age: agentForm.age ? parseInt(agentForm.age) : null,
        profile_picture_url: profileUrl,
        id_picture_url: idUrl,
        id_type: agentForm.id_type,
        // Explicitly clear these as we no longer use manual IDs
        passport_id: null,
        national_id: null
      };

      // Call the edge function
      const { data, error } = await supabase.functions.invoke('manage-admins', {
        body: payload
      });

      if (error) throw error;

      toast.success(editingAgent ? "Agent modifi\u00e9 avec succ\u00e8s" : "Agent cr\u00e9\u00e9 avec succ\u00e8s");
      setIsDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAgentStatus = async (agent: Agent) => {
    if (!isSuperAdmin) {
      toast.error("Action r\u00e9serv\u00e9e aux Super Admins.");
      return;
    }

    try {
      const { error } = await supabase.functions.invoke('manage-admins', {
        body: {
          action: 'toggle_status',
          id: agent.id,
          is_active: !agent.is_active
        }
      });

      if (error) throw error;
      toast.success(`Agent ${agent.is_active ? 'd\u00e9sactiv\u00e9' : 'activ\u00e9'} avec succ\u00e8s`);
      fetchData();
    } catch (error: any) {
      toast.error(`Erreur: ${error.message}`);
    }
  };

  const changeAgentRole = async (agent: Agent, newRole: Agent['role']) => {
    if (!isSuperAdmin) return;
    
    try {
      const { error } = await supabase.functions.invoke('manage-admins', {
        body: {
          action: 'update',
          id: agent.id,
          role: newRole,
          is_active: agent.is_active
        }
      });

      if (error) throw error;
      toast.success("R\u00f4le mis \u00e0 jour");
      fetchData();
    } catch (error: any) {
      toast.error(`Erreur: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10 pt-24">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className={isSuperAdmin ? "text-orange-500" : "text-blue-500"} size={16} />
              <span className={`${isSuperAdmin ? "text-orange-500" : "text-blue-500"} font-bold uppercase tracking-widest text-[10px]`}>
                {isSuperAdmin ? "Espace Super Admin" : "Espace Admin"}
              </span>
            </div>
            <h1 className="text-3xl font-bold uppercase tracking-tight">Tableau de Bord</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="border-white/10 text-white hover:bg-white/5 h-10 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest" 
              onClick={handleLogout}
            >
              <LogOut className="mr-2" size={14} /> D\u00e9connexion
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Candidatures", value: applications.length.toString(), icon: FileText, color: "text-blue-500" },
            { label: "Approuv\u00e9es", value: applications.filter(a => a.status === 'accepted').length.toString(), icon: CheckCircle, color: "text-green-500" },
            { label: "En attente", value: applications.filter(a => a.status === 'pending').length.toString(), icon: Clock, color: "text-orange-500" },
            { label: "Agents", value: agents.length.toString(), icon: Users, color: "text-purple-500" }
          ].map((stat, i) => (
            <Card key={i} className="bg-zinc-950 border-white/5 rounded-2xl overflow-hidden shadow-xl">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{loading ? "..." : stat.value}</p>
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
              <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 h-11 px-4 rounded-xl shrink-0" onClick={fetchData}>
                <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
              </Button>
            </div>
          </div>

          <TabsContent value="applications">
            <Card className="bg-zinc-950 border-white/5 rounded-2xl overflow-hidden shadow-xl">
              <CardHeader className="border-b border-white/5 p-6 flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-lg font-bold uppercase tracking-tight">Liste des Candidatures</CardTitle>
                  <CardDescription className="text-zinc-500 text-xs mt-1">G\u00e9rez les demandes de franchise internationale.</CardDescription>
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
                    {loading ? (
                      <TableRow><TableCell colSpan={5} className="text-center p-8 text-zinc-500">Chargement...</TableCell></TableRow>
                    ) : applications.length === 0 ? (
                      <TableRow><TableCell colSpan={5} className="text-center p-8 text-zinc-500">Aucune candidature trouv\u00e9e.</TableCell></TableRow>
                    ) : applications.map((app) => (
                      <TableRow key={app.id} className="border-white/5 hover:bg-white/5 transition-colors">
                        <TableCell className="p-4">
                          <div className="font-bold text-sm">{app.first_name} {app.last_name}</div>
                          <div className="text-[10px] text-zinc-500">{app.email}</div>
                        </TableCell>
                        <TableCell className="p-4">
                          <div className="font-bold text-sm uppercase tracking-tight">{app.country}</div>
                        </TableCell>
                        <TableCell className="p-4 text-zinc-400 text-xs">
                          {new Date(app.created_at).toLocaleDateString()}
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
                  <CardTitle className="text-lg font-bold uppercase tracking-tight">Gestion des Acc\u00e8s</CardTitle>
                  <CardDescription className="text-zinc-500 text-xs mt-1">Cr\u00e9ez et g\u00e9rez les comptes administrateurs.</CardDescription>
                </div>
                {isSuperAdmin && (
                  <Button 
                    className="bg-orange-500 hover:bg-orange-600 h-10 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest"
                    onClick={openCreateDialog}
                  >
                    <UserPlus className="mr-2" size={14} /> Nouvel Agent
                  </Button>
                )}
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-zinc-900/50">
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest p-4">ID Agent</TableHead>
                      <TableHead className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest p-4">Utilisateur</TableHead>
                      <TableHead className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest p-4">R\u00f4le</TableHead>
                      <TableHead className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest p-4">Status</TableHead>
                      <TableHead className="text-right text-zinc-500 text-[10px] font-bold uppercase tracking-widest p-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow><TableCell colSpan={5} className="text-center p-8 text-zinc-500">Chargement...</TableCell></TableRow>
                    ) : agents.length === 0 ? (
                      <TableRow><TableCell colSpan={5} className="text-center p-8 text-zinc-500">Aucun agent trouv\u00e9.</TableCell></TableRow>
                    ) : agents.map((agent) => (
                      <TableRow key={agent.id} className="border-white/5 hover:bg-white/5 transition-colors">
                        <TableCell className="p-4">
                          <div className="font-mono text-[10px] font-bold text-orange-500 bg-orange-500/10 px-2 py-1 rounded w-fit uppercase">
                            {agent.agent_id || 'Generating...'}
                          </div>
                        </TableCell>
                        <TableCell className="p-4">
                          <div className="flex items-center gap-3">
                            {agent.profile_picture_url ? (
                              <img src={agent.profile_picture_url} className="w-8 h-8 rounded-full border border-white/10 object-cover" alt="" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center border border-white/10">
                                <User size={14} className="text-zinc-500" />
                              </div>
                            )}
                            <div>
                              <div className="font-bold text-sm">
                                {agent.first_name || agent.last_name ? `${agent.first_name} ${agent.last_name}` : agent.email}
                              </div>
                              <div className="text-[10px] text-zinc-500">{agent.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                              {agent.role.replace("_", " ")}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="p-4">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${agent.is_active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}></div>
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${agent.is_active ? 'text-green-500' : 'text-red-500'}`}>
                              {agent.is_active ? 'Actif' : 'D\u00e9sactiv\u00e9'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="p-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white hover:bg-white/10 rounded-lg h-8 w-8">
                                <MoreHorizontal size={14} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-zinc-900 border-white/10 text-white w-48 rounded-xl overflow-hidden p-1 shadow-2xl">
                              <DropdownMenuItem 
                                className="text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-white/5 rounded-lg py-2.5"
                                onClick={() => openEditDialog(agent)}
                              >
                                <Edit2 className="mr-2" size={12} /> Modifier
                              </DropdownMenuItem>
                              
                              <DropdownMenuSeparator className="bg-white/5" />
                              
                              <DropdownMenuItem 
                                className="text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-white/5 rounded-lg py-2.5"
                                onClick={() => changeAgentRole(agent, 'read_only')}
                              >
                                {agent.role === 'read_only' && <Check className="mr-2" size={12} />} Passer Read-only
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-white/5 rounded-lg py-2.5"
                                onClick={() => changeAgentRole(agent, 'admin')}
                              >
                                {agent.role === 'admin' && <Check className="mr-2" size={12} />} Passer Admin
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-white/5 rounded-lg py-2.5"
                                onClick={() => changeAgentRole(agent, 'super_admin')}
                              >
                                {agent.role === 'super_admin' && <Check className="mr-2" size={12} />} Passer Super Admin
                              </DropdownMenuItem>

                              <DropdownMenuSeparator className="bg-white/5" />
                              
                              <DropdownMenuItem 
                                className={`text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-white/5 rounded-lg py-2.5 ${agent.is_active ? 'text-red-400' : 'text-green-400'}`}
                                onClick={() => toggleAgentStatus(agent)}
                              >
                                <Power className="mr-2" size={12} /> {agent.is_active ? 'D\u00e9sactiver' : 'R\u00e9activer'}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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

      {/* Create/Edit Agent Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-zinc-950 border-white/10 text-white max-w-2xl rounded-[2rem] p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold uppercase tracking-tight">
              {editingAgent ? "Modifier l'Agent" : "Nouvel Agent"}
            </DialogTitle>
            <DialogDescription className="text-zinc-500 text-xs mt-2">
              {editingAgent ? "Mettez \u00e0 jour le profil complet de l'agent." : "Cr\u00e9ez un nouveau compte agent avec son profil complet."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAgentSubmit} className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Image Section */}
              <div className="col-span-full flex flex-col items-center justify-center space-y-4 pb-4 border-b border-white/5">
                <div 
                  className="relative w-24 h-24 rounded-full bg-zinc-900 border-2 border-dashed border-white/10 flex items-center justify-center cursor-pointer hover:border-orange-500/50 transition-colors overflow-hidden group"
                  onClick={() => profileInputRef.current?.click()}
                >
                  {profilePreview ? (
                    <>
                      <img src={profilePreview} className="w-full h-full object-cover" alt="Profile" />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera size={20} className="text-white" />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-zinc-500">
                      <User size={24} />
                      <span className="text-[8px] font-bold uppercase mt-1">Photo</span>
                    </div>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={profileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={(e) => handleFileChange(e, 'profile')} 
                />
                <p className="text-zinc-500 text-[8px] font-bold uppercase">Cliquez pour changer la photo de profil</p>
              </div>

              {/* Credentials Section */}
              <div className="space-y-4 col-span-full pb-4 border-b border-white/5">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-orange-500">Identifiants d'acc\u00e8s</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-gray-500 font-bold uppercase tracking-widest text-[8px]">Email Professionnel</Label>
                    <div className="relative">
                      <Input 
                        value={agentForm.email}
                        onChange={(e) => setAgentForm({...agentForm, email: e.target.value})}
                        placeholder="admin@helloopass.net"
                        className="bg-black border-white/10 h-12 rounded-xl text-sm pl-10"
                        required
                        disabled={!!editingAgent}
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                    </div>
                  </div>

                  {!editingAgent && (
                    <div className="space-y-1.5">
                      <Label className="text-gray-500 font-bold uppercase tracking-widest text-[8px]">Mot de passe temporaire</Label>
                      <Input 
                        type="password"
                        value={agentForm.password}
                        onChange={(e) => setAgentForm({...agentForm, password: e.target.value})}
                        placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                        className="bg-black border-white/10 h-12 rounded-xl text-sm"
                        required
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label className="text-gray-500 font-bold uppercase tracking-widest text-[8px]">R\u00f4le Syst\u00e8me</Label>
                    <Select 
                      value={agentForm.role} 
                      onValueChange={(val: any) => setAgentForm({...agentForm, role: val})}
                    >
                      <SelectTrigger className="bg-black border-white/10 h-12 rounded-xl text-sm">
                        <SelectValue placeholder="S\u00e9lectionner un r\u00f4le" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10 text-white">
                        <SelectItem value="read_only">Read-only (Consultation)</SelectItem>
                        <SelectItem value="admin">Admin (Gestion)</SelectItem>
                        <SelectItem value="super_admin">Super Admin (Total)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Profile Details Section */}
              <div className="space-y-4 col-span-full pb-4 border-b border-white/5">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-orange-500">Profil Personnel</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-gray-500 font-bold uppercase tracking-widest text-[8px]">Pr\u00e9nom</Label>
                    <Input 
                      value={agentForm.first_name}
                      onChange={(e) => setAgentForm({...agentForm, first_name: e.target.value})}
                      placeholder="Jean"
                      className="bg-black border-white/10 h-12 rounded-xl text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gray-500 font-bold uppercase tracking-widest text-[8px]">Nom de Famille</Label>
                    <Input 
                      value={agentForm.last_name}
                      onChange={(e) => setAgentForm({...agentForm, last_name: e.target.value})}
                      placeholder="Dupont"
                      className="bg-black border-white/10 h-12 rounded-xl text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gray-500 font-bold uppercase tracking-widest text-[8px]">T\u00e9l\u00e9phone</Label>
                    <div className="relative">
                      <Input 
                        value={agentForm.phone}
                        onChange={(e) => setAgentForm({...agentForm, phone: e.target.value})}
                        placeholder="+33 6 00 00 00 00"
                        className="bg-black border-white/10 h-12 rounded-xl text-sm pl-10"
                      />
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gray-500 font-bold uppercase tracking-widest text-[8px]">\u00c2ge</Label>
                    <Input 
                      type="number"
                      value={agentForm.age}
                      onChange={(e) => setAgentForm({...agentForm, age: e.target.value})}
                      placeholder="30"
                      className="bg-black border-white/10 h-12 rounded-xl text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gray-500 font-bold uppercase tracking-widest text-[8px]">Genre</Label>
                    <Select 
                      value={agentForm.gender} 
                      onValueChange={(val: any) => setAgentForm({...agentForm, gender: val})}
                    >
                      <SelectTrigger className="bg-black border-white/10 h-12 rounded-xl text-sm">
                        <SelectValue placeholder="S\u00e9lectionner" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10 text-white">
                        <SelectItem value="male">Homme</SelectItem>
                        <SelectItem value="female">Femme</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Documents Section */}
              <div className="space-y-4 col-span-full">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-orange-500">Documents d'identit\u00e9</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-gray-500 font-bold uppercase tracking-widest text-[8px]">Type de pi\u00e8ce d'identit\u00e9</Label>
                    <Select 
                      value={agentForm.id_type} 
                      onValueChange={(val: any) => setAgentForm({...agentForm, id_type: val})}
                    >
                      <SelectTrigger className="bg-black border-white/10 h-12 rounded-xl text-sm">
                        <SelectValue placeholder="S\u00e9lectionner" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10 text-white">
                        <SelectItem value="passport">Passeport</SelectItem>
                        <SelectItem value="national_id">Carte Nationale d'Identit\u00e9 (CNI)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-gray-500 font-bold uppercase tracking-widest text-[8px]">Photo de la pi\u00e8ce d'identit\u00e9</Label>
                    <div 
                      className="relative h-12 bg-black border border-white/10 rounded-xl flex items-center px-4 cursor-pointer hover:bg-white/5 transition-colors group"
                      onClick={() => idInputRef.current?.click()}
                    >
                      <Upload className="mr-2 text-zinc-500" size={14} />
                      <span className="text-xs text-zinc-400 truncate">
                        {idFile ? idFile.name : idPreview ? "Pi\u00e8ce d'identit\u00e9 t\u00e9l\u00e9charg\u00e9e" : "T\u00e9l\u00e9charger un fichier..."}
                      </span>
                      {idPreview && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="ml-auto h-8 w-8 text-orange-500 hover:text-orange-400 hover:bg-transparent"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(idPreview, '_blank');
                          }}
                        >
                          <Eye size={14} />
                        </Button>
                      )}
                    </div>
                    <input 
                      type="file" 
                      ref={idInputRef} 
                      className="hidden" 
                      accept="image/*,application/pdf" 
                      onChange={(e) => handleFileChange(e, 'id')} 
                    />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="flex gap-3 sm:gap-0 mt-8">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1 border-white/10 text-white hover:bg-white/5 h-12 rounded-xl text-[10px] font-bold uppercase tracking-widest"
                onClick={() => setIsDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-orange-500 hover:bg-orange-600 h-12 rounded-xl text-[10px] font-bold uppercase tracking-widest"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Traitement..." : editingAgent ? "Mettre \u00e0 jour" : "Cr\u00e9er le profil"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;