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
  Target
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
import { useTranslation } from "react-i18next";
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
  updated_at: string;
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
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("applications");
  const [applications, setApplications] = useState<Application[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [canUpdate, setCanUpdate] = useState(false);
  
  // Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<'all' | 'id' | 'email' | 'businessName' | 'name'>('all');
  
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
      toast.error(t("admin.unauthorized"));
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
  }, [navigate, t]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: apps, error: appsError } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (appsError) throw appsError;
      setApplications(apps || []);

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
      const results = await searchCandidates(searchTerm, searchType);
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
    toast.success(t("dashboard.logout"));
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
      case "disabled": 
      case "disable": return "text-zinc-400 bg-zinc-900 border-zinc-800";
      case "pending": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      default: return "text-zinc-500 bg-zinc-500/10 border-zinc-500/20";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending": return t("dashboard.status.pending");
      case "accepted": return t("dashboard.status.accepted");
      case "active": return t("dashboard.status.active");
      case "exclusive": return t("dashboard.status.exclusive");
      case "non_exclusive": return t("dashboard.status.non_exclusive");
      case "rejected": return t("dashboard.status.rejected");
      case "disabled": return t("dashboard.status.disabled");
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
      toast.success("Statut mis à jour");
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
      const { id, candidate_id, created_at, updated_at, status, ...updateData } = appForm as any;
      await updateCandidateInfo(selectedApp.id, updateData);
      toast.success("Informations mises à jour");
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
    const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file);
    if (uploadError) throw new Error(`Erreur lors de l'upload du fichier ${file.name}`);
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath);
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
      if (profileFile) profileUrl = await uploadFile(profileFile, 'agent-assets');
      if (idFile) idUrl = await uploadFile(idFile, 'agent-assets');
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
      const { error } = await supabase.functions.invoke('manage-admins', { body: payload });
      if (error) throw error;
      toast.success(editingAgent ? "Agent modifié avec succès" : "Agent créé avec succès");
      setIsAgentDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAgentStatus = async (agent: Agent) => {
    if (!isSuperAdmin) {
      toast.error("Action réservée aux Super Admins.");
      return;
    }
    try {
      const { error } = await supabase.functions.invoke('manage-admins', {
        body: { action: 'toggle_status', id: agent.id, is_active: !agent.is_active }
      });
      if (error) throw error;
      toast.success(t("dashboard.agents.success_status"));
      fetchData();
    } catch (error: any) {
      toast.error(`Erreur: ${error.message}`);
    }
  };

  const changeAgentRole = async (agent: Agent, newRole: Agent['role']) => {
    if (!isSuperAdmin) return;
    try {
      const { error } = await supabase.functions.invoke('manage-admins', {
        body: { action: 'update', id: agent.id, role: newRole, is_active: agent.is_active }
      });
      if (error) throw error;
      toast.success(t("dashboard.agents.success_role"));
      fetchData();
    } catch (error: any) {
      toast.error(`Erreur: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10 pt-24 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className={isSuperAdmin ? "text-orange-500" : "text-blue-500"} size={16} />
              <span className={`${isSuperAdmin ? "text-orange-500" : "text-blue-500"} font-bold uppercase tracking-widest text-[10px]`}>
                {isSuperAdmin ? t("dashboard.role.super") : t("dashboard.role.admin")}
              </span>
            </div>
            <h1 className="text-3xl font-bold uppercase tracking-tight">{t("dashboard.title")}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="border-white/10 text-white hover:bg-white/5 h-10 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all" 
              onClick={handleLogout}
            >
              <LogOut className="mr-2" size={14} /> {t("dashboard.logout")}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: t("dashboard.stats.applications"), value: applications.length.toString(), icon: FileText, color: "text-blue-500" },
            { label: t("dashboard.stats.approved"), value: applications.filter(a => ['accepted', 'active', 'exclusive', 'non_exclusive'].includes(a.status)).length.toString(), icon: CheckCircle, color: "text-green-500" },
            { label: t("dashboard.stats.pending"), value: applications.filter(a => a.status === 'pending').length.toString(), icon: Clock, color: "text-orange-500" },
            { label: t("dashboard.stats.agents"), value: agents.length.toString(), icon: Users, color: "text-purple-500" }
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

        <Tabs defaultValue="applications" className="w-full" onValueChange={setActiveTab}>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <TabsList className="bg-zinc-950 border border-white/5 p-1 rounded-xl h-11">
              <TabsTrigger value="applications" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-lg px-6 text-[10px] font-bold uppercase tracking-widest transition-all">
                {t("dashboard.tabs.applications")}
              </TabsTrigger>
              <TabsTrigger value="agents" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-lg px-6 text-[10px] font-bold uppercase tracking-widest transition-all">
                {t("dashboard.tabs.agents")}
              </TabsTrigger>
            </TabsList>

            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <form onSubmit={handleSearch} className="flex gap-2 flex-grow lg:flex-grow-0">
                <div className="relative flex-grow min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                  <Input 
                    placeholder={t("dashboard.search.placeholder")} 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-zinc-950 border-white/5 h-11 rounded-xl w-full text-sm focus:ring-orange-500" 
                  />
                </div>
                <Select value={searchType} onValueChange={(val: any) => setSearchType(val)}>
                  <SelectTrigger className="w-[140px] bg-zinc-950 border-white/5 h-11 rounded-xl text-[10px] font-bold uppercase">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/10 text-white">
                    <SelectItem value="all">{t("dashboard.search.all")}</SelectItem>
                    <SelectItem value="id">{t("dashboard.search.id")}</SelectItem>
                    <SelectItem value="email">{t("dashboard.search.email")}</SelectItem>
                    <SelectItem value="businessName">{t("dashboard.search.business")}</SelectItem>
                    <SelectItem value="name">{t("dashboard.search.name")}</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600 h-11 px-4 rounded-xl text-[10px] font-bold uppercase">
                  {t("dashboard.search.button")}
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
                  <CardTitle className="text-lg font-bold uppercase tracking-tight">{t("dashboard.table.list_title")}</CardTitle>
                  <CardDescription className="text-zinc-500 text-xs mt-1 font-medium">{t("dashboard.table.list_desc")}</CardDescription>
                </div>
                <Button className="bg-zinc-900 border border-white/10 text-white hover:bg-zinc-800 h-10 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                  {t("dashboard.table.export")}
                </Button>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader className="bg-zinc-900/50">
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest p-4 whitespace-nowrap">{t("dashboard.table.id")}</TableHead>
                      <TableHead className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest p-4 whitespace-nowrap">{t("dashboard.table.candidate")}</TableHead>
                      <TableHead className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest p-4 whitespace-nowrap">{t("dashboard.table.territory")}</TableHead>
                      <TableHead className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest p-4 whitespace-nowrap">{t("dashboard.table.date")}</TableHead>
                      <TableHead className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest p-4 whitespace-nowrap">{t("dashboard.table.status")}</TableHead>
                      <TableHead className="text-right text-zinc-500 text-[10px] font-bold uppercase tracking-widest p-4 whitespace-nowrap">{t("dashboard.table.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow><TableCell colSpan={6} className="text-center p-12 text-zinc-500">
                        <div className="flex flex-col items-center gap-2">
                          <RefreshCcw size={24} className="animate-spin text-orange-500" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">{t("dashboard.table.loading")}</span>
                        </div>
                      </TableCell></TableRow>
                    ) : applications.length === 0 ? (
                      <TableRow><TableCell colSpan={6} className="text-center p-12 text-zinc-500">
                        <div className="flex flex-col items-center gap-2">
                          <FileSearch size={32} className="text-zinc-800" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">{t("dashboard.table.empty")}</span>
                        </div>
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
                          <div className="text-[10px] text-zinc-500">{app.email}</div>
                        </TableCell>
                        <TableCell className="p-4">{app.country}</TableCell>
                        <TableCell className="p-4">{new Date(app.created_at).toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US')}</TableCell>
                        <TableCell className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest border ${getStatusColor(app.status)}`}>
                            {getStatusLabel(app.status)}
                          </span>
                        </TableCell>
                        <TableCell className="p-4 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" onClick={() => openAppDialog(app)}><Edit2 size={14} /></Button>
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
                  <CardTitle className="text-lg font-bold uppercase tracking-tight">{t("dashboard.agents.title")}</CardTitle>
                  <CardDescription className="text-zinc-500 text-xs mt-1 font-medium">{t("dashboard.agents.desc")}</CardDescription>
                </div>
                {isSuperAdmin && (
                  <Button className="bg-orange-500 hover:bg-orange-600 h-10 px-4 rounded-xl text-[10px] font-bold uppercase shadow-lg" onClick={openCreateAgentDialog}>
                    <UserPlus className="mr-2" size={14} /> {t("dashboard.agents.new")}
                  </Button>
                )}
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                       <TableHead>{t("dashboard.agents.id")}</TableHead>
                       <TableHead>{t("dashboard.agents.user")}</TableHead>
                       <TableHead>{t("dashboard.agents.role")}</TableHead>
                       <TableHead>{t("dashboard.agents.status")}</TableHead>
                       <TableHead className="text-right">{t("dashboard.table.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agents.map((agent) => (
                      <TableRow key={agent.id}>
                        <TableCell>{agent.agent_id}</TableCell>
                        <TableCell>{agent.email}</TableCell>
                        <TableCell>{agent.role}</TableCell>
                        <TableCell>{agent.is_active ? t("dashboard.agents.active") : t("dashboard.agents.disabled")}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => openEditAgentDialog(agent)}><Edit2 size={14} /></Button>
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

      <Dialog open={isAppDialogOpen} onOpenChange={setIsAppDialogOpen}>
        <DialogContent className="bg-zinc-950 border-white/10 text-white max-w-5xl rounded-[2rem] p-8">
           <DialogHeader>
              <DialogTitle>{t("dashboard.table.details")}</DialogTitle>
           </DialogHeader>
           <div className="grid grid-cols-2 gap-4 mt-4">
              <div><Label>{t("application.form.first_name")}</Label><Input value={appForm.first_name || ""} readOnly className="bg-black" /></div>
              <div><Label>{t("application.form.last_name")}</Label><Input value={appForm.last_name || ""} readOnly className="bg-black" /></div>
           </div>
           <DialogFooter className="mt-6">
              <Button variant="ghost" onClick={() => setIsAppDialogOpen(false)}>{t("application.form.back")}</Button>
           </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAgentDialogOpen} onOpenChange={setIsAgentDialogOpen}>
        <DialogContent className="bg-zinc-950 border-white/10 text-white max-w-2xl rounded-[2rem] p-8">
           <DialogHeader>
              <DialogTitle>{editingAgent ? t("dashboard.agents.edit") : t("dashboard.agents.new")}</DialogTitle>
           </DialogHeader>
           <form onSubmit={handleAgentSubmit} className="space-y-4">
              <Input placeholder={t("admin.username")} value={agentForm.email} onChange={e => setAgentForm({...agentForm, email: e.target.value})} className="bg-black" />
              <Button type="submit" className="w-full bg-orange-500">{t("application.form.submit")}</Button>
           </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;