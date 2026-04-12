import { useEffect, useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { PageHeader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { platsApi, ingredientsApi, reviewsApi } from "@/services/api";
import { Plat, Ingredient } from "@/types";
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { StarRating } from "@/components/shared";

export default function AdminMenuPage() {
  const [items, setItems] = useState<Plat[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editItem, setEditItem] = useState<Plat | null>(null);
  const [form, setForm] = useState({ nom: "", prix: "", selectedIngredients: [] as number[], newIngredient: "" });
  const [avgRatings, setAvgRatings] = useState<Record<number, number>>({});

  useEffect(() => {
    Promise.all([platsApi.get("/"), ingredientsApi.get("/")])
      .then(([platsRes, ingRes]) => {
        const plats: Plat[] = platsRes.data || [];
        setItems(plats);
        setIngredients(ingRes.data || []);
        // Fetch average ratings for each plat
        plats.forEach((p) => {
          reviewsApi.get(`/average/${p.id}`)
            .then((r) => setAvgRatings((prev) => ({ ...prev, [p.id]: Math.round(r.data || 0) })))
            .catch(() => {});
        });
      })
      .catch(() => toast.error("Erreur de chargement du menu"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter((i) => i.nom.toLowerCase().includes(search.toLowerCase()));

  const handleAddIngredient = async () => {
    const name = form.newIngredient.trim();
    if (!name) return;
    try {
      const res = await ingredientsApi.post("/", { nom: name });
      const newIng: Ingredient = res.data;
      setIngredients((prev) => [...prev, newIng]);
      setForm((prev) => ({ ...prev, selectedIngredients: [...prev.selectedIngredients, newIng.id], newIngredient: "" }));
      toast.success(`Ingrédient "${name}" créé`);
    } catch {
      toast.error("Erreur lors de la création de l'ingrédient");
    }
  };

  const toggleIngredient = (id: number) => {
    setForm((prev) => ({
      ...prev,
      selectedIngredients: prev.selectedIngredients.includes(id)
        ? prev.selectedIngredients.filter((i) => i !== id)
        : [...prev.selectedIngredients, id],
    }));
  };

  const handleSave = async () => {
    if (!form.nom || !form.prix) { toast.error("Nom et prix requis"); return; }
    setSaving(true);
    try {
      const selectedIngs = ingredients.filter((ing) => form.selectedIngredients.includes(ing.id));
      const payload = { nom: form.nom, prix: parseFloat(form.prix), ingredients: selectedIngs };
      if (editItem) {
        const res = await platsApi.put(`/${editItem.id}`, payload);
        setItems((prev) => prev.map((i) => i.id === editItem.id ? res.data : i));
        toast.success("Plat mis à jour");
      } else {
        const res = await platsApi.post("/", payload);
        setItems((prev) => [...prev, res.data]);
        toast.success("Plat créé");
      }
      setIsOpen(false);
      setEditItem(null);
      setForm({ nom: "", prix: "", selectedIngredients: [], newIngredient: "" });
    } catch (err: unknown) {
      toast.error((err as {response?: {data?: {message?: string}}}).response?.data?.message || "Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: Plat) => {
    setEditItem(item);
    setForm({ nom: item.nom, prix: String(item.prix), selectedIngredients: item.ingredients.map((i) => i.id), newIngredient: "" });
    setIsOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce plat ?")) return;
    try {
      await platsApi.delete(`/${id}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Plat supprimé");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <AdminLayout>
      <PageHeader title="Menu Management" description="Add, edit, and manage your plats">
        <Dialog open={isOpen} onOpenChange={(o) => { setIsOpen(o); if (!o) { setEditItem(null); setForm({ nom: "", prix: "", selectedIngredients: [], newIngredient: "" }); } }}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground" onClick={() => setForm({ nom: "", prix: "", selectedIngredients: [], newIngredient: "" })}>
              <Plus className="h-4 w-4 mr-1" />Add Plat
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editItem ? "Edit Plat" : "Add Plat"}</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-4">
              <div><Label>Nom</Label><Input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} className="mt-1" placeholder="Dish name" /></div>
              <div><Label>Prix (DT)</Label><Input type="number" step="0.01" value={form.prix} onChange={(e) => setForm({ ...form, prix: e.target.value })} className="mt-1" /></div>
              <div>
                <Label>Ingrédients sélectionnés</Label>
                <div className="flex flex-wrap gap-2 mt-2 max-h-32 overflow-y-auto p-2 border border-border rounded-lg">
                  {ingredients.map((ing) => (
                    <button
                      key={ing.id} type="button" onClick={() => toggleIngredient(ing.id)}
                      className={`px-3 py-1 rounded-full text-xs border transition-colors ${form.selectedIngredients.includes(ing.id) ? "gradient-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border hover:text-foreground"}`}
                    >
                      {ing.nom}
                    </button>
                  ))}
                  {ingredients.length === 0 && <p className="text-xs text-muted-foreground">Aucun ingrédient disponible</p>}
                </div>
              </div>
              <div>
                <Label>Ajouter un nouvel ingrédient</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={form.newIngredient}
                    onChange={(e) => setForm({ ...form, newIngredient: e.target.value })}
                    onKeyDown={(e) => e.key === "Enter" && handleAddIngredient()}
                    placeholder="Ex: Basilic"
                  />
                  <Button type="button" variant="outline" onClick={handleAddIngredient}>Ajouter</Button>
                </div>
              </div>
              <Button onClick={handleSave} disabled={saving} className="w-full gradient-primary text-primary-foreground">
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editItem ? "Update" : "Create"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search plats..." className="pl-10" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-5 shadow-soft">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-heading font-semibold">{item.nom}</h3>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </div>
              <p className="font-heading font-bold text-lg text-primary mb-2">{(item.prix || 0).toFixed(2)} DT</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {(item.ingredients || []).map((ing) => (
                  <span key={ing.id} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{ing.nom}</span>
                ))}
              </div>
              {avgRatings[item.id] > 0 && (
                <div className="border-t border-border pt-3 flex items-center gap-2">
                  <StarRating rating={avgRatings[item.id]} />
                  <span className="text-xs text-muted-foreground">Note moyenne</span>
                </div>
              )}
            </motion.div>
          ))}
          {filtered.length === 0 && <p className="col-span-full text-center text-muted-foreground py-12">Aucun plat trouvé.</p>}
        </div>
      )}
    </AdminLayout>
  );
}
