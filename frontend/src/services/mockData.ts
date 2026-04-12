import { User, Plat, Ingredient, Commande, Review, Reclamation, Delivery, Evenement } from "@/types";

// ===== Ingredients =====
export const mockIngredients: Ingredient[] = [
  { id: 1, nom: "Salmon" },
  { id: 2, nom: "Lemon" },
  { id: 3, nom: "Butter" },
  { id: 4, nom: "Asparagus" },
  { id: 5, nom: "Pasta" },
  { id: 6, nom: "Truffle" },
  { id: 7, nom: "Cream" },
  { id: 8, nom: "Parmesan" },
  { id: 9, nom: "Romaine" },
  { id: 10, nom: "Croutons" },
  { id: 11, nom: "Mascarpone" },
  { id: 12, nom: "Espresso" },
  { id: 13, nom: "Cocoa" },
  { id: 14, nom: "Wagyu Beef" },
  { id: 15, nom: "Brioche Bun" },
  { id: 16, nom: "Mozzarella" },
  { id: 17, nom: "Tomato" },
  { id: 18, nom: "Basil" },
  { id: 19, nom: "Chocolate" },
  { id: 20, nom: "Vanilla" },
];

// ===== Users =====
export const mockUsers: User[] = [
  { id: 1, nom: "Admin", prenom: "Chef", email: "admin@restaurant.com", role: "ADMIN", active: true },
  { id: 2, nom: "Martin", prenom: "Alice", email: "alice@email.com", role: "CLIENT", active: true },
  { id: 3, nom: "Klein", prenom: "Bob", email: "bob@email.com", role: "CLIENT", active: true },
  { id: 4, nom: "Smith", prenom: "Carol", email: "carol@email.com", role: "CLIENT", active: false },
  { id: 5, nom: "Livreur", prenom: "Dave", email: "livreur@email.com", role: "LIVREUR", active: true },
  { id: 6, nom: "Driver", prenom: "Eve", email: "eve@email.com", role: "LIVREUR", active: true },
];

export const mockUser: User = mockUsers[0];
export const mockClientUser: User = mockUsers[1];
export const mockDeliveryUser: User = mockUsers[4];

// ===== Plats =====
export const mockPlats: Plat[] = [
  { id: 1, nom: "Grilled Salmon", prix: 24.99, ingredients: [mockIngredients[0], mockIngredients[1], mockIngredients[2], mockIngredients[3]] },
  { id: 2, nom: "Truffle Pasta", prix: 18.50, ingredients: [mockIngredients[4], mockIngredients[5], mockIngredients[6], mockIngredients[7]] },
  { id: 3, nom: "Caesar Salad", prix: 12.00, ingredients: [mockIngredients[8], mockIngredients[9], mockIngredients[7]] },
  { id: 4, nom: "Tiramisu", prix: 9.50, ingredients: [mockIngredients[10], mockIngredients[11], mockIngredients[12]] },
  { id: 5, nom: "Wagyu Burger", prix: 28.00, ingredients: [mockIngredients[13], mockIngredients[14], mockIngredients[2]] },
  { id: 6, nom: "Margherita Pizza", prix: 14.00, ingredients: [mockIngredients[15], mockIngredients[16], mockIngredients[17]] },
  { id: 7, nom: "Chocolate Fondant", prix: 11.00, ingredients: [mockIngredients[18], mockIngredients[2], mockIngredients[19]] },
];

// ===== Commandes =====
export const mockCommandes: Commande[] = [
  { id: 1, userId: 2, totalPrice: 49.98, commandeStatus: "EN_PREPARATION", paymentStatus: "PAYEE", createdAt: "2026-04-10T10:30:00Z" },
  { id: 2, userId: 3, totalPrice: 37.50, commandeStatus: "EN_ATTENTE", paymentStatus: "NON_PAYEE", createdAt: "2026-04-10T11:00:00Z" },
  { id: 3, userId: 4, totalPrice: 28.00, commandeStatus: "LIVREE", paymentStatus: "PAYEE", createdAt: "2026-04-09T19:00:00Z" },
  { id: 4, userId: 2, totalPrice: 36.00, commandeStatus: "EN_LIVRAISON", paymentStatus: "PAYEE", createdAt: "2026-04-10T12:00:00Z" },
  { id: 5, userId: 2, totalPrice: 25.00, commandeStatus: "PRETE", paymentStatus: "PAYEE", createdAt: "2026-04-10T13:00:00Z" },
];

// ===== Reviews =====
export const mockReviews: Review[] = [
  { id: 1, userId: 2, dishId: 1, rating: 5, comment: "Absolutely fantastic salmon! Best I've had.", status: "APPROVED", createdAt: "2026-04-08T14:00:00Z" },
  { id: 2, userId: 3, dishId: 2, rating: 4, comment: "Great pasta, could use a bit more truffle.", status: "APPROVED", createdAt: "2026-04-07T18:00:00Z" },
  { id: 3, userId: 2, dishId: 4, rating: 5, comment: "The tiramisu is absolutely divine!", status: "APPROVED", createdAt: "2026-04-09T15:00:00Z" },
  { id: 4, userId: 4, dishId: 1, rating: 3, comment: "Good but a bit overcooked.", status: "PENDING", createdAt: "2026-04-10T10:00:00Z" },
];

// ===== Reclamations =====
export const mockReclamations: Reclamation[] = [
  { id: 1, userId: 4, orderId: 3, message: "Order arrived cold and 45 minutes late.", status: "PENDING", createdAt: "2026-04-09T20:00:00Z" },
];

// ===== Deliveries =====
export const mockDeliveries: Delivery[] = [
  { id: 1, orderId: 4, deliveryAddress: "789 Pine Rd", status: "IN_DELIVERY", createdAt: "2026-04-10T12:10:00Z", estimatedTime: "12:45 PM", deliveryPerson: "Dave Livreur" },
  { id: 2, orderId: 1, deliveryAddress: "123 Main St", status: "ASSIGNED", createdAt: "2026-04-10T10:35:00Z", estimatedTime: "1:15 PM", deliveryPerson: "Dave Livreur" },
  { id: 3, orderId: 3, deliveryAddress: "456 Oak Ave", status: "DELIVERED", createdAt: "2026-04-09T19:10:00Z", deliveredAt: "2026-04-09T20:15:00Z", deliveryPerson: "Dave Livreur" },
];

// ===== Evenements =====
export const mockEvenements: Evenement[] = [
  { id: 1, nom: "Wine Tasting Evening", description: "Explore premium wines from Bordeaux paired with artisan cheeses", date: "2026-04-20", lieu: "Main Hall" },
  { id: 2, nom: "Chef's Table Experience", description: "An intimate 7-course dinner prepared by our head chef", date: "2026-04-25", lieu: "Private Dining Room" },
  { id: 3, nom: "Jazz & Dine Night", description: "Live jazz performance with a special prix fixe menu", date: "2026-05-01", lieu: "Terrace" },
];
