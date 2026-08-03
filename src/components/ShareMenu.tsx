import { Share2, MessageCircle, Send, Twitter, Link2 } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Blog } from "@/hooks/useBlogs";

interface ShareMenuProps {
  post: Blog;
  className?: string;
}

export const ShareMenu = ({ post, className }: ShareMenuProps) => {
  const currentUrl = typeof window !== 'undefined' ? `${window.location.origin}/blog/${post.slug}` : '';
  const shareTitle = post.title;

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(currentUrl);
    toast.success("Lien copié dans le presse-papiers !");
  };

  return (
    <div onClick={(e) => e.stopPropagation()} className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            className="w-10 h-10 bg-white/90 backdrop-blur-sm shadow-sm rounded-full flex items-center justify-center text-slate-700 hover:text-primary hover:bg-white transition-all cursor-pointer"
            title="Partager l'article"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 rounded-xl p-2 z-50">
          <DropdownMenuItem asChild className="cursor-pointer mb-1 hover:bg-[#25D366]/10 hover:text-[#25D366]">
            <a href={`https://wa.me/?text=${encodeURIComponent(shareTitle + " : " + currentUrl)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 w-full">
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild className="cursor-pointer mb-1 hover:bg-[#0088cc]/10 hover:text-[#0088cc]">
            <a href={`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareTitle)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 w-full">
              <Send className="w-4 h-4" />
              <span>Telegram</span>
            </a>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="cursor-pointer mb-1 hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2]">
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareTitle)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 w-full">
              <Twitter className="w-4 h-4" />
              <span>X (Twitter)</span>
            </a>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer hover:bg-slate-100">
            <div className="flex items-center gap-3 w-full">
              <Link2 className="w-4 h-4 text-slate-600" />
              <span>Copier le lien (TikTok...)</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
