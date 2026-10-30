"use client";

import { useRef, useState } from "react";
import { Loader2, UploadCloud } from "lucide-react";

import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  onFileSelected: (file: File) => void;
  uploading?: boolean;
  accept?: string;
  label?: string;
  hint?: string;
}

export function FileDropzone({
  onFileSelected,
  uploading = false,
  accept = ".pdf,.jpg,.jpeg,.png,.doc,.docx",
  label = "Drag & drop a file here, or click to browse",
  hint = "PDF, JPG, PNG, DOC, or DOCX",
}: FileDropzoneProps) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file) {
      onFileSelected(file);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-disabled={uploading}
      onClick={() => !uploading && inputRef.current?.click()}
      onKeyDown={(event) => {
        if (!uploading && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(event) => {
        event.preventDefault();
        if (!uploading) setIsDraggingOver(true);
      }}
      onDragLeave={() => setIsDraggingOver(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDraggingOver(false);
        if (!uploading) handleFiles(event.dataTransfer.files);
      }}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition-colors",
        uploading && "cursor-not-allowed opacity-70",
        isDraggingOver
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50 hover:bg-muted/40"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        disabled={uploading}
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = "";
        }}
      />

      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
        {uploading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <UploadCloud className="h-5 w-5" />
        )}
      </div>

      <p className="text-sm font-medium">
        {uploading ? "Uploading..." : label}
      </p>

      {!uploading && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
