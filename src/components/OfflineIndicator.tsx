import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Wifi, WifiOff } from "lucide-react";

const OfflineIndicator = () => {
  const { t } = useTranslation();
  const [isOffline, setIsOffline] = useState(typeof navigator !== 'undefined' ? !navigator.onLine : false);

  useEffect(() => {
    const handleOffline = () => {
      setIsOffline(true);
      toast(t("common.offline.lostTitle"), {
        description: t("common.offline.lostDescription"),
        icon: <WifiOff className="h-5 w-5 text-red-500" />,
        duration: Infinity, // Persistent until online
        id: "offline-toast",
        className: "border-red-200 bg-red-50",
      });
    };

    const handleOnline = () => {
      if (isOffline) {
        setIsOffline(false);
        toast.dismiss("offline-toast");
        toast.success(t("common.offline.restoredTitle"), {
          description: t("common.offline.restoredDescription"),
          icon: <Wifi className="h-5 w-5 text-green-500" />,
          duration: 4000,
        });
      }
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    // Handle initial state if page is loaded while offline
    if (typeof navigator !== 'undefined' && !navigator.onLine && !isOffline) {
      handleOffline();
    }

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [isOffline, t]);

  return null; // Component does not render any visual elements directly
};

export default OfflineIndicator;
