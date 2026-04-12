import { useEffect, useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { PageHeader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usersApi, authApi } from "@/services/api";
import { User, UserRole } from "@/types";
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", password: "", role: "CLIENT" as UserRole, active: true });

  const fetchUsers = () => {
    setLoading(true);
    usersApi.get("/")
      .then((res) => setUsers(res.data || []))
      .catch(() => toast.error("Erreur de chargement des utilisateurs"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = users.filter(
    (u) =>
      `${u.prenom} ${u.nom}`.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    if (!form.nom || !form.prenom || !form.email) { toast.error("Veuillez remplir tous les champs"); return; }
    setSaving(true);
    try {
      if (editUser) {
        // PUT /api/users/{id}
        const res = await usersApi.put(`/${editUser.id}`, {
          nom: form.nom,
          prenom: form.prenom,
          email: form.email,
          password: form.password || undefined,
          role: form.role,
        });
        setUsers((prev) => prev.map((u) => u.id === editUser.id ? { ...u, ...res.data } : u));
        toast.success("Utilisateur mis à jour");
      } else {
        // POST /api/auth/register
        if (!form.password) { toast.error("Le mot de passe est requis"); setSaving(false); return; }
        const res = await authApi.post("/register", {
          nom: form.nom,
          prenom: form.prenom,
          email: form.email,
          password: form.password,
          role: form.role,
        });
        // After register, fetch updated list
        await fetchUsers();
        toast.success("Utilisateur créé");
      }
      setIsOpen(false);
      setEditUser(null);
      setForm({ nom: "", prenom: "", email: "", password: "", role: "CLIENT", active: true });
    } catch (err: unknown) {
      toast.error((err as {response?: {data?: {message?: string}}}).response?.data?.message || "Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditUser(user);
    setForm({ nom: user.nom, prenom: user.prenom, email: user.email, password: "", role: user.role, active: user.active });
    setIsOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cet utilisateur ?")) return;
    try {
      await usersApi.delete(`/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("Utilisateur supprimé");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <AdminLayout>
      <PageHeader title="Users Management" description="Create, edit, and manage users">
        <Dialog
          open={isOpen}
          onOpenChange={(o) => {
            setIsOpen(o);
            if (!o) { setEditUser(null); setForm({ nom: "", prenom: "", email: "", password: "", role: "CLIENT", active: true }); }
          }}
        >
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground">
              <Plus className="h-4 w-4 mr-1" />Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editUser ? "Edit User" : "Create User"}</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Nom</Label><Input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} placeholder="Martin" className="mt-1" /></div>
                <div><Label>Prénom</Label><Input value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} placeholder="Alice" className="mt-1" /></div>
              </div>
              <div><Label>Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" className="mt-1" /></div>
              <div>
                <Label>Password {editUser && <span className="text-muted-foreground text-xs">(laisser vide pour ne pas changer)</span>}</Label>
                <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" className="mt-1" />
              </div>
              <div>
                <Label>Role</Label>
                <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as UserRole })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="CLIENT">Client</SelectItem>
                    <SelectItem value="LIVREUR">Livreur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSave} disabled={saving} className="w-full gradient-primary text-primary-foreground">
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editUser ? "Update" : "Create"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="pl-10" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full" /></div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead><TableHead>Prénom</TableHead><TableHead>Email</TableHead>
                <TableHead>Role</TableHead><TableHead>Active</TableHead><TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No users found.</TableCell></TableRow>
              ) : (
                filtered.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.nom}</TableCell>
                    <TableCell>{user.prenom}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell><span className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">{user.role}</span></TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${user.active ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}>
                        {user.active ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </motion.div>
      )}
    </AdminLayout>
  );
}
