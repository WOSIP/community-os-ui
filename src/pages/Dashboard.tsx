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
  AlertTriangle,
  Save,
  Info,
  Target,
  UserCheck,
  ClipboardList
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
import { 
  supabase, 
  searchCandidates, 
  updateCandidateStatus, 
  updateCandidateInfo 
} from "@/lib/supabase";

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
  admin_notes?: string;
  updated_at: string;
  // Registrant Info (from join)
  registrant?: {
    email: string;
  };
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
  const [canUpdate, setCanUpdate] = useState(false);
  
  // Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<'all' | 'id' | 'email' | 'businessName' | 'name' | 'registrantEmail'>('all');
  
  // Agent Dialog State
  const [isAgentDialogOpen, setIsAgentDialogOpen] = useState(false);
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
      toast.error("Acc\u00e8s non autoris\u00e9. Veuillez vous connecter.");
      navigate("/");
      return;
    }

    if (userRole === "super_admin") {
      setIsSuperAdmin(true);
      setCanUpdate(true);
    } else if (userRole === "admin") {
      setCanUpdate(true);
    }

    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Applications with registrant join
      const { data: apps, error: appsError } = await supabase
        .from('applications')
        .select(`
          *,
          registrant:profiles!registrant_id(email)
        `)
        .order('created_at', { ascending: false });
      
      if (appsError) {
        // Fallback if join fails (might happen if migration not applied yet)
        const { data: fallbackApps, error: fallbackError } = await supabase
          .from('applications')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (fallbackError) throw fallbackError;
        setApplications(fallbackApps || []);
      } else {
        setApplications(apps || []);
      }

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

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!searchTerm) {
      fetchData();
      return;
    }

    setLoading(true);
    try {
      // Map frontend search type to edge function search type
      let edgeSearchType: any = searchType;
      if (searchType === 'registrantEmail') edgeSearchType = 'email';
      
      const results = await searchCandidates(searchTerm, edgeSearchType);
      setApplications(results || []);
    } catch (error: any) {
      toast.error("Erreur lors de la recherche: " + error.message);
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
      case "exclusive": 
      case "attributed exclusive": return "text-orange-500 bg-orange-500/10 border-orange-500/20";
      case "accepted": 
      case "active": return "text-green-500 bg-green-500/10 border-green-500/20";
      case "non_exclusive":
      case "attributed non exclusive": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "rejected": return "text-red-500 bg-red-500/10 border-red-500/20";
      case "disabled": 
      case "disable": return "text-zinc-400 bg-zinc-900 border-zinc-800";
      case "pending": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      default: return "text-zinc-500 bg-zinc-500/10 border-zinc-500/20";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending": return "En attente";
      case "accepted": return "Accept\u00e9";
      case "active": return "Activ\u00e9";
      case "exclusive": 
      case "attributed exclusive": return "Attribu\u00e9 Exclusif";
      case "non_exclusive": 
      case "attributed non exclusive": return "Attribu\u00e9 Non-Exclusif";
      case "rejected": return "Rejet\u00e9";
      case "disabled":
      case "disable": return "D\u00e9sactiv\u00e9";
      default: return status.replace("_", " ");
    }
  };

  const openCreateAgentDialog = () => {
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
    setIsAgentDialogOpen(true);
  };

  const openEditAgentDialog = (agent: Agent) => {
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
    setIsAgentDialogOpen(true);
  };

  const openAppDialog = (app: Application) => {
    setSelectedApp(app);
    setAppForm({ ...app });
    setIsAppDialogOpen(true);
  };

  const handleAppStatusChange = async (newStatus: string) => {
    if (!selectedApp || !canUpdate) return;
    
    setIsSubmitting(true);
    try {
      await updateCandidateStatus(selectedApp.id, newStatus);
      toast.success("Statut mis \u00e0 jour");
      // Update local state
      setApplications(prev => prev.map(a => a.id === selectedApp.id ? { ...a, status: newStatus } : a));
      setSelectedApp(prev => prev ? { ...prev, status: newStatus } : null);
      setAppForm(prev => ({ ...prev, status: newStatus }));
    } catch (error: any) {
      toast.error("Erreur: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAppInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp || !canUpdate) return;

    setIsSubmitting(true);
    try {
      // Remove fields that shouldn't be updated via info action
      const { id, candidate_id, created_at, updated_at, status, registrant, ...updateData } = appForm as any;
      
      await updateCandidateInfo(selectedApp.id, updateData);
      toast.success("Informations mises \u00e0 jour");
      setIsAppDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error("Erreur: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAgentFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'id') => {
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
        passport_id: null,
        national_id: null
      };

      const { error } = await supabase.functions.invoke('manage-admins', {
        body: payload
      });

      if (error) throw error;

      toast.success(editingAgent ? "Agent modifi\u00e9 avec succ\u00e8s" : "Agent cr\u00e9\u00e9 avec succ\u00e8s");
      setIsAgentDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAgentStatus = async (agent: Agent) => {
    if (!isSuperAdmin) return;

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
    <div className="min-h-screen bg-black text-white p-6 md:p-10 pt-24 font-sans">
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
              className="border-white/10 text-white hover:bg-white/5 h-10 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all" 
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
            { label: "Approuv\u00e9es", value: applications.filter(a => ['accepted', 'active', 'exclusive', 'non_exclusive', 'attributed exclusive', 'attributed non exclusive'].includes(a.status)).length.toString(), icon: CheckCircle, color: "text-green-500" },
            { label: "En attente", value: applications.filter(a => a.status === 'pending').length.toString(), icon: Clock, color: "text-orange-500" },
            { label: "Agents", value: agents.length.toString(), icon: Users, color: "text-purple-500" }
          ].map((stat, i) => (
            <Card key={i} className="bg-zinc-950 border-white/5 rounded-2xl overflow-hidden shadow-xl hover:border-white/10 transition-colors">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold tracking-tighter">{loading ? "..." : stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-zinc-900 ${stat.color} shadow-inner`}>
                    <stat.icon size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="applications" className="w-full" onValueChange={setActiveTab}>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <TabsList className="bg-zinc-950 border border-white/5 p-1 rounded-xl h-11">
              <TabsTrigger value="applications" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-lg px-6 text-[10px] font-bold uppercase tracking-widest transition-all">
                Candidatures
              </TabsTrigger>
              <TabsTrigger value="agents" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-lg px-6 text-[10px] font-bold uppercase tracking-widest transition-all">
                Gestion Agents
              </TabsTrigger>
            </TabsList>

            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <form onSubmit={handleSearch} className="flex gap-2 flex-grow lg:flex-grow-0">
                <div className="relative flex-grow min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                  <Input 
                    placeholder="Rechercher..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-zinc-950 border-white/5 h-11 rounded-xl w-full text-sm focus:ring-orange-500" 
                  />
                </div>
                <Select value={searchType} onValueChange={(val: any) => setSearchType(val)}>
                  <SelectTrigger className="w-[180px] bg-zinc-950 border-white/5 h-11 rounded-xl text-[10px] font-bold uppercase">
                    <SelectValue placeholder="Type de recherche" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/10 text-white">
                    <SelectItem value="all">Tous les champs</SelectItem>
                    <SelectItem value="id">ID Syst\u00e8me (CAND-XX)</SelectItem>
                    <SelectItem value="email">Email du Candidat</SelectItem>
                    <SelectItem value="registrantEmail">Email de l'Enregistreur</SelectItem>
                    <SelectItem value="businessName">Nom de l'Entreprise</SelectItem>
                    <SelectItem value="name">Nom du Candidat</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600 h-11 px-4 rounded-xl text-[10px] font-bold uppercase">
                  Rechercher
                </Button>
              </form>
              <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 h-11 px-4 rounded-xl shrink-0" onClick={fetchData}>
                <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
              </Button>
            </div>
          </div>

          <TabsContent value="applications" className="focus-visible:outline-none">
            <Card className="bg-zinc-950 border-white/5 rounded-2xl overflow-hidden shadow-xl">
              <CardHeader className="border-b border-white/5 p-6 flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-lg font-bold uppercase tracking-tight">Liste des Candidatures</CardTitle>
                  <CardDescription className="text-zinc-500 text-xs mt-1 font-medium">G\u00e9rez les dossiers par ID, email ou nom d'entreprise.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader className="bg-zinc-900/50">
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest p-4 whitespace-nowrap">ID Dossier</TableHead>
                      <TableHead className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest p-4 whitespace-nowrap">Candidat / Entreprise</TableHead>
                      <TableHead className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest p-4 whitespace-nowrap">Territoire</TableHead>
                      <TableHead className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest p-4 whitespace-nowrap">Enregistr\u00e9 par</TableHead>
                      <TableHead className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest p-4 whitespace-nowrap">Status</TableHead>
                      <TableHead className="text-right text-zinc-500 text-[10px] font-bold uppercase tracking-widest p-4 whitespace-nowrap">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow><TableCell colSpan={6} className="text-center p-12">
                        <RefreshCcw size={24} className="animate-spin text-orange-500 mx-auto mb-2" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Chargement...</span>
                      </TableCell></TableRow>
                    ) : applications.length === 0 ? (
                      <TableRow><TableCell colSpan={6} className="text-center p-12 text-zinc-500">
                        <FileSearch size={32} className="text-zinc-800 mx-auto mb-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Aucun r\u00e9sultat trouv\u00e9</span>
                      </TableCell></TableRow>
                    ) : applications.map((app) => (
                      <TableRow key={app.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                        <TableCell className="p-4">
                          <div className="font-mono text-[10px] font-bold text-orange-500 bg-orange-500/10 px-2 py-1 rounded w-fit uppercase border border-orange-500/20">
                            {app.candidate_id || 'Generating...'}
                          </div>
                        </TableCell>
                        <TableCell className="p-4">
                          <div className="font-bold text-sm">{app.first_name} {app.last_name}</div>
                          <div className="text-[10px] text-zinc-500 mb-1">{app.email}</div>
                          {app.business_name && (
                            <div className="text-[9px] text-orange-500/70 font-bold uppercase flex items-center gap-1">
                              <Building size={8} /> {app.business_name}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="p-4">
                          <div className="font-bold text-sm uppercase tracking-tight flex items-center gap-1.5">
                            <Globe size={12} className="text-zinc-600" />
                            {app.country}
                          </div>
                        </TableCell>
                        <TableCell className="p-4 text-zinc-400 text-[10px] font-medium">
                          {app.registrant?.email ? (
                            <div className="flex items-center gap-1.5">
                              <UserCheck size={12} className="text-orange-500/70" />
                              {app.registrant.email}
                            </div>
                          ) : (
                            <span className="text-zinc-600">Portail Public</span>
                          )}
                        </TableCell>
                        <TableCell className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest border ${getStatusColor(app.status)}`}>
                            {getStatusLabel(app.status)}
                          </span>
                        </TableCell>
                        <TableCell className="p-4 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-zinc-500 hover:text-orange-500 hover:bg-orange-500/10 rounded-lg h-8 w-8"
                              onClick={() => openAppDialog(app)}
                            >
                              <Edit2 size={14} />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white hover:bg-white/10 rounded-lg h-8 w-8">
                                  <MoreHorizontal size={14} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-zinc-900 border-white/10 text-white w-60 rounded-xl overflow-hidden p-1 shadow-2xl">
                                <DropdownMenuItem 
                                  className="text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-white/5 rounded-lg py-2.5"
                                  onClick={() => openAppDialog(app)}
                                >
                                  <FileSearch className="mr-2" size={12} /> Voir & \u00c9diter Infos
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-white/5" />
                                <div className="px-2 py-1.5 text-[8px] font-bold uppercase tracking-widest text-zinc-500">Changer le Statut</div>
                                {[
                                  { label: 'Attribu\u00e9 Exclusif', val: 'attributed exclusive', icon: Award },
                                  { label: 'Attribu\u00e9 Non-Exclusif', val: 'attributed non exclusive', icon: Globe },
                                  { label: 'Rejet\u00e9', val: 'rejected', icon: XCircle },
                                  { label: 'D\u00e9sactiver', val: 'disable', icon: Power },
                                  { label: 'En attente', val: 'pending', icon: Clock },
                                  { label: 'Activ\u00e9', val: 'active', icon: CheckCircle },
                                ].map((s) => (
                                  <DropdownMenuItem 
                                    key={s.val}
                                    className={`text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-white/5 rounded-lg py-2.5 ${app.status === s.val ? 'bg-white/5 text-orange-500' : ''}`}
                                    onClick={() => handleAppStatusChange(s.val)}
                                  >
                                    <s.icon className="mr-2" size={12} /> {s.label}
                                    {app.status === s.val && <Check size={12} className="ml-auto" />}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agents" className="focus-visible:outline-none">
            <Card className="bg-zinc-950 border-white/5 rounded-2xl overflow-hidden shadow-xl">
              <CardHeader className="border-b border-white/5 p-6 flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-lg font-bold uppercase tracking-tight">Gestion des Acc\u00e8s</CardTitle>
                  <CardDescription className="text-zinc-500 text-xs mt-1 font-medium">G\u00e9rez les comptes administrateurs et leurs permissions.</CardDescription>
                </div>
                {isSuperAdmin && (
                  <Button 
                    className="bg-orange-500 hover:bg-orange-600 h-10 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-orange-500/20"
                    onClick={openCreateAgentDialog}
                  >
                    <UserPlus className="mr-2" size={14} /> Nouvel Agent
                  </Button>
                )}
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader className="bg-zinc-900/50">
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest p-4 whitespace-nowrap">ID Agent</TableHead>
                      <TableHead className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest p-4 whitespace-nowrap">Utilisateur</TableHead>
                      <TableHead className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest p-4 whitespace-nowrap">R\u00f4le</TableHead>
                      <TableHead className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest p-4 whitespace-nowrap">Status</TableHead>
                      <TableHead className="text-right text-zinc-500 text-[10px] font-bold uppercase tracking-widest p-4 whitespace-nowrap">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow><TableCell colSpan={5} className="text-center p-12">
                        <RefreshCcw size={24} className="animate-spin text-orange-500 mx-auto" />
                      </TableCell></TableRow>
                    ) : agents.length === 0 ? (
                      <TableRow><TableCell colSpan={5} className="text-center p-12 text-zinc-500 font-bold uppercase text-[10px]">Aucun agent trouv\u00e9.</TableCell></TableRow>
                    ) : agents.map((agent) => (
                      <TableRow key={agent.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                        <TableCell className="p-4">
                          <div className="font-mono text-[10px] font-bold text-orange-500 bg-orange-500/10 px-2 py-1 rounded w-fit uppercase border border-orange-500/20">
                            {agent.agent_id || 'Generating...'}
                          </div>
                        </TableCell>
                        <TableCell className="p-4">
                          <div className="flex items-center gap-3">
                            {agent.profile_picture_url ? (
                              <img src={agent.profile_picture_url} className="w-8 h-8 rounded-full border border-white/10 object-cover" alt="" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center border border-white/10 shadow-inner">
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
                          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                            {agent.role.replace("_", " ")}
                          </span>
                        </TableCell>
                        <TableCell className="p-4">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${agent.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
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
                                onClick={() => openEditAgentDialog(agent)}
                              >
                                <Edit2 className="mr-2" size={12} /> Modifier
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-white/5" />
                              <DropdownMenuItem 
                                className="text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-white/5 rounded-lg py-2.5"
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

      {/* Application Detail Dialog */}
      <Dialog open={isAppDialogOpen} onOpenChange={setIsAppDialogOpen}>
        <DialogContent className="bg-zinc-950 border-white/10 text-white max-w-5xl rounded-[2rem] p-8 max-h-[90vh] overflow-y-auto shadow-2xl scrollbar-hide">
          <DialogHeader className="flex flex-row justify-between items-start space-y-0 pb-6 border-b border-white/5">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="font-mono text-[10px] font-bold text-orange-500 bg-orange-500/10 px-2 py-1 rounded w-fit uppercase border border-orange-500/20">
                  {selectedApp?.candidate_id}
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest border ${selectedApp ? getStatusColor(selectedApp.status) : ''}`}>
                  {getStatusLabel(selectedApp?.status || '')}
                </span>
              </div>
              <DialogTitle className="text-2xl font-bold uppercase tracking-tight">
                Dossier: {selectedApp?.first_name} {selectedApp?.last_name}
              </DialogTitle>
              <DialogDescription className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                Soumis le {selectedApp && new Date(selectedApp.created_at).toLocaleDateString('fr-FR')}
              </DialogDescription>
            </div>
            {canUpdate && (
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="bg-orange-500 hover:bg-orange-600 h-10 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg">
                      Modifier Statut <MoreHorizontal className="ml-2" size={14} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-zinc-900 border-white/10 text-white w-60 rounded-xl overflow-hidden p-1 shadow-2xl">
                    <DropdownMenuItem onClick={() => handleAppStatusChange('attributed exclusive')} className="text-orange-500 text-[10px] font-bold uppercase py-2.5 cursor-pointer">
                      <Award className="mr-2" size={12} /> Attribu\u00e9 Exclusif
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAppStatusChange('attributed non exclusive')} className="text-blue-500 text-[10px] font-bold uppercase py-2.5 cursor-pointer">
                      <Globe className="mr-2" size={12} /> Attribu\u00e9 Non-Exclusif
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAppStatusChange('rejected')} className="text-red-400 text-[10px] font-bold uppercase py-2.5 cursor-pointer">
                      <XCircle className="mr-2" size={12} /> Rejet\u00e9
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAppStatusChange('disable')} className="text-zinc-500 text-[10px] font-bold uppercase py-2.5 cursor-pointer">
                      <Power className="mr-2" size={12} /> D\u00e9sactiv\u00e9
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/5" />
                    <DropdownMenuItem onClick={() => handleAppStatusChange('pending')} className="text-yellow-500 text-[10px] font-bold uppercase py-2.5 cursor-pointer">
                      <Clock className="mr-2" size={12} /> En attente
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAppStatusChange('active')} className="text-green-500 text-[10px] font-bold uppercase py-2.5 cursor-pointer">
                      <CheckCircle className="mr-2" size={12} /> Activ\u00e9
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </DialogHeader>

          <form onSubmit={handleAppInfoSubmit} className="mt-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Personal Info */}
              <div className="space-y-4 p-5 bg-zinc-900/20 rounded-2xl border border-white/5">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500 flex items-center gap-2 mb-4">
                  <User size={14} /> Informations Personnelles
                </h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <Label className="text-[8px] font-bold uppercase text-zinc-500 tracking-widest">Pr\u00e9nom</Label>
                      <Input 
                        value={appForm.first_name || ""} 
                        onChange={e => setAppForm({...appForm, first_name: e.target.value})}
                        className="bg-black border-white/5 h-10 rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[8px] font-bold uppercase text-zinc-500 tracking-widest">Nom</Label>
                      <Input 
                        value={appForm.last_name || ""} 
                        onChange={e => setAppForm({...appForm, last_name: e.target.value})}
                        className="bg-black border-white/5 h-10 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[8px] font-bold uppercase text-zinc-500 tracking-widest">Date de Naissance</Label>
                    <Input 
                      type="date"
                      value={appForm.birth_date || ""} 
                      onChange={e => setAppForm({...appForm, birth_date: e.target.value})}
                      className="bg-black border-white/5 h-10 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[8px] font-bold uppercase text-zinc-500 tracking-widest">Email</Label>
                    <Input 
                      value={appForm.email || ""} 
                      onChange={e => setAppForm({...appForm, email: e.target.value})}
                      className="bg-black border-white/5 h-10 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[8px] font-bold uppercase text-zinc-500 tracking-widest">T\u00e9l\u00e9phone</Label>
                    <Input 
                      value={appForm.phone || ""} 
                      onChange={e => setAppForm({...appForm, phone: e.target.value})}
                      className="bg-black border-white/5 h-10 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[8px] font-bold uppercase text-zinc-500 tracking-widest">Nationalit\u00e9</Label>
                    <Input 
                      value={appForm.nationality || ""} 
                      onChange={e => setAppForm({...appForm, nationality: e.target.value})}
                      className="bg-black border-white/5 h-10 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[8px] font-bold uppercase text-zinc-500 tracking-widest">Adresse</Label>
                    <Input 
                      value={appForm.address || ""} 
                      onChange={e => setAppForm({...appForm, address: e.target.value})}
                      className="bg-black border-white/5 h-10 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Business Info */}
              <div className="space-y-4 p-5 bg-zinc-900/20 rounded-2xl border border-white/5">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500 flex items-center gap-2 mb-4">
                  <Building size={14} /> Structure Entreprise
                </h3>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-[8px] font-bold uppercase text-zinc-500 tracking-widest">Nom de l'entreprise</Label>
                    <Input 
                      value={appForm.business_name || ""} 
                      onChange={e => setAppForm({...appForm, business_name: e.target.value})}
                      className="bg-black border-white/5 h-10 rounded-lg text-xs font-bold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <Label className="text-[8px] font-bold uppercase text-zinc-500 tracking-widest">Statut Juridique</Label>
                      <Input 
                        value={appForm.business_status || ""} 
                        onChange={e => setAppForm({...appForm, business_status: e.target.value})}
                        className="bg-black border-white/5 h-10 rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[8px] font-bold uppercase text-zinc-500 tracking-widest">Ann\u00e9e Cr\u00e9ation</Label>
                      <Input 
                        type="number"
                        value={appForm.business_year || ""} 
                        onChange={e => setAppForm({...appForm, business_year: parseInt(e.target.value) || 0})}
                        className="bg-black border-white/5 h-10 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[8px] font-bold uppercase text-zinc-500 tracking-widest">Secteur</Label>
                    <Input 
                      value={appForm.business_sector || ""} 
                      onChange={e => setAppForm({...appForm, business_sector: e.target.value})}
                      className="bg-black border-white/5 h-10 rounded-lg text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <Label className="text-[8px] font-bold uppercase text-zinc-500 tracking-widest">Employ\u00e9s</Label>
                      <Input 
                        type="number"
                        value={appForm.business_employees || ""} 
                        onChange={e => setAppForm({...appForm, business_employees: parseInt(e.target.value) || 0})}
                        className="bg-black border-white/5 h-10 rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[8px] font-bold uppercase text-zinc-500 tracking-widest">CA Annuel</Label>
                      <Input 
                        value={appForm.business_ca || ""} 
                        onChange={e => setAppForm({...appForm, business_ca: e.target.value})}
                        className="bg-black border-white/5 h-10 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[8px] font-bold uppercase text-zinc-500 tracking-widest">Pays Enregistrement</Label>
                    <Input 
                      value={appForm.business_country || ""} 
                      onChange={e => setAppForm({...appForm, business_country: e.target.value})}
                      className="bg-black border-white/5 h-10 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Territories & Finance */}
              <div className="space-y-4 p-5 bg-zinc-900/20 rounded-2xl border border-white/5">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500 flex items-center gap-2 mb-4">
                  <Target size={14} /> Territoire & Finance
                </h3>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-[8px] font-bold uppercase text-zinc-500 tracking-widest">Territoire Vis\u00e9</Label>
                    <div className="p-3 bg-black border border-white/5 rounded-lg font-bold text-sm uppercase tracking-tight text-orange-500">
                      {selectedApp?.country}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[8px] font-bold uppercase text-zinc-500 tracking-widest">Exp\u00e9rience (ans)</Label>
                    <Input 
                      type="number"
                      value={appForm.experience_years || ""} 
                      onChange={e => setAppForm({...appForm, experience_years: parseInt(e.target.value) || 0})}
                      className="bg-black border-white/5 h-10 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[8px] font-bold uppercase text-zinc-500 tracking-widest">Budget Global</Label>
                    <Input 
                      value={appForm.budget || ""} 
                      onChange={e => setAppForm({...appForm, budget: e.target.value})}
                      className="bg-black border-white/5 h-10 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[8px] font-bold uppercase text-zinc-500 tracking-widest">Acompte Disponible</Label>
                    <Input 
                      value={appForm.deposit_amount || ""} 
                      onChange={e => setAppForm({...appForm, deposit_amount: e.target.value})}
                      className="bg-black border-white/5 h-10 rounded-lg text-xs"
                    />
                  </div>
                  {appForm.cv_url && (
                    <div className="pt-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full border-zinc-800 text-zinc-400 hover:text-white h-10 text-[9px] font-bold uppercase"
                        onClick={() => window.open(appForm.cv_url, '_blank')}
                      >
                        <FileSearch className="mr-2" size={12} /> Voir CV (PDF)
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Full Width Notes & Missing Information */}
              <div className="col-span-full space-y-6 pt-6 border-t border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="text-[9px] font-bold uppercase text-orange-500 tracking-widest flex items-center gap-2">
                      <ClipboardList size={12} /> Notes Administrateur & Infos Manquantes
                    </Label>
                    <Textarea 
                      value={appForm.admin_notes || ""} 
                      onChange={e => setAppForm({...appForm, admin_notes: e.target.value})}
                      className="bg-zinc-900/50 border-white/5 min-h-[120px] rounded-xl text-xs resize-none p-4 placeholder:text-zinc-700"
                      placeholder="Ajoutez ici les informations manquantes ou des notes internes sur ce dossier..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[9px] font-bold uppercase text-zinc-500 tracking-widest flex items-center gap-2">
                      <Info size={12} /> Motivation du Candidat
                    </Label>
                    <Textarea 
                      value={appForm.motivation || ""} 
                      onChange={e => setAppForm({...appForm, motivation: e.target.value})}
                      className="bg-zinc-900/50 border-white/5 min-h-[120px] rounded-xl text-xs resize-none p-4"
                    />
                  </div>
                </div>
                
                {selectedApp?.registrant?.email && (
                  <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-500/10 rounded-lg">
                        <UserCheck size={16} className="text-orange-500" />
                      </div>
                      <div>
                        <p className="text-[8px] font-bold uppercase text-zinc-500 tracking-widest mb-0.5">Enregistr\u00e9 par l'Agent</p>
                        <p className="text-xs font-bold">{selectedApp.registrant.email}</p>
                      </div>
                    </div>
                    <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-600 italic">Origine: Interne</span>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="flex gap-3 sm:gap-0 mt-8 pt-8 border-t border-white/5">
              <Button 
                type="button" 
                variant="ghost" 
                className="flex-1 text-zinc-500 hover:text-white hover:bg-white/5 h-12 rounded-xl text-[10px] font-bold uppercase tracking-widest"
                onClick={() => setIsAppDialogOpen(false)}
              >
                Fermer sans enregistrer
              </Button>
              {canUpdate && (
                <Button 
                  type="submit" 
                  className="flex-1 bg-orange-500 hover:bg-orange-600 h-12 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-orange-500/20"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <RefreshCcw className="animate-spin mr-2" size={14} /> : <Save className="mr-2" size={14} />}
                  Enregistrer les modifications
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Agent Dialog (Existing) */}
      <Dialog open={isAgentDialogOpen} onOpenChange={setIsAgentDialogOpen}>
        <DialogContent className="bg-zinc-950 border-white/10 text-white max-w-2xl rounded-[2rem] p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold uppercase tracking-tight">
              {editingAgent ? "Modifier l'Agent" : "Nouvel Agent"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAgentSubmit} className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-full flex flex-col items-center justify-center space-y-4 pb-4 border-b border-white/5">
                <div 
                  className="relative w-24 h-24 rounded-full bg-zinc-900 border-2 border-dashed border-white/10 flex items-center justify-center cursor-pointer hover:border-orange-500/50 transition-colors overflow-hidden group shadow-inner"
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
                  onChange={(e) => handleAgentFileChange(e, 'profile')} 
                />
                <p className="text-zinc-500 text-[8px] font-bold uppercase tracking-widest">Cliquez pour changer la photo de profil</p>
              </div>

              <div className="space-y-4 col-span-full pb-4 border-b border-white/5">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-orange-500 flex items-center gap-2">
                  <ShieldCheck size={14} /> Identifiants d'acc\u00e8s
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-gray-500 font-bold uppercase tracking-widest text-[8px]">Email Professionnel</Label>
                    <div className="relative">
                      <Input 
                        value={agentForm.email}
                        onChange={(e) => setAgentForm({...agentForm, email: e.target.value})}
                        placeholder="admin@helloopass.net"
                        className="bg-black border-white/10 h-12 rounded-xl text-sm pl-10 focus:ring-orange-500"
                        required
                        disabled={!!editingAgent}
                      />
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                    </div>
                  </div>
                  {!editingAgent && (
                    <div className="space-y-1.5">
                      <Label className="text-gray-500 font-bold uppercase tracking-widest text-[8px]">Mot de passe temporaire</Label>
                      <Input 
                        type="password"
                        value={agentForm.password}
                        onChange={(e) => setAgentForm({...agentForm, password: e.target.value})}
                        className="bg-black border-white/10 h-12 rounded-xl text-sm focus:ring-orange-500"
                        required
                      />
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <Label className="text-gray-500 font-bold uppercase tracking-widest text-[8px]">R\u00f4le Syst\u00e8me</Label>
                    <Select value={agentForm.role} onValueChange={(val: any) => setAgentForm({...agentForm, role: val})}>
                      <SelectTrigger className="bg-black border-white/10 h-12 rounded-xl text-sm focus:ring-orange-500">
                        <SelectValue placeholder="S\u00e9lectionner" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10 text-white">
                        <SelectItem value="read_only">Read-only</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4 col-span-full pb-4 border-b border-white/5">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-orange-500 flex items-center gap-2">
                  <User size={14} /> Profil Personnel
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-gray-500 font-bold uppercase tracking-widest text-[8px]">Pr\u00e9nom</Label>
                    <Input 
                      value={agentForm.first_name}
                      onChange={(e) => setAgentForm({...agentForm, first_name: e.target.value})}
                      className="bg-black border-white/10 h-12 rounded-xl text-sm focus:ring-orange-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gray-500 font-bold uppercase tracking-widest text-[8px]">Nom</Label>
                    <Input 
                      value={agentForm.last_name}
                      onChange={(e) => setAgentForm({...agentForm, last_name: e.target.value})}
                      className="bg-black border-white/10 h-12 rounded-xl text-sm focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 col-span-full">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-orange-500 flex items-center gap-2">
                  <FileText size={14} /> Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-gray-500 font-bold uppercase tracking-widest text-[8px]">Type de pi\u00e8ce</Label>
                    <Select value={agentForm.id_type} onValueChange={(val: any) => setAgentForm({...agentForm, id_type: val})}>
                      <SelectTrigger className="bg-black border-white/10 h-12 rounded-xl text-sm focus:ring-orange-500">
                        <SelectValue placeholder="S\u00e9lectionner" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10 text-white">
                        <SelectItem value="passport">Passeport</SelectItem>
                        <SelectItem value="national_id">CNI</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gray-500 font-bold uppercase tracking-widest text-[8px]">Photo Pi\u00e8ce</Label>
                    <div 
                      className="relative h-12 bg-black border border-white/10 rounded-xl flex items-center px-4 cursor-pointer hover:bg-white/5 transition-colors shadow-inner"
                      onClick={() => idInputRef.current?.click()}
                    >
                      <Upload className="mr-2 text-zinc-500" size={14} />
                      <span className="text-xs text-zinc-400 truncate">
                        {idFile ? idFile.name : "T\u00e9l\u00e9charger..."}
                      </span>
                    </div>
                    <input 
                      type="file" 
                      ref={idInputRef} 
                      className="hidden" 
                      accept="image/*,application/pdf" 
                      onChange={(e) => handleAgentFileChange(e, 'id')} 
                    />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="flex gap-3 sm:gap-0 mt-8">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1 border-white/10 text-white h-12 rounded-xl text-[10px] font-bold uppercase transition-all"
                onClick={() => setIsAgentDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-orange-500 hover:bg-orange-600 h-12 rounded-xl text-[10px] font-bold uppercase shadow-lg shadow-orange-500/20 transition-all"
                disabled={isSubmitting}
              >
                {isSubmitting && <RefreshCcw className="animate-spin mr-2" size={14} />}
                {editingAgent ? "Mettre \u00e0 jour" : "Cr\u00e9er Profil"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;