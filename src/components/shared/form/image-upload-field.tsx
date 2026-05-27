"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { AnyFieldApi } from "@tanstack/react-form";
import { Loader2, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") return error;
  if (error && typeof error === "object") {
    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }
  }
  return String(error);
};

interface ImageUploadFieldProps {
  field: AnyFieldApi;
  label?: string;
  noLabel?: boolean;
  className?: string;
  previewClassName?: string;
  noPreviewClassName?: string;
}

export function ImageUploadField({
  field,
  label = "Upload Image",
  noLabel = false,
  className,
  previewClassName,
  noPreviewClassName,
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const firstError =
    field.state.meta.isTouched && field.state.meta.errors.length > 0
      ? getErrorMessage(field.state.meta.errors[0])
      : null;
  const hasError = firstError !== null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a local preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Upload to our API
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.error) {
        setPreview(null);
        field.handleChange("");
        toast.error(data.error || "Failed to upload image");
      }

      if (data.url) {
        field.handleChange(data.url);
      }
    } catch {
      setPreview(null);
      field.handleChange("");
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setPreview(null);
    field.handleChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const displayImage = preview || field.state.value;

  return (
    <div className={cn("space-y-2", className)}>
      {!noLabel && (
        <Label
          htmlFor={field.name}
          className={cn(hasError && "text-destructive", "text-slate-700 dark:text-slate-300")}
        >
          {label}
        </Label>
      )}
      <div className="flex flex-col items-center gap-4">
        <input
          id={field.name}
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        {!displayImage ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "w-full h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all gap-2 group",
              hasError && "border-destructive",
              noPreviewClassName
            )}
          >
            <UploadCloud className="w-8 h-8 text-slate-400 dark:text-slate-500 group-hover:text-primary transition-colors" />
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-primary">
              Click to upload
            </span>
          </div>
        ) : (
          <div
            className={cn(
              "relative w-full aspect-video max-h-[200px] border-2 border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden group",
              previewClassName
            )}
          >
            <Image
              src={displayImage}
              alt="Preview"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={cn("object-cover")}
              unoptimized={displayImage.startsWith("blob:")}
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white gap-2">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-xs font-medium">Uploading...</span>
              </div>
            )}
            {!isUploading && (
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md z-10"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
      {hasError && (
        <p
          id={`${field.name}-error`}
          role="alert"
          className="text-sm text-destructive"
        >
          {firstError}
        </p>
      )}
    </div>
  );
}