import { useEffect, useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { PageHeader, StatusBadge } from "@/components/shared";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { commandesApi } from "@/services/api";
import { Commande, CommandeStatus, parseDate } from "@/types";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const statuses: CommandeStatus[] = ["EN_ATTENTE", "EN_PREPARATION", "PRETE", "EN_LIVRAISON", "LIVREE", "ANNULEE"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    commandesApi.get("/")
      .then((res) => setOrders(res.data || []))
      .catch(() => toast.error("Erreur de chargement des commandes"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter((o) => {
    const matchSearch = String(o.id).includes(search) || String(o.userId).includes(search);
    const matchStatus = statusFilter === "all" || o.commandeStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateStatus = async (id: number, status: CommandeStatus) => {
    try {
      // PUT /commandes/{id}/{status}
      const res = await commandesApi.put(`/${id}/${status}`);
      setOrders((prev) => prev.map((o) => o.id === id ? { ...o, commandeStatus: (res.data?.commandeStatus || status) } : o));
      toast.success(`Commande #${id} → ${status.replace(/_/g, " ")}`);
    } catch {
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  const formatDate = (val: string | number[]) => {
    try { return new Date(parseDate(val)).toLocaleDateString("fr-FR"); } catch { return "—"; }
  };

  return (
    <AdminLayout>
      <PageHeader title="Orders Management" description="Track and manage all commandes" />
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by ID or User ID..." className="pl-10" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {statuses.map((s) => <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full" /></div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead><TableHead>User ID</TableHead><TableHead>Total</TableHead>
                <TableHead>Status</TableHead><TableHead>Payment</TableHead><TableHead>Date</TableHead><TableHead>Update Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Aucune commande.</TableCell></TableRow>
              ) : (
                filtered.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>#{order.userId}</TableCell>
                    <TableCell className="font-semibold">{(order.totalPrice || 0).toFixed(2)} DT</TableCell>
                    <TableCell><StatusBadge status={order.commandeStatus} /></TableCell>
                    <TableCell><StatusBadge status={order.paymentStatus} /></TableCell>
                    <TableCell className="text-muted-foreground text-sm">{formatDate(order.createdAt)}</TableCell>
                    <TableCell>
                      <Select value={order.commandeStatus || "EN_ATTENTE"} onValueChange={(v) => updateStatus(order.id, v as CommandeStatus)}>
                        <SelectTrigger className="w-[160px] h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {statuses.map((s) => <SelectItem key={s} value={s} className="text-xs">{s.replace(/_/g, " ")}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </motion.div>
      )}
    </AdminLayout>
  );
}
