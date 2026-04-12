import { useEffect, useState } from "react";
import { ClientLayout } from "@/layouts/ClientLayout";
import { PageHeader } from "@/components/shared";
import { eventsApi } from "@/services/api";
import { Evenement } from "@/types";
import { CalendarDays, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function ClientEvents() {
  const [events, setEvents] = useState<Evenement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventsApi.get("/")
      .then((res) => setEvents(res.data || []))
      .catch(() => toast.error("Erreur de chargement des événements"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ClientLayout>
      <PageHeader title="Événements" description="Découvrez nos prochains événements" />
      {loading ? (
        <div className="flex justify-center py-16"><div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.length === 0 && <p className="col-span-full text-center text-muted-foreground py-12">Aucun événement à venir.</p>}
          {events.map((event, i) => (
            <motion.div key={event.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card overflow-hidden shadow-soft">
              <div className="h-32 bg-muted flex items-center justify-center text-4xl">🎉</div>
              <div className="p-5">
                <h3 className="font-heading font-semibold mb-1">{event.nom}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{event.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" />{event.date}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{event.lieu}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </ClientLayout>
  );
}
