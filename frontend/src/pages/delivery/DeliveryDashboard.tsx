import { useEffect, useState } from "react";
import { DeliveryLayout } from "@/layouts/DeliveryLayout";
import { PageHeader, StatCard, StatusBadge } from "@/components/shared";
import { deliveriesApi } from "@/services/api";
import { Delivery } from "@/types";
import { Truck, CheckCircle, Clock, RefreshCw, MapPin, Wallet, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function DeliveryDashboard() {
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDeliveries = () => {
    setLoading(true);
    deliveriesApi.get("/")
      .then((res) => setDeliveries(res.data || []))
      .catch(() => toast.error("Erreur de chargement des livraisons"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDeliveries(); }, []);

  const active = deliveries.filter((d) => d.status !== "DELIVERED" && d.status !== "CANCELLED");
  const completed = deliveries.filter((d) => d.status === "DELIVERED");

  return (
    <DeliveryLayout>
      <PageHeader title="Tableau de bord Livraison" description="Vos livraisons assignées">
        <Button variant="outline" size="sm" onClick={fetchDeliveries} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />Actualiser
        </Button>
      </PageHeader>

      {loading ? (
        <div className="flex justify-center py-16"><div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full" /></div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <StatCard title="Livraisons actives" value={active.length} icon={Truck} />
            <StatCard title="Livraisons complètes" value={completed.length} icon={CheckCircle} />
            <StatCard title="Total" value={deliveries.length} icon={Clock} />
          </div>

          <h3 className="font-heading font-semibold mb-4">Livraisons actives</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {active.map((delivery, i) => (
              <motion.div key={delivery.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-border bg-card p-5 shadow-soft cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/livreur/deliveries/${delivery.id}`)}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-heading font-semibold">Livraison #{delivery.id}</h4>
                    <p className="text-xs text-muted-foreground">Commande: #{delivery.orderId}</p>
                  </div>
                  <StatusBadge status={delivery.status} />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>{delivery.deliveryAddress || "Adresse non renseignee"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-primary shrink-0" />
                    <span>{typeof delivery.totalPrice === "number" ? `${delivery.totalPrice.toFixed(2)} DT` : "Montant non renseigne"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserRound className="h-4 w-4 text-primary shrink-0" />
                    <span>{delivery.deliveryPerson?.name || "Livreur non assigne"}</span>
                  </div>
                  {delivery.estimatedTime && (
                    <p className="text-xs text-muted-foreground">Temps estime: {delivery.estimatedTime} min</p>
                  )}
                </div>
              </motion.div>
            ))}
            {active.length === 0 && <p className="col-span-full text-center text-muted-foreground py-8">Aucune livraison active.</p>}
          </div>
        </>
      )}
    </DeliveryLayout>
  );
}
