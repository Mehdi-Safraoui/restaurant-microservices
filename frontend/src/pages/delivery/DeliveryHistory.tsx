import { useEffect, useState } from "react";
import { DeliveryLayout } from "@/layouts/DeliveryLayout";
import { PageHeader, StatusBadge } from "@/components/shared";
import { deliveriesApi } from "@/services/api";
import { Delivery, parseDate } from "@/types";
import { motion } from "framer-motion";
import { MapPin, Wallet } from "lucide-react";
import { toast } from "sonner";

export default function DeliveryHistory() {
  const [completed, setCompleted] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    deliveriesApi.get("/")
      .then((res) => {
        const all: Delivery[] = res.data || [];
        setCompleted(all.filter((d) => d.status === "DELIVERED"));
      })
      .catch(() => toast.error("Erreur de chargement de l'historique"))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (val: string | number[]) => {
    try { return new Date(parseDate(val)).toLocaleString("fr-FR"); } catch { return "—"; }
  };

  return (
    <DeliveryLayout>
      <PageHeader title="Historique des livraisons" description="Vos livraisons effectuées" />
      {loading ? (
        <div className="flex justify-center py-16"><div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full" /></div>
      ) : (
        <div className="space-y-3">
          {completed.length === 0 && <p className="text-center text-muted-foreground py-12">Aucune livraison effectuée.</p>}
          {completed.map((delivery, i) => (
            <motion.div key={delivery.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card p-5 shadow-soft">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-heading font-semibold">Livraison #{delivery.id}</h4>
                  <p className="text-xs text-muted-foreground">Commande: #{delivery.orderId}</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{delivery.deliveryAddress || "Adresse non renseignee"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Wallet className="h-4 w-4 text-primary" />
                      <span>{typeof delivery.totalPrice === "number" ? `${delivery.totalPrice.toFixed(2)} DT` : "Montant non renseigne"}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <StatusBadge status={delivery.status} />
                  {delivery.deliveredAt && (
                    <p className="text-xs text-muted-foreground mt-1">Livré le: {formatDate(delivery.deliveredAt)}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </DeliveryLayout>
  );
}
