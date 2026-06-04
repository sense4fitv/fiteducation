"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Tables } from "@/lib/supabase/types";

import { AudiencesPanel } from "./AudiencesPanel";
import { CertificationsPanel } from "./CertificationsPanel";
import { RequirementsPanel } from "./RequirementsPanel";

export function LibraryClient({
  requirements,
  certifications,
  audiences,
}: {
  requirements: Tables<"requirements">[];
  certifications: Tables<"certifications">[];
  audiences: Tables<"audiences">[];
}) {
  return (
    <Tabs defaultValue="requirements" className="gap-4">
      <TabsList>
        <TabsTrigger value="requirements">
          Cerințe ({requirements.length})
        </TabsTrigger>
        <TabsTrigger value="certifications">
          Certificări ({certifications.length})
        </TabsTrigger>
        <TabsTrigger value="audiences">
          Audiențe ({audiences.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="requirements">
        <RequirementsPanel items={requirements} />
      </TabsContent>
      <TabsContent value="certifications">
        <CertificationsPanel items={certifications} />
      </TabsContent>
      <TabsContent value="audiences">
        <AudiencesPanel items={audiences} />
      </TabsContent>
    </Tabs>
  );
}
