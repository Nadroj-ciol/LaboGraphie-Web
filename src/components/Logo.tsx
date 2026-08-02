const Logo = ({ isDark = false }: { isDark?: boolean }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 32 32"
          fill="none"
          aria-hidden="true"
        >
          <rect width="32" height="32" rx="9" className="fill-tertiary" />
          <path
            d="M13 6.5h6v2h-1.4v5.1c0 .6.15 1.18.44 1.7l4.6 8.2c.9 1.6-.26 3.6-2.1 3.6H11.46c-1.84 0-3-2-2.1-3.6l4.6-8.2c.29-.52.44-1.1.44-1.7V8.5H13v-2Z"
            className="fill-primary"
          />
          <circle cx="14" cy="22" r="1.6" className="fill-tertiary" />
          <circle cx="18.4" cy="24.4" r="1.1" className="fill-tertiary" />
        </svg>
      </div>
      <span className={`text-2xl font-bold ${isDark ? "text-white" : "text-primary"}`}>
        Labo<span className="text-tertiary">graphie</span>
      </span>
    </div>
  );
};

export default Logo;
