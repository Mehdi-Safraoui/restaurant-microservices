import { useState } from "react";
import { ClientLayout } from "@/layouts/ClientLayout";
import { PageHeader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/stores/cartStore";
import { commandesApi } from "@/services/api";
import { useAuthStore } from "@/stores/authStore";
import { Minus, Plus, Trash2, ShoppingBag, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, total } = useCartStore();
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!address.trim()) { toast.error("Veuillez entrer une adresse de livraison"); return; }
    setLoading(true);
    try {
      await commandesApi.post("/", {
        userId: user?.id || 0,
        totalPrice: total() + 3.99,
        deliveryAddress: address.trim(),
        commandeStatus: "EN_ATTENTE",
        paymentStatus: "NON_PAYEE",
      });
      toast.success("Commande passée avec succès ! 🎉");
      clearCart();
      navigate("/client/orders");
    } catch {
      toast.error("Erreur lors de la commande. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <ClientLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="font-heading font-bold text-xl mb-2">Votre panier est vide</h2>
          <p className="text-muted-foreground mb-4">Ajoutez des plats depuis notre menu !</p>
          <Button onClick={() => navigate("/client/menu")} className="gradient-primary text-primary-foreground">Voir le menu</Button>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <PageHeader title="Votre Panier" description={`${items.length} article${items.length > 1 ? "s" : ""}`} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <motion.div key={item.plat.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="rounded-xl border border-border bg-card p-4 flex items-center gap-4">
              <div className="h-16 w-16 rounded-lg bg-muted shrink-0 flex items-center justify-center text-2xl">🍽️</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-semibold text-sm">{item.plat.nom}</h3>
                <p className="text-xs text-muted-foreground">{(item.plat.prix || 0).toFixed(2)} DT / unité</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.plat.id, item.quantity - 1)}>
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.plat.id, item.quantity + 1)}>
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <p className="font-heading font-bold text-sm w-16 text-right">{(item.plat.prix * item.quantity).toFixed(2)} DT</p>
              <Button variant="ghost" size="icon" onClick={() => { removeItem(item.plat.id); toast.info("Article retiré"); }}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card p-6 h-fit sticky top-6 space-y-4">
          <h3 className="font-heading font-semibold">Récapitulatif</h3>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.plat.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.plat.nom} x{item.quantity}</span>
                <span>{(item.plat.prix * item.quantity).toFixed(2)} DT</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-3">
            <div className="flex justify-between text-sm mb-1"><span className="text-muted-foreground">Sous-total</span><span>{total().toFixed(2)} DT</span></div>
            <div className="flex justify-between text-sm mb-1"><span className="text-muted-foreground">Livraison</span><span>3.99 DT</span></div>
            <div className="flex justify-between font-heading font-bold mt-2 text-lg"><span>Total</span><span className="text-primary">{(total() + 3.99).toFixed(2)} DT</span></div>
          </div>

          <div>
            <Label>Adresse de livraison</Label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Rue de la Paix, Tunis"
              className="mt-1.5"
            />
          </div>

          <Button onClick={handleCheckout} disabled={loading} className="w-full gradient-primary text-primary-foreground">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Passer la commande
          </Button>
        </div>
      </div>
    </ClientLayout>
  );
}
