import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DeliveryLayout } from "@/layouts/DeliveryLayout";
import { PageHeader, StatusBadge } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { deliveriesApi } from "@/services/api";
import { Delivery, DeliveryStatus } from "@/types";
import { ArrowLeft, MapPin, Package, Loader2, Wallet, UserRound, Clock3 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const deliveryStatuses: DeliveryStatus[] = ["CREATED", "ASSIGNED", "PICKED_UP", "IN_DELIVERY", "DELIVERED"];

const nextStatus: Record<string, DeliveryStatus | null> = {
  CREATED: "ASSIGNED",
  ASSIGNED: "PICKED_UP",
  PICKED_UP: "IN_DELIVERY",
  IN_DELIVERY: "DELIVERED",
  DELIVERED: null,
};

export default function DeliveryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    deliveriesApi.get(`/`) // No GET by ID, fetch all and find
      .then((res) => {
        const all: Delivery[] = res.data || [];
        const found = all.find((d) => d.id === Number(id));
        setDelivery(found || null);
      })
      .catch(() => toast.error("Erreur de chargement"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdateStatus = async (status: DeliveryStatus) => {
    if (!delivery) return;
    setUpdating(true);
    try {
      // PUT /api/deliveries/{id}/status?status={status}
      const res = await deliveriesApi.put(`/${delivery.id}/status`, null, { params: { status } });
      setDelivery((prev) => prev ? { ...prev, ...res.data, status: res.data?.status || status } : prev);
      toast.success(`Statut mis à jour : ${status.replace(/_/g, " ")}`);
      if (status === "DELIVERED") {
        setTimeout(() => navigate("/livreur"), 1500);
      }
    } catch {
      toast.error("Erreur lors de la mise à jour du statut");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <DeliveryLayout><div className="flex justify-center py-16"><div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full" /></div></DeliveryLayout>;
  }

  if (!delivery) {
    return <DeliveryLayout><div className="py-12 text-center text-muted-foreground">Livraison introuvable</div></DeliveryLayout>;
  }

  const currentStatusIdx = deliveryStatuses.indexOf(delivery.status);

  return (
    <DeliveryLayout>
      <Button variant="ghost" onClick={() => navigate("/livreur")} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" />Retour
      </Button>
      <PageHeader title={`Livraison #${delivery.id}`} description={`Commande: #${delivery.orderId}`}>
        <StatusBadge status={delivery.status} />
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-heading font-semibold mb-4">Informations</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center"><MapPin className="h-4 w-4 text-primary" /></div>
              <div>
                <p className="text-sm">{delivery.deliveryAddress || "Adresse non renseignée"}</p>
                <p className="text-xs text-muted-foreground mt-1">Adresse de livraison</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center"><Package className="h-4 w-4 text-primary" /></div>
              <div>
                <p className="text-sm font-medium">Commande #{delivery.orderId}</p>
                <p className="text-xs text-muted-foreground">Reference de commande</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center"><Wallet className="h-4 w-4 text-primary" /></div>
              <div>
                <p className="text-sm font-medium">{typeof delivery.totalPrice === "number" ? `${delivery.totalPrice.toFixed(2)} DT` : "Montant non renseigne"}</p>
                <p className="text-xs text-muted-foreground">Montant de la commande</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center"><UserRound className="h-4 w-4 text-primary" /></div>
              <div>
                <p className="text-sm font-medium">{delivery.deliveryPerson?.name || "Livreur non assigne"}</p>
                <p className="text-xs text-muted-foreground">{delivery.deliveryPerson?.phone || "Telephone non renseigne"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center"><Clock3 className="h-4 w-4 text-primary" /></div>
              <div>
                <p className="text-sm font-medium">{delivery.estimatedTime ? `${delivery.estimatedTime} min` : "Non estime"}</p>
                <p className="text-xs text-muted-foreground">Temps de livraison estime</p>
              </div>
            </div>
          </div>
          <div className="mt-6 h-40 rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-sm">📍 Carte</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-heading font-semibold mb-3">Progression</h3>
            <div className="space-y-2">
              {deliveryStatuses.map((s, idx) => {
                const done = idx <= currentStatusIdx;
                return (
                  <div key={s} className={`flex items-center gap-3 p-2 rounded-lg ${done ? "bg-primary/10" : "bg-muted/50"}`}>
                    <div className={`h-3 w-3 rounded-full ${done ? "bg-primary" : "bg-muted"}`} />
                    <span className={`text-sm ${done ? "font-medium" : "text-muted-foreground"}`}>{s.replace(/_/g, " ")}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {nextStatus[delivery.status] && (
            <Button
              onClick={() => handleUpdateStatus(nextStatus[delivery.status]!)}
              disabled={updating}
              className="w-full gradient-primary text-primary-foreground h-12 text-base"
            >
              {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Marquer comme : {nextStatus[delivery.status]!.replace(/_/g, " ")}
            </Button>
          )}
        </motion.div>
      </div>
    </DeliveryLayout>
  );
}
