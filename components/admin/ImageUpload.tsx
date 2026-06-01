"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ImageUploadProps {
  bucket: string;
  value: string | null;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({
  bucket,
  value,
  onChange,
  label,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const filename = `${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filename, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
      onChange(data.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setLoading(false);
      // Reset input so the same file can be re-selected if needed
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  // Determine whether the value is a full URL or a local path
  const isUrl = value && (value.startsWith("http://") || value.startsWith("https://"));
  const isLocalPath = value && value.startsWith("/");
  const hasImage = Boolean(value);

  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-gray-700">{label}</Label>
      )}

      <div
        className={`relative ${
          hasImage
            ? "inline-block"
            : "flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50 hover:bg-gray-100 transition-colors"
        }`}
      >
        {hasImage ? (
          <div className="relative group">
            {isUrl || isLocalPath ? (
              <Image
                src={value!}
                alt={label ?? "Image preview"}
                width={400}
                height={192}
                unoptimized
                className="rounded-lg max-h-48 w-auto object-cover block"
              />
            ) : (
              // Fallback for any other value format
              <Image
                src={value!}
                alt={label ?? "Image preview"}
                width={400}
                height={192}
                unoptimized
                className="rounded-lg max-h-48 w-auto object-cover block"
              />
            )}

            {/* Overlay on hover */}
            <div className="absolute inset-0 rounded-lg bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => inputRef.current?.click()}
                disabled={loading}
                className="bg-white text-gray-800 hover:bg-gray-100"
              >
                <Upload size={14} />
                Change Image
              </Button>
            </div>
          </div>
        ) : (
          <>
            {loading ? (
              <div className="flex flex-col items-center gap-2">
                <svg
                  className="animate-spin h-8 w-8 text-[#B8001F]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-label="Uploading"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                <span className="text-sm text-gray-500">Uploading…</span>
              </div>
            ) : (
              <>
                <Upload size={32} className="text-gray-400" />
                <p className="text-sm text-gray-500 text-center">
                  No image selected
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => inputRef.current?.click()}
                >
                  <Upload size={14} />
                  Upload Image
                </Button>
              </>
            )}
          </>
        )}
      </div>

      {/* Loading indicator below image when an image is already set */}
      {hasImage && loading && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <svg
            className="animate-spin h-4 w-4 text-[#B8001F]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-label="Uploading"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          Uploading…
        </div>
      )}

      {/* Change Image button below the preview (always visible, not just on hover) */}
      {hasImage && !loading && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
        >
          <Upload size={14} />
          Change Image
        </Button>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
