import { useEffect, useState } from "react";
import { ClientLayout } from "@/layouts/ClientLayout";
import { PageHeader, StarRating } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { platsApi, reviewsApi } from "@/services/api";
import { useCartStore } from "@/stores/cartStore";
import { Plat, Review } from "@/types";
import { Search, ShoppingCart, Star, MessageSquarePlus } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";

export default function ClientMenu() {
  const [plats, setPlats] = useState<Plat[]>([]);
  const [reviews, setReviews] = useState<Record<number, Review[]>>({});
  const [avgRatings, setAvgRatings] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState([200]);
  const addItem = useCartStore((s) => s.addItem);
  const user = useAuthStore((s) => s.user);

  const [reviewModal, setReviewModal] = useState<{ open: boolean; dishId: number | null }>({ open: false, dishId: null });
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    platsApi.get("/")
      .then((res) => {
        const data: Plat[] = res.data || [];
        setPlats(data);
        // Fetch reviews & avg rating for each plat in parallel
        data.forEach((p) => {
          reviewsApi.get(`/dish/${p.id}`)
            .then((r) => setReviews((prev) => ({ ...prev, [p.id]: r.data || [] })))
            .catch(() => {});
          reviewsApi.get(`/average/${p.id}`)
            .then((r) => setAvgRatings((prev) => ({ ...prev, [p.id]: Math.round(r.data || 0) })))
            .catch(() => {});
        });
      })
      .catch(() => toast.error("Erreur de chargement du menu"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = plats.filter((i) => {
    return i.nom.toLowerCase().includes(search.toLowerCase()) && (i.prix || 0) <= maxPrice[0];
  });

  const handleSubmitReview = async () => {
    if (!reviewRating || !reviewComment.trim()) { toast.error("Veuillez donner une note et un commentaire"); return; }
    setSubmitting(true);
    try {
      const res = await reviewsApi.post("/", {
        userId: user?.id || 0,
        dishId: reviewModal.dishId,
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      // Add to local reviews (as pending)
      const newReview: Review = res.data;
      setReviews((prev) => ({ ...prev, [reviewModal.dishId!]: [newReview, ...(prev[reviewModal.dishId!] || [])] }));
      setReviewModal({ open: false, dishId: null });
      setReviewRating(0);
      setReviewComment("");
      toast.success("Avis soumis — en attente de validation");
    } catch {
      toast.error("Erreur lors de la soumission de l'avis");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ClientLayout>
      <PageHeader title="Notre Menu" description="Parcourez et commandez vos favoris" />

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un plat..." className="pl-10" />
        </div>
        <div className="flex items-center gap-3 min-w-[200px]">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Max: {maxPrice[0]} DT</span>
          <Slider value={maxPrice} onValueChange={setMaxPrice} max={200} min={1} step={1} className="flex-1" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((plat, i) => {
            const platReviews = (reviews[plat.id] || []).filter((r) => r.status === "APPROVED");
            const avg = avgRatings[plat.id] || 0;
            return (
              <motion.div key={plat.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border bg-card overflow-hidden shadow-soft group hover:shadow-md transition-shadow">
                <div className="h-36 bg-muted flex items-center justify-center text-4xl">🍽️</div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-heading font-semibold text-sm">{plat.nom}</h3>
                    {avg > 0 && <StarRating rating={avg} />}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {(plat.ingredients || []).map((ing) => (
                      <span key={ing.id} className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{ing.nom}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-heading font-bold text-primary">{(plat.prix || 0).toFixed(2)} DT</p>
                    <Button size="sm" className="gradient-primary text-primary-foreground h-8" onClick={() => { addItem(plat); toast.success(`${plat.nom} ajouté au panier`); }}>
                      <ShoppingCart className="h-3 w-3 mr-1" />Ajouter
                    </Button>
                  </div>

                  <div className="border-t border-border pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium">Avis ({platReviews.length})</p>
                      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setReviewModal({ open: true, dishId: plat.id })}>
                        <MessageSquarePlus className="h-3 w-3 mr-1" />Laisser un avis
                      </Button>
                    </div>
                    {platReviews.slice(0, 2).map((r) => (
                      <div key={r.id} className="mb-2 last:mb-0">
                        <div className="flex items-center gap-2">
                          <StarRating rating={r.rating} />
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{r.comment}</p>
                      </div>
                    ))}
                    {platReviews.length === 0 && <p className="text-xs text-muted-foreground">Pas encore d'avis.</p>}
                  </div>
                </div>
              </motion.div>
            );
          })}
          {filtered.length === 0 && <p className="col-span-full text-center text-muted-foreground py-12">Aucun plat trouvé.</p>}
        </div>
      )}

      <Dialog open={reviewModal.open} onOpenChange={(o) => { setReviewModal({ open: o, dishId: reviewModal.dishId }); if (!o) { setReviewRating(0); setReviewComment(""); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Laisser un avis</DialogTitle>
            <DialogDescription>Donnez une note et partagez votre experience sur ce plat.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <p className="text-sm font-medium mb-2">Note</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => setReviewRating(n)} className="focus:outline-none" aria-label={`${n} étoiles`}>
                    <Star className={`h-6 w-6 transition-colors ${n <= reviewRating ? "text-warning fill-warning" : "text-muted"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Commentaire</p>
              <Textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} placeholder="Partagez votre expérience..." rows={3} />
            </div>
            <Button onClick={handleSubmitReview} disabled={submitting} className="w-full gradient-primary text-primary-foreground">
              Soumettre l'avis
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </ClientLayout>
  );
}
