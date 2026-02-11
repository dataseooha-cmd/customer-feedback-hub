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
    <div className="min-h-screen bg-muted">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-foreground flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-background" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-foreground">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1.5 text-muted-foreground hover:text-foreground">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="responses" className="space-y-6">
          <TabsList className="grid w-full max-w-xs grid-cols-2 bg-card border border-border">
            <TabsTrigger value="responses" className="gap-1.5 text-xs">
              <Users className="w-3.5 h-3.5" />
              Responses
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-1.5 text-xs">
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
