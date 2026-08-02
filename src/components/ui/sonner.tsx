import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-slate-800 group-[.toaster]:border-gray-100 group-[.toaster]:shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-xl border p-4 transition-all duration-300",
          description: "group-[.toast]:text-slate-500 text-sm mt-1",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-white rounded-lg px-3 py-1.5 text-xs font-medium",
          cancelButton: "group-[.toast]:bg-slate-100 group-[.toast]:text-slate-500 rounded-lg px-3 py-1.5 text-xs font-medium",
          error: "group-[.toaster]:bg-red-50 group-[.toaster]:text-red-900 group-[.toaster]:border-red-200 group-[.toaster]:shadow-[0_8px_30px_rgba(239,68,68,0.15)]",
          success: "group-[.toaster]:bg-green-50 group-[.toaster]:text-green-900 group-[.toaster]:border-green-200 group-[.toaster]:shadow-[0_8px_30px_rgba(34,197,94,0.15)]",
          warning: "group-[.toaster]:bg-amber-50 group-[.toaster]:text-amber-900 group-[.toaster]:border-amber-200",
          info: "group-[.toaster]:bg-blue-50 group-[.toaster]:text-blue-900 group-[.toaster]:border-blue-200",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
