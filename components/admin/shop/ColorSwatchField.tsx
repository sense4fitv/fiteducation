"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const FALLBACK = "#b8001f";

export function ColorSwatchField({
  value,
  onChange,
  idPrefix,
}: {
  value: string | null;
  onChange: (next: string | null) => void;
  idPrefix: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={`${idPrefix}-hex`}>Culoare (swatch)</Label>
      <div className="flex items-center gap-2">
        <input
          id={`${idPrefix}-hex`}
          type="color"
          value={value ?? FALLBACK}
          onChange={(e) => onChange(e.target.value.toLowerCase())}
          className="size-9 cursor-pointer rounded-md border border-border bg-transparent p-1"
        />
        <Input
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value.trim() || null)}
          placeholder="#1a2b3c"
          aria-label="Cod culoare"
          className="w-32 font-mono text-xs"
        />
        {value ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Fără culoare"
            onClick={() => onChange(null)}
          >
            <X />
          </Button>
        ) : null}
      </div>
    </div>
  );
}
