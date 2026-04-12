import { useEffect, useState } from "react";
import { ClientLayout } from "@/layouts/ClientLayout";
import { PageHeader } from "@/components/shared";
import { platsApi, eventsApi } from "@/services/api";
import { Plat, Evenement } from "@/types";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ClientHome() {
  const [plats, setPlats] = useState<Plat[]>([]);
  const [events, setEvents] = useState<Evenement[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([platsApi.get("/"), eventsApi.get("/")])
      .then(([platsRes, eventsRes]) => {
        setPlats((platsRes.data || []).slice(0, 3));
        setEvents((eventsRes.data || []).slice(0, 3));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <ClientLayout>
      <div className="mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl gradient-primary p-8 md:p-12 text-primary-foreground">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-3">Bienvenue sur RestaurantOS</h1>
          <p className="text-primary-foreground/80 mb-6 max-w-lg">Découvrez nos plats, commandez en ligne et profitez d'une expérience gastronomique depuis chez vous.</p>
          <Button onClick={() => navigate("/client/menu")} className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90">
            Voir le menu <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </motion.div>
      </div>

      <PageHeader title="Plats à la une" description="Nos meilleures sélections" />
      {loading ? (
        <div className="flex justify-center py-8"><div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {plats.length === 0 && <p className="col-span-full text-muted-foreground text-center py-8">Aucun plat disponible pour le moment.</p>}
          {plats.map((plat, i) => (
            <motion.div key={plat.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card p-5 shadow-soft group hover:shadow-md transition-shadow">
              <div className="h-32 rounded-lg bg-muted mb-3 flex items-center justify-center text-muted-foreground text-sm">🍽️</div>
              <h3 className="font-heading font-semibold">{plat.nom}</h3>
              <div className="flex flex-wrap gap-1 mb-2">
                {(plat.ingredients || []).slice(0, 3).map((ing) => (
                  <span key={ing.id} className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{ing.nom}</span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <p className="font-heading font-bold text-primary">{(plat.prix || 0).toFixed(2)} DT</p>
                <Button size="sm" className="gradient-primary text-primary-foreground" onClick={() => { addItem(plat); toast.success(`${plat.nom} ajouté au panier`); }}>
                  <ShoppingCart className="h-3 w-3 mr-1" />Ajouter
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <PageHeader title="Événements à venir" description="Ne ratez rien !" />
      {loading ? null : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {events.length === 0 && <p className="col-span-full text-muted-foreground text-center py-8">Aucun événement à venir.</p>}
          {events.map((event, i) => (
            <motion.div key={event.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card p-5 shadow-soft">
              <h3 className="font-heading font-semibold mb-1">{event.nom}</h3>
              <p className="text-xs text-muted-foreground mb-3">{event.date} — {event.lieu}</p>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{event.description}</p>
              <Button variant="outline" size="sm" onClick={() => navigate("/client/events")}>En savoir plus</Button>
            </motion.div>
          ))}
        </div>
      )}
    </ClientLayout>
  );
}
