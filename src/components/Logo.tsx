import { FlaskConical } from "lucide-react";

const Logo = ({ isDark = false }: { isDark?: boolean }) => {
  return (
    <div className="flex items-center gap-2.5 group">
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-tertiary to-tertiary/80 shadow-lg shadow-tertiary/20 transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-3">
        <FlaskConical className="w-5 h-5 text-primary" strokeWidth={2.5} />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-tertiary shadow-sm" />
      </div>
      <span className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-primary"}`}>
        Labo<span className="text-tertiary">Graphie</span>
      </span>
    </div>
  );
};

export default Logo;
