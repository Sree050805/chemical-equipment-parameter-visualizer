import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileSpreadsheet, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>;
  isUploading: boolean;
}

export function FileUpload({ onUpload, isUploading }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles[0]);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv'],
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  return (
    <div className="w-full max-w-xl mx-auto mt-12">
      <div
        {...getRootProps()}
        className={cn(
          "relative overflow-hidden rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 ease-out cursor-pointer",
          isDragActive 
            ? "border-primary bg-primary/5 scale-[1.02]" 
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
          isUploading && "pointer-events-none opacity-50"
        )}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center gap-4">
          <div className={cn(
            "h-16 w-16 rounded-full flex items-center justify-center transition-colors duration-300",
            isDragActive ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
          )}>
            {isUploading ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
              <Upload className="h-8 w-8" />
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold tracking-tight">
              {isUploading ? "Processing Dataset..." : "Upload Equipment Data"}
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Drag and drop your CSV file here, or click to browse.
              Supports standard equipment parameter format.
            </p>
          </div>

          {!isUploading && (
            <Button variant="secondary" className="mt-4 pointer-events-none">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Select CSV File
            </Button>
          )}
        </div>

        {/* Decorative gradient background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
    </div>
  );
}
