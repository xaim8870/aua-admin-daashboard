import { useRef } from "react";
import { useMedia, useUploadMedia } from "./useMedia";
import { PageHeader } from "@/components/PageHeader";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/formatters";
import { Upload, ImageIcon, FileText } from "lucide-react";
import { toast } from "sonner";

export function MediaLibrary() {
  const { data: media, isLoading, error, refetch } = useMedia();
  const uploadMedia = useUploadMedia();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (error) return <ErrorState onRetry={refetch} />;

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    toast.promise(uploadMedia.mutateAsync(file), {
      loading: 'Uploading...',
      success: 'File uploaded successfully!',
      error: 'Failed to upload file',
    });
    
    // reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Media Library" description="Manage images and files.">
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileChange}
          accept="image/*,application/pdf"
        />
        <Button onClick={handleUploadClick} disabled={uploadMedia.isPending}>
          {uploadMedia.isPending ? "Uploading..." : <><Upload className="mr-2 h-4 w-4" /> Upload File</>}
        </Button>
      </PageHeader>

      {isLoading ? (
        <LoadingState type="cards" count={8} />
      ) : media?.length === 0 ? (
        <EmptyState 
          icon={ImageIcon} 
          title="No media files" 
          description="Upload images or documents to use across your site."
          action={{ label: "Upload File", onClick: handleUploadClick }}
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media?.map(asset => (
            <div key={asset.id} className="group relative border rounded-lg bg-card overflow-hidden hover:shadow-md transition-all">
              <div className="aspect-square bg-muted flex items-center justify-center relative overflow-hidden">
                {asset.type.startsWith('image/') ? (
                  <img src={asset.url} alt={asset.name} className="object-cover w-full h-full" />
                ) : (
                  <FileText className="h-10 w-10 text-muted-foreground opacity-50" />
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button variant="secondary" size="sm" onClick={() => {
                    navigator.clipboard.writeText(asset.url);
                    toast.success("URL copied to clipboard");
                  }}>
                    Copy URL
                  </Button>
                </div>
              </div>
              <div className="p-3">
                <div className="text-xs font-medium truncate" title={asset.name}>{asset.name}</div>
                <div className="flex items-center justify-between mt-1 text-[10px] text-muted-foreground">
                  <span>{formatFileSize(asset.size)}</span>
                  <span>{asset.type.split('/')[1]?.toUpperCase()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
