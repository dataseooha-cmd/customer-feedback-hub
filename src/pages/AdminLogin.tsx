import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .single();
        if (roles?.role === "admin") {
          navigate("/admin/dashboard");
        }
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      const { data: roles, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .single();

      if (roleError || roles?.role !== "admin") {
        await supabase.auth.signOut();
        throw new Error("Anda tidak memiliki akses admin");
      }

      toast.success("Login berhasil!");
      navigate("/admin/dashboard");
    } catch (error: any) {
      if (import.meta.env.DEV) console.error("Login error:", error);
      toast.error(error.message || "Email atau password salah");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center px-3 sm:px-4">
      <div className="w-full max-w-sm">
        <div className="bg-card rounded-xl shadow-sm border border-border p-8">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-full bg-foreground flex items-center justify-center">
              <Lock className="w-5 h-5 text-background" />
            </div>
          </div>

          <h1 className="text-lg font-semibold text-center text-foreground mb-1">
            Admin Login
          </h1>
          <p className="text-xs text-muted-foreground text-center mb-6">
            Masukkan kredensial Anda
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-9"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-9 bg-foreground text-background hover:bg-foreground/90 text-sm font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Masuk"
              )}
            </Button>
          </form>
        </div>

        <p className="text-center mt-4">
          <button
            onClick={() => navigate("/")}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Kembali ke Survei
          </button>
        </p>
      </div>
    </div>
  );
}
