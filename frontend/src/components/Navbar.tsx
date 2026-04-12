import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Search } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function Navbar() {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="h-14 border-b border-border bg-card/60 backdrop-blur-md flex items-center justify-between px-4 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        <div className="hidden md:flex items-center gap-2 bg-muted rounded-lg px-3 py-1.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." className="border-0 bg-transparent h-7 w-48 focus-visible:ring-0 text-sm placeholder:text-muted-foreground" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Notifications">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
        </button>

        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="gradient-primary text-primary-foreground text-xs font-semibold">
              {user?.prenom?.charAt(0) || "A"}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium leading-none">{user ? `${user.prenom} ${user.nom}` : "Admin"}</p>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 mt-0.5 font-normal">
              {user?.role || "ADMIN"}
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
}
