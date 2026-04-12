import { ReactNode } from "react";
import { motion } from "framer-motion";
import { LucideIcon, Star } from "lucide-react";

// ===== StatCard =====
interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
}

export function StatCard({ title, value, change, changeType = "neutral", icon: Icon }: StatCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-heading font-bold mt-1">{value}</p>
          {change && (
            <p className={`text-xs mt-1 font-medium ${changeType === "positive" ? "text-success" : changeType === "negative" ? "text-destructive" : "text-muted-foreground"}`}>
              {change}
            </p>
          )}
        </div>
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </motion.div>
  );
}

// ===== PageHeader =====
interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">{title}</h1>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}

// ===== StatusBadge =====
const statusColors: Record<string, string> = {
  // Commande statuses
  EN_ATTENTE: "bg-warning/15 text-warning border-warning/30",
  EN_PREPARATION: "bg-accent/15 text-accent border-accent/30",
  PRETE: "bg-success/15 text-success border-success/30",
  EN_LIVRAISON: "bg-info/15 text-info border-info/30",
  LIVREE: "bg-success/15 text-success border-success/30",
  ANNULEE: "bg-destructive/15 text-destructive border-destructive/30",
  // Payment statuses
  NON_PAYEE: "bg-warning/15 text-warning border-warning/30",
  PAYEE: "bg-success/15 text-success border-success/30",
  ECHEC: "bg-destructive/15 text-destructive border-destructive/30",
  // Delivery statuses
  CREATED: "bg-muted text-muted-foreground border-border",
  ASSIGNED: "bg-info/15 text-info border-info/30",
  PICKED_UP: "bg-accent/15 text-accent border-accent/30",
  IN_DELIVERY: "bg-warning/15 text-warning border-warning/30",
  DELIVERED: "bg-success/15 text-success border-success/30",
  CANCELLED: "bg-destructive/15 text-destructive border-destructive/30",
  // Review / Reclamation statuses
  PENDING: "bg-warning/15 text-warning border-warning/30",
  OPEN: "bg-warning/15 text-warning border-warning/30",
  APPROVED: "bg-success/15 text-success border-success/30",
  REJECTED: "bg-destructive/15 text-destructive border-destructive/30",
  RESOLVED: "bg-success/15 text-success border-success/30",
};

export function StatusBadge({ status }: { status?: string | null }) {
  const normalizedStatus = status?.trim() || "INCONNU";
  const color = statusColors[normalizedStatus] || "bg-muted text-muted-foreground border-border";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${color}`}>
      {normalizedStatus.replace(/_/g, " ")}
    </span>
  );
}

// ===== StarRating =====
interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md";
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export function StarRating({ rating, maxRating = 5, size = "sm", interactive = false, onChange }: StarRatingProps) {
  const sizeClass = size === "sm" ? "h-3 w-3" : "h-5 w-5";
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: maxRating }).map((_, i) => (
        <Star
          key={i}
          className={`${sizeClass} ${i < rating ? "text-warning fill-warning" : "text-muted"} ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
          onClick={() => interactive && onChange?.(i + 1)}
        />
      ))}
    </div>
  );
}

// ===== SkeletonCard =====
export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 animate-pulse-soft">
      <div className="h-4 bg-muted rounded w-1/3 mb-3" />
      <div className="h-8 bg-muted rounded w-1/2 mb-2" />
      <div className="h-3 bg-muted rounded w-1/4" />
    </div>
  );
}
