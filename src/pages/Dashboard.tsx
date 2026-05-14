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
  Eye,
  Mail,
  Building,
  Calendar,
  MapPin,
  Globe,
  Award,
  Wallet,
  FileCheck,
  XCircle,
  Ban,
  ExternalLink,
  ChevronDown
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase, searchApplications, updateApplication } from "@/lib/supabase";

interface Application {
  id: string;
  candidate_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  status: string;
  created_at: string;
  updated_at: string;
  // Business Info
  business_name?: string;
  business_status?: string;
  business_country?: string;
  business_year?: number;
  business_address?: string;
  business_sector?: string;
  business_employees?: number;
  business_ca?: string;
  // Personal Info
  birth_date?: string;
  nationality?: string;
  address?: string;
  // Experience
  experience_years?: number;
  is_existing_franchisee?: boolean;
  network_details?: string;
  motivation?: string;
  // Financial
  budget?: string;
  payment_schedule?: string;
  deposit_amount?: string;
  cv_url?: string;
  consent_given?: boolean;
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
  const [searchTerm, setSearchTerm] = useState("");
  
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
  
  // Application Dialog State
  const [isAppDialogOpen, setIsAppDialogOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [appForm, setAppForm] = useState<Partial<Application>>({});
  
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
      toast.error("Accès non autorisé. Veuillez vous connecter.");
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm) {
      fetchData();
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await searchApplications(searchTerm);
      if (error) throw error;
      setApplications(data || []);
    } catch (error: any) {
      toast.error("Erreur lors de la recherche");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("isAdmin");
    sessionStorage.removeItem("userRole");
    toast.success("Déconnexion réussie");
    navigate("/");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "exclusive": 
      case "attributed_exclusive": return "text-orange-500 bg-orange-500/10 border-orange-500/20";
      case "accepted": 
      case "active": return "text-green-500 bg-green-500/10 border-green-500/20";
      case "non_exclusive":
      case "attributed_non_exclusive": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "rejected": return "text-red-500 bg-red-500/10 border-red-500/20";
      case "disabled": return "text-zinc-400 bg-zinc-900 border-zinc-800";
      case "pending": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
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

  const openAppDetails = (app: Application) => {
    setSelectedApp(app);
    setAppForm({ ...app });
    setIsAppDialogOpen(true);
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
      toast.error("Seuls les Super Admins peuvent gérer les agents.");
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

      toast.success(editingAgent ? "Agent modifié avec succès" : "Agent créé avec succès");
      setIsDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAppUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    setIsSubmitting(true);
    try {
      const { error } = await updateApplication(selectedApp.id, appForm);
      if (error) throw error;

      toast.success("Dossier candidat mis à jour");
      setIsAppDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateAppStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await updateApplication(id, { status: newStatus });
      if (error) throw error;
      toast.success(`Statut mis à jour vers: ${newStatus.replace("_", " ")}`);
      fetchData();
    } catch (error: any) {
      toast.error(`Erreur: ${error.message}`);
    }
  };

  const toggleAgentStatus = async (agent: Agent) => {
    if (!isSuperAdmin) {
      toast.error("Action réservée aux Super Admins.");
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
      toast.success(`Agent ${agent.is_active ? 'désactivé' : 'activé'} avec succès`);
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
      toast.success("Rôle mis à jour");
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
              <LogOut className="mr-2" size={14} /> Déconnexion
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Candidatures", value: applications.length.toString(), icon: FileText, color: "text-blue-500" },
            { label: "Approuvées", value: applications.filter(a => ['accepted', 'active', 'exclusive', 'attributed_exclusive'].includes(a.status)).length.toString(), icon: CheckCircle, color: "text-green-500" },
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
              <form onSubmit={handleSearch} className="relative flex-grow sm:flex-grow-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                <Input 
                  placeholder="ID, Email, Business..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-zinc-950 border-white/5 h-11 rounded-xl w-full sm:w-64 text-sm" 
                />
              </form>
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
                      <TableHead className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest p-4">ID Candidat</TableHead>
                      <TableHead className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest p-4">Candidat</TableHead>
                      <TableHead className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest p-4">Territoire</TableHead>
                      <TableHead className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest p-4">Date</TableHead>
                      <TableHead className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest p-4">Status</TableHead>
                      <TableHead className="text-right text-zinc-500 text-[10px] font-bold uppercase tracking-widest p-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow><TableCell colSpan={6} className="text-center p-8 text-zinc-500">Chargement...</TableCell></TableRow>
                    ) : applications.length === 0 ? (
                      <TableRow><TableCell colSpan={6} className="text-center p-8 text-zinc-500">Aucune candidature trouvée.</TableCell></TableRow>
                    ) : applications.map((app) => (
                      <TableRow key={app.id} className="border-white/5 hover:bg-white/5 transition-colors cursor-pointer" onClick={() => openAppDetails(app)}>
                        <TableCell className="p-4">
                          <div className="font-mono text-[10px] font-bold text-orange-500 bg-orange-500/10 px-2 py-1 rounded w-fit uppercase">
                            {app.candidate_id || 'Generating...'}
                          </div>
                        </TableCell>
                        <TableCell className="p-4">
                          <div className="font-bold text-sm">{app.first_name} {app.last_name}</div>
                          <div className="text-[10px] text-zinc-500">{app.email}</div>
                          {app.business_name && (
                            <div className="text-[9px] text-orange-500/70 font-bold uppercase mt-1">{app.business_name}</div>
                          )}
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
                        <TableCell className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white hover:bg-white/10 rounded-lg h-8 w-8">
                                <MoreHorizontal size={14} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-zinc-900 border-white/10 text-white w-56 rounded-xl overflow-hidden p-1 shadow-2xl">
                              <DropdownMenuItem 
                                className="text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-white/5 rounded-lg py-2.5"
                                onClick={() => openAppDetails(app)}
                              >
                                <FileSearch className="mr-2" size={12} /> Voir/Modifier Détails
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-white/5" />
                              <DropdownMenuItem 
                                className="text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-green-500/20 text-green-400 rounded-lg py-2.5"
                                onClick={() => updateAppStatus(app.id, 'attributed_exclusive')}
                              >
                                <ShieldCheck className="mr-2" size={12} /> Attribué Exclusif
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-blue-500/20 text-blue-400 rounded-lg py-2.5"
                                onClick={() => updateAppStatus(app.id, 'attributed_non_exclusive')}
                              >
                                <Globe className="mr-2" size={12} /> Attribué Non-Exclusif
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-red-500/20 text-red-400 rounded-lg py-2.5"
                                onClick={() => updateAppStatus(app.id, 'rejected')}
                              >
                                <XCircle className="mr-2" size={12} /> Rejeter Dossier
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-zinc-700 text-zinc-400 rounded-lg py-2.5"
                                onClick={() => updateAppStatus(app.id, 'disabled')}
                              >
                                <Ban className="mr-2" size={12} /> Désactiver (Disable)
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

          <TabsContent value="agents">
            <Card className="bg-zinc-950 border-white/5 rounded-2xl overflow-hidden shadow-xl">
              <CardHeader className="border-b border-white/5 p-6 flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-lg font-bold uppercase tracking-tight">Gestion des Accès</CardTitle>
                  <CardDescription className="text-zinc-500 text-xs mt-1">Créez et gérez les comptes administrateurs.</CardDescription>
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
                      <TableHead className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest p-4">Rôle</TableHead>
                      <TableHead className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest p-4">Status</TableHead>
                      <TableHead className="text-right text-zinc-500 text-[10px] font-bold uppercase tracking-widest p-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow><TableCell colSpan={5} className="text-center p-8 text-zinc-500">Chargement...</TableCell></TableRow>
                    ) : agents.length === 0 ? (
                      <TableRow><TableCell colSpan={5} className="text-center p-8 text-zinc-500">Aucun agent trouvé.</TableCell></TableRow>
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
                              {agent.is_active ? 'Actif' : 'Désactivé'}
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
                                <Power className="mr-2" size={12} /> {agent.is_active ? 'Désactiver' : 'Réactiver'}
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

      {/* Application Details Dialog */}
      <Dialog open={isAppDialogOpen} onOpenChange={setIsAppDialogOpen}>
        <DialogContent className="bg-zinc-950 border-white/10 text-white max-w-4xl rounded-[2rem] p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="font-mono text-xs font-bold text-orange-500 bg-orange-500/10 px-3 py-1.5 rounded-full uppercase border border-orange-500/20">
                {selectedApp?.candidate_id}
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(appForm.status || '')}`}>
                {appForm.status?.replace("_", " ")}
              </span>
            </div>
            <DialogTitle className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2">
              <User className="text-orange-500" size={24} />
              Dossier de {selectedApp?.first_name} {selectedApp?.last_name}
            </DialogTitle>
            <DialogDescription className="text-zinc-500 text-xs mt-2">Mettez à jour les informations du candidat ou son statut.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAppUpdate} className="space-y-10 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              {/* Section: Coordonnées */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500 flex items-center gap-2">
                   <Mail size={14} /> Coordonnées & État Civil
                </h3>
                <div className="space-y-4 bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-zinc-500 font-bold uppercase tracking-widest text-[8px]">Prénom</Label>
                      <Input value={appForm.first_name} onChange={e => setAppForm({...appForm, first_name: e.target.value})} className="bg-black border-white/10" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-zinc-500 font-bold uppercase tracking-widest text-[8px]">Nom</Label>
                      <Input value={appForm.last_name} onChange={e => setAppForm({...appForm, last_name: e.target.value})} className="bg-black border-white/10" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-zinc-500 font-bold uppercase tracking-widest text-[8px]">Email</Label>
                    <Input value={appForm.email} onChange={e => setAppForm({...appForm, email: e.target.value})} className="bg-black border-white/10" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-zinc-500 font-bold uppercase tracking-widest text-[8px]">Téléphone</Label>
                    <Input value={appForm.phone} onChange={e => setAppForm({...appForm, phone: e.target.value})} className="bg-black border-white/10" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-zinc-500 font-bold uppercase tracking-widest text-[8px]">Date de Naissance</Label>
                      <Input type="date" value={appForm.birth_date} onChange={e => setAppForm({...appForm, birth_date: e.target.value})} className="bg-black border-white/10" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-zinc-500 font-bold uppercase tracking-widest text-[8px]">Nationalité</Label>
                      <Input value={appForm.nationality} onChange={e => setAppForm({...appForm, nationality: e.target.value})} className="bg-black border-white/10" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-zinc-500 font-bold uppercase tracking-widest text-[8px]">Adresse</Label>
                    <Input value={appForm.address} onChange={e => setAppForm({...appForm, address: e.target.value})} className="bg-black border-white/10" />
                  </div>
                </div>
              </div>

              {/* Section: Business */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500 flex items-center gap-2">
                   <Building size={14} /> Structure Business
                </h3>
                <div className="space-y-4 bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                  <div className="space-y-1.5">
                    <Label className="text-zinc-500 font-bold uppercase tracking-widest text-[8px]">Nom Entreprise</Label>
                    <Input value={appForm.business_name} onChange={e => setAppForm({...appForm, business_name: e.target.value})} className="bg-black border-white/10" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-zinc-500 font-bold uppercase tracking-widest text-[8px]">Statut Juridique</Label>
                      <Input value={appForm.business_status} onChange={e => setAppForm({...appForm, business_status: e.target.value})} className="bg-black border-white/10" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-zinc-500 font-bold uppercase tracking-widest text-[8px]">Pays d'immat.</Label>
                      <Input value={appForm.business_country} onChange={e => setAppForm({...appForm, business_country: e.target.value})} className="bg-black border-white/10" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-zinc-500 font-bold uppercase tracking-widest text-[8px]">Année Création</Label>
                      <Input type="number" value={appForm.business_year} onChange={e => setAppForm({...appForm, business_year: parseInt(e.target.value)})} className="bg-black border-white/10" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-zinc-500 font-bold uppercase tracking-widest text-[8px]">Secteur</Label>
                      <Input value={appForm.business_sector} onChange={e => setAppForm({...appForm, business_sector: e.target.value})} className="bg-black border-white/10" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-zinc-500 font-bold uppercase tracking-widest text-[8px]">Employés</Label>
                      <Input type="number" value={appForm.business_employees} onChange={e => setAppForm({...appForm, business_employees: parseInt(e.target.value)})} className="bg-black border-white/10" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-zinc-500 font-bold uppercase tracking-widest text-[8px]">CA Annuel</Label>
                      <Input value={appForm.business_ca} onChange={e => setAppForm({...appForm, business_ca: e.target.value})} className="bg-black border-white/10" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Projet & Territoire */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500 flex items-center gap-2">
                   <Globe size={14} /> Projet & Territoire
                </h3>
                <div className="space-y-4 bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                  <div className="space-y-1.5">
                    <Label className="text-zinc-500 font-bold uppercase tracking-widest text-[8px]">Pays Visé (Territoire)</Label>
                    <Input value={appForm.country} onChange={e => setAppForm({...appForm, country: e.target.value})} className="bg-black border-white/10" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-zinc-500 font-bold uppercase tracking-widest text-[8px]">Expérience (années)</Label>
                    <Input type="number" value={appForm.experience_years} onChange={e => setAppForm({...appForm, experience_years: parseInt(e.target.value)})} className="bg-black border-white/10" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-zinc-500 font-bold uppercase tracking-widest text-[8px]">Motivations</Label>
                    <Textarea value={appForm.motivation} onChange={e => setAppForm({...appForm, motivation: e.target.value})} className="bg-black border-white/10 min-h-[100px]" />
                  </div>
                </div>
              </div>

              {/* Section: Finance & Documents */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500 flex items-center gap-2">
                   <Wallet size={14} /> Finance & Documents
                </h3>
                <div className="space-y-4 bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-zinc-500 font-bold uppercase tracking-widest text-[8px]">Budget Global</Label>
                      <Input value={appForm.budget} onChange={e => setAppForm({...appForm, budget: e.target.value})} className="bg-black border-white/10" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-zinc-500 font-bold uppercase tracking-widest text-[8px]">Acompte Dispo.</Label>
                      <Input value={appForm.deposit_amount} onChange={e => setAppForm({...appForm, deposit_amount: e.target.value})} className="bg-black border-white/10" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-zinc-500 font-bold uppercase tracking-widest text-[8px]">Proposition Échelonnement</Label>
                    <Textarea value={appForm.payment_schedule} onChange={e => setAppForm({...appForm, payment_schedule: e.target.value})} className="bg-black border-white/10 h-20" />
                  </div>
                  
                  {appForm.cv_url && (
                    <div className="pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full border-orange-500/20 text-orange-500 hover:bg-orange-500/5 h-12 rounded-xl"
                        onClick={() => window.open(appForm.cv_url, '_blank')}
                      >
                        <FileCheck className="mr-2" size={16} /> Consulter le CV (PDF)
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Section: Statut du Dossier */}
              <div className="col-span-full space-y-4 pt-4 border-t border-white/5">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500 flex items-center gap-2">
                   <Award size={14} /> Statut & Gestion de la Candidature
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-orange-500/5 p-8 rounded-2xl border border-orange-500/10">
                  <div className="space-y-2">
                    <Label className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Action sur le Statut</Label>
                    <Select 
                      value={appForm.status} 
                      onValueChange={(val: any) => setAppForm({...appForm, status: val})}
                    >
                      <SelectTrigger className="bg-black border-white/10 h-14 rounded-xl text-sm font-bold">
                        <SelectValue placeholder="Changer le statut" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10 text-white">
                        <SelectItem value="pending">En Attente (Pending)</SelectItem>
                        <SelectItem value="accepted">Accepté</SelectItem>
                        <SelectItem value="active">Actif</SelectItem>
                        <SelectItem value="attributed_exclusive">Attribué Exclusif</SelectItem>
                        <SelectItem value="attributed_non_exclusive">Attribué Non-Exclusif</SelectItem>
                        <SelectItem value="rejected">Rejeté</SelectItem>
                        <SelectItem value="disabled">Désactivé (Disabled)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-[9px] text-zinc-500 italic">Modifier le statut change l'accès et la visibilité du candidat dans le système.</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Dernière mise à jour</div>
                      <div className="text-sm font-bold">
                        {appForm.updated_at ? new Date(appForm.updated_at).toLocaleString() : 'Jamais'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="flex gap-3 sm:gap-4 mt-10 pb-4">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1 border-white/10 text-white hover:bg-white/5 h-14 rounded-xl text-[10px] font-bold uppercase tracking-widest"
                onClick={() => setIsAppDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-orange-500 hover:bg-orange-600 h-14 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-orange-500/20"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enregistrement..." : "Enregistrer les Modifications"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Agent Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-zinc-950 border-white/10 text-white max-w-2xl rounded-[2rem] p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold uppercase tracking-tight">
              {editingAgent ? "Modifier l'Agent" : "Nouvel Agent"}
            </DialogTitle>
            <DialogDescription className="text-zinc-500 text-xs mt-2">
              {editingAgent ? "Mettez à jour le profil complet de l'agent." : "Créez un nouveau compte agent avec son profil complet."}
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
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-orange-500">Identifiants d'accès</h3>
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
                        placeholder="••••••••"
                        className="bg-black border-white/10 h-12 rounded-xl text-sm"
                        required
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label className="text-gray-500 font-bold uppercase tracking-widest text-[8px]">Rôle Système</Label>
                    <Select 
                      value={agentForm.role} 
                      onValueChange={(val: any) => setAgentForm({...agentForm, role: val})}
                    >
                      <SelectTrigger className="bg-black border-white/10 h-12 rounded-xl text-sm">
                        <SelectValue placeholder="Sélectionner un rôle" />
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
                    <Label className="text-gray-500 font-bold uppercase tracking-widest text-[8px]">Prénom</Label>
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
                    <Label className="text-gray-500 font-bold uppercase tracking-widest text-[8px]">Téléphone</Label>
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
                    <Label className="text-gray-500 font-bold uppercase tracking-widest text-[8px]">Âge</Label>
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
                        <SelectValue placeholder="Sélectionner" />
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
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-orange-500">Documents d'identité</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-gray-500 font-bold uppercase tracking-widest text-[8px]">Type de pièce d'identité</Label>
                    <Select 
                      value={agentForm.id_type} 
                      onValueChange={(val: any) => setAgentForm({...agentForm, id_type: val})}
                    >
                      <SelectTrigger className="bg-black border-white/10 h-12 rounded-xl text-sm">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10 text-white">
                        <SelectItem value="passport">Passeport</SelectItem>
                        <SelectItem value="national_id">Carte Nationale d'Identité (CNI)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-gray-500 font-bold uppercase tracking-widest text-[8px]">Photo de la pièce d'identité</Label>
                    <div 
                      className="relative h-12 bg-black border border-white/10 rounded-xl flex items-center px-4 cursor-pointer hover:bg-white/5 transition-colors group"
                      onClick={() => idInputRef.current?.click()}
                    >
                      <Upload className="mr-2 text-zinc-500" size={14} />
                      <span className="text-xs text-zinc-400 truncate">
                        {idFile ? idFile.name : idPreview ? "Pièce d'identité téléchargée" : "Télécharger un fichier..."}
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
                {isSubmitting ? "Traitement..." : editingAgent ? "Mettre à jour" : "Créer le profil"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;