import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Download, RefreshCw, Star, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { REFERRAL_SOURCES, REGISTRATION_OPTIONS, SPEED_OPTIONS, CS_SERVICE_OPTIONS, EXPERIENCE_OPTIONS, ACCESS_OPTIONS, YES_NO_OPTIONS, CS_MEDIA_OPTIONS } from "@/types/survey";

interface Response {
  id: string;
  created_at: string;
  user_id: string;
  whatsapp: string;
  referral_source: string;
  referral_other: string | null;
  registration_ease: string;
  deposit_speed: string;
  withdraw_speed: string;
  cs_service: string;
  togel_experience: string;
  slot_experience: string;
  casino_experience: string;
  access_ease: string;
  would_recommend: string;
  data_security: string;
  withdraw_issue: string;
  preferred_cs_media: string;
  overall_rating: number;
  suggestions: string | null;
}

function getLabel(options: { value: string; label: string }[], value: string): string {
  return options.find((opt) => opt.value === value)?.label || value;
}

export function ResponsesTable() {
  const [responses, setResponses] = useState<Response[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadResponses();
  }, []);

  const loadResponses = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("responses")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Gagal memuat data");
      console.error(error);
    } else {
      setResponses((data as Response[]) || []);
    }
    setIsLoading(false);
  };

  const filteredResponses = responses.filter((r) =>
    r.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.whatsapp.includes(searchTerm)
  );

  const exportToCSV = () => {
    const headers = [
      "Tanggal",
      "User ID",
      "WhatsApp",
      "Sumber Referral",
      "Sumber Lainnya",
      "Kemudahan Pendaftaran",
      "Kecepatan Deposit",
      "Kecepatan Withdraw",
      "Pelayanan CS",
      "Pengalaman Togel",
      "Pengalaman Slot",
      "Pengalaman Casino",
      "Akses Link",
      "Akan Merekomendasikan",
      "Keamanan Data",
      "Kendala Withdraw",
      "Media CS",
      "Rating",
      "Saran"
    ];

    const rows = filteredResponses.map((r) => [
      format(new Date(r.created_at), "dd/MM/yyyy HH:mm"),
      r.user_id,
      r.whatsapp,
      getLabel(REFERRAL_SOURCES, r.referral_source),
      r.referral_other || "",
      getLabel(REGISTRATION_OPTIONS, r.registration_ease),
      getLabel(SPEED_OPTIONS, r.deposit_speed),
      getLabel(SPEED_OPTIONS, r.withdraw_speed),
      getLabel(CS_SERVICE_OPTIONS, r.cs_service),
      getLabel(EXPERIENCE_OPTIONS, r.togel_experience),
      getLabel(EXPERIENCE_OPTIONS, r.slot_experience),
      getLabel(EXPERIENCE_OPTIONS, r.casino_experience),
      getLabel(ACCESS_OPTIONS, r.access_ease),
      getLabel(YES_NO_OPTIONS, r.would_recommend),
      getLabel(YES_NO_OPTIONS, r.data_security),
      getLabel(YES_NO_OPTIONS, r.withdraw_issue),
      getLabel(CS_MEDIA_OPTIONS, r.preferred_cs_media),
      r.overall_rating.toString(),
      r.suggestions || ""
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `survey-responses-${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();

    toast.success("Data berhasil diekspor");
  };

  const averageRating = responses.length > 0
    ? (responses.reduce((sum, r) => sum + r.overall_rating, 0) / responses.length).toFixed(1)
    : "0";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-card rounded-lg border border-border">
          <p className="text-sm text-muted-foreground">Total Responses</p>
          <p className="text-3xl font-display font-bold text-foreground">{responses.length}</p>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <p className="text-sm text-muted-foreground">Rata-rata Rating</p>
          <div className="flex items-center gap-2">
            <Star className="w-6 h-6 fill-survey-star text-survey-star" />
            <p className="text-3xl font-display font-bold text-foreground">{averageRating}</p>
          </div>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <p className="text-sm text-muted-foreground">Akan Merekomendasikan</p>
          <p className="text-3xl font-display font-bold text-survey-success">
            {responses.filter((r) => r.would_recommend === "ya").length}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cari User ID atau WhatsApp..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadResponses} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button onClick={exportToCSV} className="gap-2 survey-gradient border-0">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>Sumber</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Rekomendasi</TableHead>
                <TableHead>Saran</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                  </TableCell>
                </TableRow>
              ) : filteredResponses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Belum ada data
                  </TableCell>
                </TableRow>
              ) : (
                filteredResponses.map((response) => (
                  <TableRow key={response.id}>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(response.created_at), "dd MMM yyyy HH:mm", { locale: localeId })}
                    </TableCell>
                    <TableCell className="font-medium">{response.user_id}</TableCell>
                    <TableCell>{response.whatsapp}</TableCell>
                    <TableCell>{getLabel(REFERRAL_SOURCES, response.referral_source)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-survey-star text-survey-star" />
                        {response.overall_rating}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        response.would_recommend === "ya"
                          ? "bg-survey-success/20 text-survey-success"
                          : "bg-destructive/20 text-destructive"
                      }`}>
                        {response.would_recommend === "ya" ? "Ya" : "Tidak"}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{response.suggestions || "-"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
