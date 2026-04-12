import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { PageHeader, StarRating, StatusBadge } from "@/components/shared";
import { platsApi, reviewsApi, usersApi } from "@/services/api";
import { Plat, Review, User, parseDate } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [plats, setPlats] = useState<Plat[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reviewsRes, usersRes, platsRes] = await Promise.all([
        reviewsApi.get(""),
        usersApi.get(""),
        platsApi.get(""),
      ]);
      setReviews(reviewsRes.data || []);
      setUsers(usersRes.data || []);
      setPlats(platsRes.data || []);
    } catch {
      toast.error("Erreur de chargement des avis");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const userById = useMemo(
    () => Object.fromEntries(users.map((user) => [user.id, user])),
    [users]
  );

  const platById = useMemo(
    () => Object.fromEntries(plats.map((plat) => [plat.id, plat])),
    [plats]
  );

  const filteredReviews = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return reviews.filter((review) => {
      const user = userById[review.userId];
      const plat = platById[review.dishId];
      const haystack = [
        review.comment,
        review.status,
        user?.email,
        user?.nom,
        user?.prenom,
        plat?.nom,
        String(review.id),
        String(review.userId),
        String(review.dishId),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [reviews, search, userById, platById]);

  const approveReview = async (reviewId: number) => {
    setApprovingId(reviewId);
    try {
      const { data } = await reviewsApi.put(`/approve/${reviewId}`);
      setReviews((prev) => prev.map((review) => (review.id === reviewId ? data : review)));
      toast.success("Avis approuve");
    } catch {
      toast.error("Erreur lors de l'approbation");
    } finally {
      setApprovingId(null);
    }
  };

  const formatDate = (value: string) => {
    try {
      return new Date(parseDate(value)).toLocaleString("fr-FR");
    } catch {
      return "—";
    }
  };

  return (
    <AdminLayout>
      <PageHeader title="Reviews Management" description="Consulter et approuver les avis clients">
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />
          Actualiser
        </Button>
      </PageHeader>

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un avis..." className="pl-10" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full" />
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Plat</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Commentaire</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[120px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    Aucun avis trouve.
                  </TableCell>
                </TableRow>
              ) : (
                filteredReviews
                  .slice()
                  .sort((a, b) => new Date(parseDate(b.createdAt)).getTime() - new Date(parseDate(a.createdAt)).getTime())
                  .map((review) => {
                    const user = userById[review.userId];
                    const plat = platById[review.dishId];
                    return (
                      <TableRow key={review.id}>
                        <TableCell className="font-medium">#{review.id}</TableCell>
                        <TableCell>{plat?.nom || `Plat #${review.dishId}`}</TableCell>
                        <TableCell>
                          <div className="min-w-[180px]">
                            <p className="font-medium text-sm">
                              {[user?.prenom, user?.nom].filter(Boolean).join(" ") || `User #${review.userId}`}
                            </p>
                            <p className="text-xs text-muted-foreground">{user?.email || "Email inconnu"}</p>
                          </div>
                        </TableCell>
                        <TableCell><StarRating rating={review.rating} size="md" /></TableCell>
                        <TableCell className="max-w-[320px] whitespace-normal break-words">{review.comment}</TableCell>
                        <TableCell><StatusBadge status={review.status} /></TableCell>
                        <TableCell className="text-sm text-muted-foreground">{formatDate(review.createdAt)}</TableCell>
                        <TableCell>
                          {review.status === "PENDING" ? (
                            <Button
                              size="sm"
                              onClick={() => approveReview(review.id)}
                              disabled={approvingId === review.id}
                              className="gradient-primary text-primary-foreground"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              {approvingId === review.id ? "..." : "Approuver"}
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground">Aucune</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </AdminLayout>
  );
}
