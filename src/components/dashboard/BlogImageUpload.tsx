import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, UploadCloud, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface BlogImageUploadProps {
  url: string | null;
  onUpload: (url: string) => void;
}

export function BlogImageUpload({ url, onUpload }: BlogImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("Vous devez sélectionner une image.");
      }

      const file = event.target.files[0];
      
      // Limiter à 5Mo pour les articles
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("L'image est trop lourde (5 Mo maximum).");
      }

      const fileExt = file.name.split(".").pop();
      // Nom unique pour l'image
      const filePath = `post_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("blog_images")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // Récupérer l'URL publique
      const { data } = supabase.storage
        .from("blog_images")
        .getPublicUrl(filePath);

      onUpload(data.publicUrl);
    } catch (error) {
      toast.error("Erreur lors de l'upload : " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      <label 
        className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer overflow-hidden transition-colors ${
          url ? "border-primary/50 bg-primary/5" : "border-border bg-muted hover:bg-muted"
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center justify-center text-muted-foreground z-10">
            <Loader2 className="h-8 w-8 animate-spin mb-2 text-primary" />
            <span className="text-sm font-medium">Téléchargement en cours...</span>
          </div>
        ) : url ? (
          <div className="relative w-full h-full p-2 group">
            <img src={url} alt="Aperçu de la couverture" className="w-full h-full object-cover rounded-lg shadow-sm" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center m-2">
              <span className="text-white font-medium flex items-center gap-2">
                <UploadCloud className="w-5 h-5" /> Changer la couverture
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted-foreground z-10">
            <div className="p-3 bg-card rounded-full shadow-sm mb-3">
              <ImageIcon className="w-6 h-6 text-primary" />
            </div>
            <p className="mb-1 text-sm font-semibold text-muted-foreground">Cliquez pour ajouter une image de couverture</p>
            <p className="text-xs">PNG, JPG ou WEBP (Max. 5Mo)</p>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={uploadImage}
          disabled={uploading}
        />
      </label>
    </div>
  );
}
