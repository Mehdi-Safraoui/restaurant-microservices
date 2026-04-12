import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChefHat, Eye, EyeOff, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/authStore";
import { authApi, findUserByEmail } from "@/services/api";
import { toast } from "sonner";
import { UserRole } from "@/types";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // ── Login via /api/auth/login ──
        const { data } = await authApi.post("/login", { email, password });
        const { token, role } = data;

        let user = { id: 0, nom: "", prenom: "", email, role: role as UserRole, active: true };
        try {
          localStorage.setItem("auth_token", token);
          const found = await findUserByEmail(email);
          if (found) user = found;
        } catch {
          localStorage.removeItem("auth_token");
        }

        login(user, token);
        toast.success(`Bienvenue !`);

        const redirectMap: Record<UserRole, string> = { ADMIN: "/admin", CLIENT: "/client", LIVREUR: "/livreur" };
        navigate(redirectMap[user.role]);
      } else {
        // ── Register via /api/auth/register ──
        const { data } = await authApi.post("/register", {
          nom,
          prenom,
          email,
          password,
          role: "CLIENT",
        });

        const { token, role } = data;
        const user = { id: 0, nom, prenom, email, role: role as UserRole, active: true };

        login(user, token);
        toast.success("Compte créé avec succès !");
        navigate("/client");
      }
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Erreur d'authentification. Vérifiez vos identifiants.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 gradient-dark items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 25% 25%, hsl(16 85% 55% / 0.3), transparent 50%), radial-gradient(circle at 75% 75%, hsl(35 90% 52% / 0.2), transparent 50%)" }} />
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="relative z-10 max-w-md">
          <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center mb-8 shadow-glow">
            <ChefHat className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-heading font-bold text-primary-foreground mb-4">RestaurantOS</h1>
          <p className="text-lg text-primary-foreground/70 leading-relaxed">
            Your complete restaurant management platform. Manage menus, orders, deliveries, and events — all in one place.
          </p>
          {/* Demo accounts removed — using real authentication */}
        </motion.div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-background">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
              <ChefHat className="h-5 w-5 text-primary-foreground" />
            </div>
            <h2 className="font-heading font-bold text-xl">RestaurantOS</h2>
          </div>

          <h2 className="text-2xl font-heading font-bold mb-1">{isLogin ? "Welcome back" : "Create account"}</h2>
          <p className="text-sm text-muted-foreground mb-6">{isLogin ? "Sign in to your account" : "Sign up as a new client"}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <Label htmlFor="nom" className="text-sm font-medium">Nom</Label>
                  <Input id="nom" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Martin" className="mt-1.5" required />
                </div>
                <div>
                  <Label htmlFor="prenom" className="text-sm font-medium">Prénom</Label>
                  <Input id="prenom" value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="Alice" className="mt-1.5" required />
                </div>
              </>
            )}
            <div>
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@restaurant.com" className="mt-1.5" required />
            </div>
            <div>
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative mt-1.5">
                <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Toggle password">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground hover:opacity-90 transition-opacity">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin ? "Se connecter" : "Créer le compte"}
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-6">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-medium hover:underline">
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
