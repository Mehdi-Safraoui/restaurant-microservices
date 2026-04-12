// ===== User Entity =====
export type UserRole = "ADMIN" | "CLIENT" | "LIVREUR";

export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  password?: string;
  role: UserRole;
  active: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nom: string;
  prenom: string;
  email: string;
  password: string;
}

// ===== Ingredient Entity =====
export interface Ingredient {
  id: number;
  nom: string;
}

// ===== Plat Entity =====
export interface Plat {
  id: number;
  nom: string;
  prix: number;
  ingredients: Ingredient[];
}

// ===== Review Entity =====
export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Review {
  id: number;
  userId: number;
  dishId: number;
  rating: number;
  comment: string;
  status: ReviewStatus;
  createdAt: string;
}

// ===== Commande Entity =====
export type CommandeStatus = "EN_ATTENTE" | "EN_PREPARATION" | "PRETE" | "EN_LIVRAISON" | "LIVREE" | "ANNULEE";
export type PaymentStatus = "NON_PAYEE" | "PAYEE" | "ECHEC";

export interface Commande {
  id: number;
  userId: number;
  totalPrice: number;
  deliveryAddress?: string | null;
  commandeStatus: CommandeStatus;
  paymentStatus: PaymentStatus;
  createdAt: string | number[];
}

// ===== Reclamation (Complaint) Entity =====
export type ReclamationStatus = "OPEN" | "PENDING" | "RESOLVED" | "REJECTED";

export interface Reclamation {
  id: number;
  userId: number;
  orderId: number;
  message: string;
  status: ReclamationStatus;
  createdAt: string;
}

// ===== Delivery Entity =====
export type DeliveryStatus = "CREATED" | "ASSIGNED" | "PICKED_UP" | "IN_DELIVERY" | "DELIVERED" | "CANCELLED";

export interface DeliveryPerson {
  id: number;
  name: string;
  phone: string;
  available: boolean;
  latitude?: number;
  longitude?: number;
}

export interface Delivery {
  id: number;
  orderId: number;
  totalPrice?: number | null;
  deliveryAddress: string | null;
  status: DeliveryStatus;
  createdAt: string | number[];
  deliveredAt?: string | number[];
  estimatedTime?: number;
  deliveryPerson?: DeliveryPerson | null;
}

// ===== Evenement Entity =====
export interface Evenement {
  id: number;
  nom: string;
  description: string;
  date: string;
  lieu: string;
}

// ===== API Response =====
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// ===== Utility: parse Spring LocalDateTime (array or string) =====
export function parseDate(val: string | number[] | null | undefined): string {
  if (!val) return "";
  if (Array.isArray(val)) {
    const [year, month, day, hour = 0, min = 0, sec = 0] = val as number[];
    return new Date(year, month - 1, day, hour, min, sec).toISOString();
  }
  return String(val);
}
