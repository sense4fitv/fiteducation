import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="mx-auto max-w-3xl">
      <Card className="border-zinc-800 bg-zinc-900 text-zinc-100">
        <CardHeader>
          <CardTitle className="text-xl">
            Bun venit{user?.email ? `, ${user.email}` : ""}
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Panou administrare FitEducation.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-zinc-400">
          Funcționalitățile complete (traineri, cursuri, înscrieri) vor fi
          disponibile în secțiunile dedicate, în curând.
        </CardContent>
      </Card>
    </div>
  );
}
