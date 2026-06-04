import { assertAdmin } from "@/lib/supabase/guards";

import { LocationsClient } from "@/components/admin/locations/LocationsClient";

export const metadata = {
  title: "Locații · Admin FitEducation",
};

export default async function AdminLocationsPage() {
  const { supabase } = await assertAdmin();

  const { data } = await supabase
    .from("locations")
    .select("*")
    .order("name");

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Locații</h1>
        <p className="text-sm text-muted-foreground">
          Sălile și studiourile unde se desfășoară sesiunile.
        </p>
      </div>

      <LocationsClient items={data ?? []} />
    </div>
  );
}
