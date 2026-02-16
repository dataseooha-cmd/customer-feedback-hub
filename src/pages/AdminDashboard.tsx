import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogOut, Settings, BarChart3, Users } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { ResponsesTable } from "@/components/admin/ResponsesTable";
import { SettingsPanel } from "@/components/admin/SettingsPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (!session) {
          navigate("/admin");
        }
      }
    );

    checkAuth();

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/admin");
      return;
    }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .single();

    if (roles?.role !== "admin") {
      await supabase.auth.signOut();
      toast.error("Akses ditolak. Anda bukan admin.");
      navigate("/admin");
      return;
    }

    setUser(session.user);
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Berhasil logout");
    navigate("/admin");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(0_0%_96%)]">
      <header className="border-b border-[hsl(0_0%_90%)] bg-white">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-[hsl(0_0%_15%)] flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-semibold text-[hsl(0_0%_15%)]">Admin Panel</h1>
              <p className="text-xs text-[hsl(0_0%_55%)] truncate">{user?.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1.5 text-[hsl(0_0%_55%)] hover:text-[hsl(0_0%_15%)] hover:bg-[hsl(0_0%_96%)] flex-shrink-0">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Tabs defaultValue="responses" className="space-y-6">
          <TabsList className="grid w-full max-w-xs grid-cols-2 bg-white border border-[hsl(0_0%_90%)] rounded-lg p-1">
            <TabsTrigger value="responses" className="gap-1.5 text-xs rounded-md data-[state=active]:bg-[hsl(0_0%_15%)] data-[state=active]:text-white">
              <Users className="w-3.5 h-3.5" />
              Responses
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-1.5 text-xs rounded-md data-[state=active]:bg-[hsl(0_0%_15%)] data-[state=active]:text-white">
              <Settings className="w-3.5 h-3.5" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="responses">
            <ResponsesTable />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsPanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
