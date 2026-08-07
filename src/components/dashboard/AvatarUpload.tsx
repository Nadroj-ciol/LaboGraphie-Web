import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AvatarUploadProps {
  userId: string;
  url: string | null | undefined;
  userName: string;
  onUpload: (url: string) => void;
}

export function AvatarUpload({ userId, url, userName, onUpload }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);

  const userInitials = userName.slice(0, 2).toUpperCase() || "U";

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("Vous devez sélectionner une image à uploader.");
      }

      const file = event.target.files[0];
      
      // Limiter à 2Mo
      if (file.size > 2 * 1024 * 1024) {
        throw new Error("L'image est trop lourde (2 Mo maximum).");
      }

      const fileExt = file.name.split(".").pop();
      // Nom unique pour éviter le cache: uid/timestamp.ext
      const filePath = `${userId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // Récupérer l'URL publique
      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      onUpload(data.publicUrl);
    } catch (error) {
      toast.error("Erreur lors de l'upload : " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative group mx-auto w-24 h-24 mb-4">
      <Avatar className="h-24 w-24 border-2 border-border shadow-sm">
        <AvatarImage src={url || undefined} alt={userName} className="object-cover" />
        <AvatarFallback className="bg-primary text-white text-2xl font-medium">
          {userInitials}
        </AvatarFallback>
      </Avatar>
      
      {/* Overlay au survol avec curseur */}
      <label 
        htmlFor="avatar-upload" 
        className="absolute inset-0 bg-black/50 text-white rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer overflow-hidden"
      >
        {uploading ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          <Camera className="h-6 w-6" />
        )}
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </label>
    </div>
  );
}
