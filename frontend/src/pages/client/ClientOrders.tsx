import { useCallback, useEffect, useState } from "react";
import { ClientLayout } from "@/layouts/ClientLayout";
import { PageHeader, StatusBadge } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { commandesApi, complaintsApi } from "@/services/api";
import { Commande, CommandeStatus, Reclamation, parseDate } from "@/types";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";

const statusTimeline: CommandeStatus[] = ["EN_ATTENTE", "EN_PREPARATION", "PRETE", "EN_LIVRAISON", "LIVREE"];

function OrderTimeline({ current }: { current: CommandeStatus }) {
  const currentIdx = statusTimeline.indexOf(current);
  return (
    <div className="flex items-center gap-1 mt-3">
      {statusTimeline.map((s, i) => (
        <div key={s} className="flex items-center gap-1 flex-1">
          <div className={`h-2 w-2 rounded-full shrink-0 ${i <= currentIdx ? "bg-primary" : "bg-muted"}`} />
          {i < statusTimeline.length - 1 && <div className={`h-0.5 flex-1 ${i < currentIdx ? "bg-primary" : "bg-muted"}`} />}
        </div>
      ))}
    </div>
  );
}

export default function ClientOrders() {
  const user = useAuthStore((s) => s.user);
  const [orders, setOrders] = useState<Commande[]>([]);
  const [complaints, setComplaints] = useState<Reclamation[]>([]);
  const [loading, setLoading] = useState(true);
  const [complaintModal, setComplaintModal] = useState<{ open: boolean; orderId: number | null }>({ open: false, orderId: null });
  const [complaintMessage, setComplaintMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchOrders = useCallback(() => {
    setLoading(true);
    Promise.all([
      commandesApi.get("/"),
      user?.id ? complaintsApi.get(`/user/${user.id}`) : Promise.resolve({ data: [] }),
    ])
      .then(([cmdRes, cmpRes]) => {
        // Filter commandes by current user
        const allOrders: Commande[] = cmdRes.data || [];
        setOrders(allOrders.filter((o) => o.userId === user?.id));
        setComplaints(cmpRes.data || []);
      })
      .catch(() => toast.error("Erreur de chargement des commandes"))
      .finally(() => setLoading(false));
  }, [user?.id]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleSubmitComplaint = async () => {
    if (!complaintMessage.trim()) { toast.error("Veuillez entrer un message"); return; }
    setSubmitting(true);
    try {
      const res = await complaintsApi.post("/", {
        userId: user?.id || 0,
        orderId: complaintModal.orderId,
        message: complaintMessage.trim(),
      });
      setComplaints((prev) => [...prev, res.data]);
      setComplaintModal({ open: false, orderId: null });
      setComplaintMessage("");
      toast.success("Réclamation soumise avec succès");
    } catch {
      toast.error("Erreur lors de la soumission de la réclamation");
    } finally {
      setSubmitting(false);
    }
  };

  const getComplaintsForOrder = (orderId: number) => complaints.filter((r) => r.orderId === orderId);

  const formatDate = (val: string | number[]) => {
    try { return new Date(parseDate(val)).toLocaleString("fr-FR"); } catch { return "—"; }
  };

  return (
    <ClientLayout>
      <PageHeader title="Mes Commandes" description="Suivez le statut de vos commandes">
        <Button variant="outline" size="sm" onClick={fetchOrders} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />Actualiser
        </Button>
      </PageHeader>

      {loading ? (
        <div className="flex justify-center py-16"><div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full" /></div>
      ) : (
        <div className="space-y-4">
          {orders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Aucune commande pour le moment.</p>
              <Button onClick={() => window.location.href = "/client/menu"} className="gradient-primary text-primary-foreground">Voir le menu</Button>
            </div>
          )}
          {[...orders].reverse().map((order, i) => {
            const orderComplaints = getComplaintsForOrder(order.id);
            return (
              <motion.div key={order.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border bg-card p-5 shadow-soft">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-heading font-semibold">Commande #{order.id}</h3>
                    <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={order.commandeStatus} />
                    <StatusBadge status={order.paymentStatus} />
                  </div>
                </div>
                <div className="flex justify-between font-heading font-bold text-sm border-t border-border pt-2 mb-2">
                  <span>Total</span><span className="text-primary">{(order.totalPrice || 0).toFixed(2)} DT</span>
                </div>
                {order.commandeStatus !== "ANNULEE" && order.commandeStatus !== "LIVREE" && (
                  <>
                    <OrderTimeline current={order.commandeStatus} />
                    <div className="flex justify-between mt-1">
                      {statusTimeline.map((s) => (
                        <span key={s} className="text-[9px] text-muted-foreground flex-1 text-center">{s.replace(/_/g, " ")}</span>
                      ))}
                    </div>
                  </>
                )}

                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      {orderComplaints.map((c) => (
                        <div key={c.id} className="flex items-center gap-2 text-xs">
                          <AlertTriangle className="h-3 w-3 text-warning" />
                          <span className="text-muted-foreground truncate max-w-[200px]">{c.message}</span>
                          <StatusBadge status={c.status} />
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setComplaintModal({ open: true, orderId: order.id })}>
                      <AlertTriangle className="h-3 w-3 mr-1" />Réclamation
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <Dialog open={complaintModal.open} onOpenChange={(o) => { setComplaintModal({ open: o, orderId: complaintModal.orderId }); if (!o) setComplaintMessage(""); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Réclamation — Commande #{complaintModal.orderId}</DialogTitle>
            <DialogDescription>Expliquez le probleme rencontre avec cette commande.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Textarea value={complaintMessage} onChange={(e) => setComplaintMessage(e.target.value)} placeholder="Décrivez votre problème..." rows={4} />
            <Button onClick={handleSubmitComplaint} disabled={submitting} className="w-full gradient-primary text-primary-foreground">
              Soumettre la réclamation
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </ClientLayout>
  );
}
