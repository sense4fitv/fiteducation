"use client";

import Image from "next/image";
import { ImageOff } from "lucide-react";

import { Label } from "@/components/ui/label";

export type PickableImage = { id: string; url: string | null };

export function ImagePickerField({
  images,
  value,
  onChange,
}: {
  images: PickableImage[];
  value: string | null;
  onChange: (next: string | null) => void;
}) {
  if (images.length === 0) {
    return (
      <div className="space-y-2">
        <Label>Fotografie</Label>
        <p className="rounded-md border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">
          Încarcă întâi fotografii în tab-ul Fotografii.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>Fotografie</Label>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(null)}
          aria-label="Fără fotografie"
          aria-pressed={value === null}
          className={`flex size-12 items-center justify-center rounded-md border transition-colors ${
            value === null
              ? "border-foreground"
              : "border-border hover:border-foreground/40"
          }`}
        >
          <ImageOff className="size-4 text-muted-foreground" />
        </button>
        {images.map((image) => (
          <button
            key={image.id}
            type="button"
            onClick={() => onChange(image.id)}
            aria-label="Alege fotografia"
            aria-pressed={value === image.id}
            className={`relative size-12 overflow-hidden rounded-md border transition-colors ${
              value === image.id
                ? "border-foreground ring-1 ring-foreground"
                : "border-border hover:border-foreground/40"
            }`}
          >
            {image.url ? (
              <Image
                src={image.url}
                alt=""
                fill
                unoptimized
                sizes="48px"
                className="object-contain p-1"
              />
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}
