"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { ImagePlus, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { TrainerActionState } from "@/app/admin/trainers/_actions";
import { Button } from "@/components/ui/button";

type SaveAction = (
  prev: TrainerActionState,
  fd: FormData,
) => Promise<TrainerActionState>;

export function ImageUploader({
  entityId,
  currentUrl,
  uploadAction,
  removeAction,
  label = "Imagine",
  hint,
}: {
  entityId: string;
  currentUrl: string | null;
  uploadAction: SaveAction;
  removeAction: (id: string) => Promise<void>;
  label?: string;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isUploading, startUpload] = useTransition();
  const [isRemoving, startRemove] = useTransition();

  function handlePick(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Selectează un fișier imagine.");
      return;
    }
    setPendingFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(String(e.target?.result ?? ""));
    reader.readAsDataURL(file);
  }

  function handleUpload() {
    if (!pendingFile) return;
    const fd = new FormData();
    fd.append("id", entityId);
    fd.append("file", pendingFile);
    startUpload(async () => {
      const result = await uploadAction(null, fd);
      if (result?.ok) {
        toast.success("Imagine încărcată");
        setPendingFile(null);
      } else if (result && result.ok === false) {
        toast.error(result.error);
        setPreview(currentUrl);
        setPendingFile(null);
      }
    });
  }

  function handleRemove() {
    if (!window.confirm("Ștergi imaginea curentă?")) return;
    startRemove(async () => {
      try {
        await removeAction(entityId);
        setPreview(null);
        setPendingFile(null);
        toast.success("Imagine ștearsă");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Eroare la ștergere");
      }
    });
  }

  function handleCancel() {
    setPreview(currentUrl);
    setPendingFile(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {hint ? (
          <p className="text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </div>

      <div
        className="relative flex aspect-square w-full max-w-xs cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-muted/30 transition-colors hover:bg-muted/50"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) handlePick(file);
        }}
      >
        {preview ? (
          <Image
            src={preview}
            alt=""
            fill
            unoptimized
            sizes="320px"
            className="object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 p-6 text-center text-muted-foreground">
            <ImagePlus className="size-8" />
            <p className="text-xs">
              Trage o imagine aici sau click pentru a selecta
            </p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handlePick(e.target.files?.[0] ?? null)}
      />

      <div className="flex flex-wrap items-center gap-2">
        {pendingFile ? (
          <>
            <Button
              type="button"
              onClick={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? "Se încarcă…" : "Salvează imaginea"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              disabled={isUploading}
            >
              Anulează
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => inputRef.current?.click()}
            >
              <RefreshCw />
              {currentUrl ? "Înlocuiește" : "Selectează imagine"}
            </Button>
            {currentUrl ? (
              <Button
                type="button"
                variant="destructive"
                onClick={handleRemove}
                disabled={isRemoving}
              >
                <Trash2 />
                Șterge
              </Button>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
