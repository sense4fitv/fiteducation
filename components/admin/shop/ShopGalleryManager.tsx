"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImagePlus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  deleteShopImage,
  moveShopImage,
  uploadShopImage,
} from "@/app/admin/shop/_actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type GalleryImage = {
  id: string;
  url: string | null;
  alt: string | null;
};

export function ShopGalleryManager({
  productId,
  images,
}: {
  productId: string;
  images: GalleryImage[];
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, startUpload] = useTransition();
  const [isMutating, startMutation] = useTransition();
  const [dragging, setDragging] = useState(false);

  function upload(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Selectează un fișier imagine.");
      return;
    }
    const fd = new FormData();
    fd.append("id", productId);
    fd.append("file", file);
    startUpload(async () => {
      const result = await uploadShopImage(null, fd);
      if (result?.ok) toast.success("Imagine adăugată");
      else if (result && result.ok === false) toast.error(result.error);
      if (inputRef.current) inputRef.current.value = "";
    });
  }

  function move(imageId: string, direction: "up" | "down") {
    startMutation(async () => {
      try {
        await moveShopImage(imageId, direction);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Eroare la reordonare");
      }
    });
  }

  function remove(imageId: string) {
    if (!window.confirm("Ștergi această fotografie?")) return;
    startMutation(async () => {
      try {
        await deleteShopImage(imageId);
        toast.success("Fotografie ștearsă");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Eroare la ștergere");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-8 text-center transition-colors ${
          dragging
            ? "border-foreground/40 bg-muted/60"
            : "border-border bg-muted/20 hover:bg-muted/40"
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          upload(e.dataTransfer.files?.[0] ?? null);
        }}
      >
        <ImagePlus className="size-7 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">
          {isUploading
            ? "Se încarcă…"
            : "Trage o fotografie aici sau click pentru a selecta. Max 5 MB."}
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => upload(e.target.files?.[0] ?? null)}
      />

      {images.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
          Nicio fotografie încărcată.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="space-y-2 rounded-lg border border-border bg-card p-3"
            >
              <div className="relative aspect-square overflow-hidden rounded-md bg-muted/40">
                {image.url ? (
                  <Image
                    src={image.url}
                    alt={image.alt ?? ""}
                    fill
                    unoptimized
                    sizes="320px"
                    className="object-contain p-1"
                  />
                ) : null}
                {index === 0 ? (
                  <Badge className="absolute left-2 top-2">Copertă</Badge>
                ) : null}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Mută mai devreme"
                    disabled={index === 0 || isMutating}
                    onClick={() => move(image.id, "up")}
                  >
                    <ChevronLeft />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Mută mai târziu"
                    disabled={index === images.length - 1 || isMutating}
                    onClick={() => move(image.id, "down")}
                  >
                    <ChevronRight />
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Șterge"
                  disabled={isMutating}
                  onClick={() => remove(image.id)}
                >
                  <Trash2 className="text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
