import { useEffect, useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { PageHeader, StatCard, StarRating } from "@/components/shared";
import { ShoppingBag, Users, Truck, CalendarDays } from "lucide-react";
import { StatusBadge } from "@/components/shared";
import { commandesApi, usersApi, deliveriesApi, eventsApi } from "@/services/api";
import { Commande, Delivery, parseDate } from "@/types";

export default function AdminDashboard() {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [usersCount, setUsersCount] = useState(0);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [eventsCount, setEventsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      commandesApi.get("/"),
      usersApi.get("/"),
      deliveriesApi.get("/"),
      eventsApi.get("/"),
    ])
      .then(([c, u, d, e]) => {
        setCommandes(c.data || []);
        setUsersCount((u.data || []).length);
        setDeliveries(d.data || []);
        setEventsCount((e.data || []).length);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const revenue = commandes.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const activeDeliveries = deliveries.filter((d) => d.status !== "DELIVERED" && d.status !== "CANCELLED");

  return (
    <AdminLayout>
      <PageHeader title="Admin Dashboard" description="Overview of your restaurant operations" />

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard title="Total Orders" value={commandes.length} change="live" changeType="positive" icon={ShoppingBag} />
            <StatCard title="Revenue" value={`$${revenue.toFixed(2)}`} change="total" changeType="positive" icon={ShoppingBag} />
            <StatCard title="Users" value={usersCount} change="registered" changeType="positive" icon={Users} />
            <StatCard title="Active Deliveries" value={activeDeliveries.length} change="en cours" changeType="positive" icon={Truck} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-heading font-semibold mb-4">Recent Orders</h3>
              {commandes.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">No orders yet.</p>
              ) : (
                <div className="space-y-3">
                  {[...commandes]
                    .sort((a, b) => new Date(parseDate(b.createdAt)).getTime() - new Date(parseDate(a.createdAt)).getTime())
                    .slice(0, 5)
                    .map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <p className="font-medium text-sm">Commande #{order.id}</p>
                          <p className="text-xs text-muted-foreground">User #{order.userId}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">${(order.totalPrice || 0).toFixed(2)}</p>
                          <StatusBadge status={order.commandeStatus} />
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Active Deliveries */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-heading font-semibold mb-4">Active Deliveries</h3>
              {activeDeliveries.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">No active deliveries.</p>
              ) : (
                <div className="space-y-3">
                  {activeDeliveries.slice(0, 5).map((d) => (
                    <div key={d.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium text-sm">Delivery #{d.id}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[180px]">{d.deliveryAddress}</p>
                      </div>
                      <StatusBadge status={d.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Stats summary */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "En attente", count: commandes.filter((c) => c.commandeStatus === "EN_ATTENTE").length },
              { label: "En préparation", count: commandes.filter((c) => c.commandeStatus === "EN_PREPARATION").length },
              { label: "En livraison", count: commandes.filter((c) => c.commandeStatus === "EN_LIVRAISON").length },
              { label: "Livrées", count: commandes.filter((c) => c.commandeStatus === "LIVREE").length },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-card p-4 text-center">
                <p className="text-2xl font-heading font-bold text-primary">{s.count}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </AdminLayout>
  );
}
