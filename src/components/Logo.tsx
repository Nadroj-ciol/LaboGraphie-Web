const Logo = ({ isDark = false }: { isDark?: boolean }) => {
  return (
    <div className="flex items-center gap-2.5 group">
      <img
        src="/logo.png"
        alt="Labo"
        className="w-10 h-10 object-contain transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-3"
      />
      <span className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-foreground"}`}>
        Labo<span className="text-tertiary">Graphie</span>
      </span>
    </div>
  );
};

export default Logo;
