import { useEffect, useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { PageHeader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { eventsApi } from "@/services/api";
import { Evenement } from "@/types";
import { Plus, Pencil, Trash2, CalendarDays, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Evenement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editEvent, setEditEvent] = useState<Evenement | null>(null);
  const [form, setForm] = useState({ nom: "", description: "", date: "", lieu: "" });

  useEffect(() => {
    eventsApi.get("/")
      .then((res) => setEvents(res.data || []))
      .catch(() => toast.error("Erreur de chargement des événements"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!form.nom || !form.date || !form.lieu) { toast.error("Nom, date et lieu sont requis"); return; }
    setSaving(true);
    try {
      if (editEvent) {
        const res = await eventsApi.put(`/${editEvent.id}`, form);
        setEvents((prev) => prev.map((e) => e.id === editEvent.id ? res.data : e));
        toast.success("Événement mis à jour");
      } else {
        const res = await eventsApi.post("/", form);
        setEvents((prev) => [...prev, res.data]);
        toast.success("Événement créé");
      }
      setIsOpen(false);
      setEditEvent(null);
      setForm({ nom: "", description: "", date: "", lieu: "" });
    } catch (err: unknown) {
      toast.error((err as {response?: {data?: {message?: string}}}).response?.data?.message || "Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (event: Evenement) => {
    setEditEvent(event);
    setForm({ nom: event.nom, description: event.description, date: event.date, lieu: event.lieu });
    setIsOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cet événement ?")) return;
    try {
      await eventsApi.delete(`/${id}`);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      toast.success("Événement supprimé");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <AdminLayout>
      <PageHeader title="Events Management" description="Create and manage restaurant events">
        <Dialog open={isOpen} onOpenChange={(o) => { setIsOpen(o); if (!o) { setEditEvent(null); setForm({ nom: "", description: "", date: "", lieu: "" }); } }}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground" onClick={() => setForm({ nom: "", description: "", date: "", lieu: "" })}>
              <Plus className="h-4 w-4 mr-1" />Add Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editEvent ? "Edit Event" : "Create Event"}</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-4">
              <div><Label>Nom</Label><Input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} className="mt-1" /></div>
              <div><Label>Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1" /></div>
              <div><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="mt-1" /></div>
              <div><Label>Lieu</Label><Input value={form.lieu} onChange={(e) => setForm({ ...form, lieu: e.target.value })} placeholder="Main Hall" className="mt-1" /></div>
              <Button onClick={handleSave} disabled={saving} className="w-full gradient-primary text-primary-foreground">
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editEvent ? "Update" : "Create"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {loading ? (
        <div className="flex justify-center py-16"><div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.length === 0 && <p className="col-span-full text-center text-muted-foreground py-12">Aucun événement.</p>}
          {events.map((event) => (
            <motion.div key={event.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-5 shadow-soft">
              <h3 className="font-heading font-semibold mb-2">{event.nom}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{event.description}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" />{event.date}</span>
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{event.lieu}</span>
              </div>
              <div className="flex justify-end gap-1">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(event)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(event.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
